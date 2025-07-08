const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Armazenamento em memória para sessões (em produção, usar banco de dados)
const gameSessions = new Map();
const sessionUsers = new Map();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Entrar em uma sessão
    socket.on('join-session', (sessionId, userId, userType) => {
      socket.data = { userId, sessionId, userType };
      
      socket.join(sessionId);
      
      if (!sessionUsers.has(sessionId)) {
        sessionUsers.set(sessionId, new Set());
      }
      sessionUsers.get(sessionId).add(userId);
      
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
      if (sessionUsers.has(sessionId) && socket.data?.userId) {
        sessionUsers.get(sessionId).delete(socket.data.userId);
      }
      console.log(`User ${socket.data?.userId} left session ${sessionId}`);
    });

    // Enviar mensagem no chat
    socket.on('send-message', (sessionId, message) => {
      const chatMessage = {
        id: Date.now().toString(),
        senderId: socket.data?.userId || 'unknown',
        senderName: getUserName(socket.data?.userId || 'unknown'),
        message,
        timestamp: new Date(),
        type: 'message'
      };
      
      io.to(sessionId).emit('chat-message', chatMessage);
      
      // Atualizar sessão
      const gameSession = gameSessions.get(sessionId);
      if (gameSession) {
        if (!gameSession.chatLog) gameSession.chatLog = [];
        gameSession.chatLog.push(chatMessage);
      }
    });

    // Ação do jogador
    socket.on('player-action', (sessionId, action, data) => {
      console.log(`Player ${socket.data?.userId} performed action: ${action}`, data);
      
      // Notificar o mestre sobre a ação
      socket.to(sessionId).emit('player-action', socket.data?.userId, action, data);
      
      // Processar ação específica
      handlePlayerAction(sessionId, socket.data?.userId || 'unknown', action, data, io);
    });

    // Rolagem de dados
    socket.on('roll-dice', (sessionId, formula, isSecret = false) => {
      const result = rollDice(formula);
      const userName = getUserName(socket.data?.userId || 'unknown');
      
      if (isSecret && socket.data?.userType === 'master') {
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
          senderId: socket.data?.userId || 'unknown',
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
      if (gameSession && socket.data?.userType === 'player') {
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
      if (socket.data?.userType === 'master') {
        const gameSession = gameSessions.get(sessionId);
        if (gameSession) {
          gameSession.initiativeOrder = order;
          io.to(sessionId).emit('initiative-updated', order);
          io.to(sessionId).emit('game-state-updated', gameSession);
        }
      }
    });

    socket.on('next-turn', (sessionId) => {
      if (socket.data?.userType === 'master') {
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
      if (socket.data?.userType === 'master') {
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
      if (socket.data?.sessionId && socket.data?.userId) {
        const sessionId = socket.data.sessionId;
        if (sessionUsers.has(sessionId)) {
          sessionUsers.get(sessionId).delete(socket.data.userId);
        }
      }
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

// Funções auxiliares
function rollDice(formula) {
  // Implementação simples de rolagem de dados
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

function getUserName(userId) {
  // Em produção, buscar do banco de dados
  const userNames = {
    'player-1': 'Aragorn',
    'player-2': 'Legolas',
    'player-3': 'Gimli',
    'master-1': 'Dungeon Master'
  };
  return userNames[userId] || 'Unknown User';
}

function handlePlayerAction(sessionId, userId, action, data, io) {
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

