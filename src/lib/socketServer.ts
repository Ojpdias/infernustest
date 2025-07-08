import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { GameSession, Character, Monster, InitiativeEntry, Position } from '@/types/game';

export interface ServerToClientEvents {
  // Eventos para todos os usuários
  'game-state-updated': (gameSession: GameSession) => void;
  'chat-message': (message: any) => void;
  'combat-log': (entry: any) => void;
  'initiative-updated': (order: InitiativeEntry[]) => void;
  'turn-changed': (currentTurn: string) => void;
  'token-moved': (tokenId: string, position: Position) => void;
  
  // Eventos específicos para jogadores
  'character-updated': (character: Character) => void;
  'action-result': (result: any) => void;
  
  // Eventos específicos para mestre
  'secret-roll-result': (result: any) => void;
  'player-action': (playerId: string, action: string, data: any) => void;
}

export interface ClientToServerEvents {
  // Eventos de conexão
  'join-session': (sessionId: string, userId: string, userType: 'master' | 'player') => void;
  'leave-session': (sessionId: string) => void;
  
  // Eventos de chat
  'send-message': (sessionId: string, message: string) => void;
  'send-secret-message': (sessionId: string, targetUserId: string, message: string) => void;
  
  // Eventos de ações do jogador
  'player-action': (sessionId: string, action: string, data?: any) => void;
  'roll-dice': (sessionId: string, formula: string, isSecret?: boolean) => void;
  'end-turn': (sessionId: string) => void;
  
  // Eventos do mestre
  'update-initiative': (sessionId: string, order: InitiativeEntry[]) => void;
  'next-turn': (sessionId: string) => void;
  'move-token': (sessionId: string, tokenId: string, position: Position) => void;
  'spawn-token': (sessionId: string, token: any) => void;
  'update-monster': (sessionId: string, monsterId: string, updates: Partial<Monster>) => void;
  'add-monster': (sessionId: string, monster: Omit<Monster, '_id'>) => void;
  'remove-monster': (sessionId: string, monsterId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  sessionId: string;
  userType: 'master' | 'player';
}

// Armazenamento em memória para sessões (em produção, usar banco de dados)
const gameSessions = new Map<string, GameSession>();
const sessionUsers = new Map<string, Set<string>>();

export function initializeSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Entrar em uma sessão
    socket.on('join-session', (sessionId, userId, userType) => {
      socket.data.userId = userId;
      socket.data.sessionId = sessionId;
      socket.data.userType = userType;
      
      socket.join(sessionId);
      
      if (!sessionUsers.has(sessionId)) {
        sessionUsers.set(sessionId, new Set());
      }
      sessionUsers.get(sessionId)!.add(userId);
      
      console.log(`${userType} ${userId} joined session ${sessionId}`);
      
      // Enviar estado atual da sessão
      const gameSession = gameSessions.get(sessionId);
      if (gameSession) {
        socket.emit('game-state-updated', gameSession);
      }
    });

    // Sair de uma sessão
    socket.on('leave-session', (sessionId) => {
      socket.leave(sessionId);
      if (sessionUsers.has(sessionId)) {
        sessionUsers.get(sessionId)!.delete(socket.data.userId);
      }
      console.log(`User ${socket.data.userId} left session ${sessionId}`);
    });

    // Enviar mensagem no chat
    socket.on('send-message', (sessionId, message) => {
      const chatMessage = {
        id: Date.now().toString(),
        senderId: socket.data.userId,
        senderName: getUserName(socket.data.userId),
        message,
        timestamp: new Date(),
        type: 'message'
      };
      
      io.to(sessionId).emit('chat-message', chatMessage);
      
      // Atualizar sessão
      const gameSession = gameSessions.get(sessionId);
      if (gameSession) {
        gameSession.chatLog.push(chatMessage);
      }
    });

    // Ação do jogador
    socket.on('player-action', (sessionId, action, data) => {
      console.log(`Player ${socket.data.userId} performed action: ${action}`, data);
      
      // Notificar o mestre sobre a ação
      socket.to(sessionId).emit('player-action', socket.data.userId, action, data);
      
      // Processar ação específica
      handlePlayerAction(sessionId, socket.data.userId, action, data, io);
    });

    // Rolagem de dados
    socket.on('roll-dice', (sessionId, formula, isSecret = false) => {
      const result = rollDice(formula);
      const userName = getUserName(socket.data.userId);
      
      if (isSecret && socket.data.userType === 'master') {
        // Rolagem secreta - apenas para o mestre
        socket.emit('secret-roll-result', { formula, result, timestamp: new Date() });
      } else {
        // Rolagem pública
        const logEntry = {
          id: Date.now().toString(),
          message: `${userName} rolled ${formula} → ${result}`,
          type: 'system',
          timestamp: new Date(),
          actor: userName
        };
        
        io.to(sessionId).emit('combat-log', logEntry);
        
        const chatMessage = {
          id: Date.now().toString(),
          senderId: socket.data.userId,
          senderName: userName,
          message: `Rolled ${formula}: ${result}`,
          timestamp: new Date(),
          type: 'roll'
        };
        
        io.to(sessionId).emit('chat-message', chatMessage);
      }
    });

    // Finalizar turno
    socket.on('end-turn', (sessionId) => {
      const gameSession = gameSessions.get(sessionId);
      if (gameSession && socket.data.userType === 'player') {
        // Lógica para passar o turno
        const currentIndex = gameSession.initiativeOrder.findIndex(
          entry => entry.characterId === gameSession.currentTurn
        );
        const nextIndex = (currentIndex + 1) % gameSession.initiativeOrder.length;
        gameSession.currentTurn = gameSession.initiativeOrder[nextIndex]?.characterId || null;
        
        io.to(sessionId).emit('turn-changed', gameSession.currentTurn);
        io.to(sessionId).emit('game-state-updated', gameSession);
      }
    });

    // Eventos do mestre
    socket.on('update-initiative', (sessionId, order) => {
      if (socket.data.userType === 'master') {
        const gameSession = gameSessions.get(sessionId);
        if (gameSession) {
          gameSession.initiativeOrder = order;
          io.to(sessionId).emit('initiative-updated', order);
          io.to(sessionId).emit('game-state-updated', gameSession);
        }
      }
    });

    socket.on('next-turn', (sessionId) => {
      if (socket.data.userType === 'master') {
        const gameSession = gameSessions.get(sessionId);
        if (gameSession) {
          const currentIndex = gameSession.initiativeOrder.findIndex(
            entry => entry.characterId === gameSession.currentTurn
          );
          const nextIndex = (currentIndex + 1) % gameSession.initiativeOrder.length;
          gameSession.currentTurn = gameSession.initiativeOrder[nextIndex]?.characterId || null;
          
          io.to(sessionId).emit('turn-changed', gameSession.currentTurn);
          io.to(sessionId).emit('game-state-updated', gameSession);
        }
      }
    });

    socket.on('move-token', (sessionId, tokenId, position) => {
      if (socket.data.userType === 'master') {
        const gameSession = gameSessions.get(sessionId);
        if (gameSession) {
          const token = gameSession.mapData.tokens.find(t => t._id === tokenId);
          if (token) {
            token.x = position.x;
            token.y = position.y;
            
            io.to(sessionId).emit('token-moved', tokenId, position);
            io.to(sessionId).emit('game-state-updated', gameSession);
          }
        }
      }
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (socket.data.sessionId && socket.data.userId) {
        const sessionId = socket.data.sessionId;
        if (sessionUsers.has(sessionId)) {
          sessionUsers.get(sessionId)!.delete(socket.data.userId);
        }
      }
    });
  });

  return io;
}

// Funções auxiliares
function rollDice(formula: string): number {
  // Implementação simples de rolagem de dados
  // Em produção, usar a biblioteca rpg-dice-roller
  const match = formula.match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (match) {
    const numDice = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3]) || 0;
    
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total + modifier;
  }
  return 0;
}

function getUserName(userId: string): string {
  // Em produção, buscar do banco de dados
  const userNames: { [key: string]: string } = {
    'player-1': 'Aragorn',
    'player-2': 'Legolas',
    'player-3': 'Gimli',
    'master-1': 'Dungeon Master'
  };
  return userNames[userId] || 'Unknown User';
}

function handlePlayerAction(
  sessionId: string,
  userId: string,
  action: string,
  data: any,
  io: SocketIOServer
) {
  const gameSession = gameSessions.get(sessionId);
  if (!gameSession) return;

  const userName = getUserName(userId);
  
  switch (action) {
    case 'attack':
      const attackLog = {
        id: Date.now().toString(),
        message: `${userName} attacks!`,
        type: 'attack',
        timestamp: new Date(),
        actor: userName
      };
      io.to(sessionId).emit('combat-log', attackLog);
      break;
      
    case 'cast-spell':
      const spellLog = {
        id: Date.now().toString(),
        message: `${userName} casts a spell!`,
        type: 'spell',
        timestamp: new Date(),
        actor: userName
      };
      io.to(sessionId).emit('combat-log', spellLog);
      break;
      
    case 'use-item':
      const itemLog = {
        id: Date.now().toString(),
        message: `${userName} uses an item!`,
        type: 'system',
        timestamp: new Date(),
        actor: userName
      };
      io.to(sessionId).emit('combat-log', itemLog);
      break;
      
    case 'move':
      const moveLog = {
        id: Date.now().toString(),
        message: `${userName} moves!`,
        type: 'system',
        timestamp: new Date(),
        actor: userName
      };
      io.to(sessionId).emit('combat-log', moveLog);
      break;
  }
}

