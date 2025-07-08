import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  sessionId: string;
  userId: string;
  userType: 'master' | 'player';
}

export function useSocket({ sessionId, userId, userType }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Criar conexão Socket.IO
    const socket = io({
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Eventos de conexão
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
      
      // Entrar na sessão
      socket.emit('join-session', sessionId, userId, userType);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(err.message);
      setIsConnected(false);
    });

    // Cleanup na desmontagem
    return () => {
      if (socket) {
        socket.emit('leave-session', sessionId);
        socket.disconnect();
      }
    };
  }, [sessionId, userId, userType]);

  // Funções para emitir eventos
  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', sessionId, message);
    }
  };

  const performAction = (action: string, data?: any) => {
    if (socketRef.current) {
      socketRef.current.emit('player-action', sessionId, action, data);
    }
  };

  const rollDice = (formula: string, isSecret = false) => {
    if (socketRef.current) {
      socketRef.current.emit('roll-dice', sessionId, formula, isSecret);
    }
  };

  const endTurn = () => {
    if (socketRef.current) {
      socketRef.current.emit('end-turn', sessionId);
    }
  };

  // Funções específicas do mestre
  const updateInitiative = (order: any[]) => {
    if (socketRef.current && userType === 'master') {
      socketRef.current.emit('update-initiative', sessionId, order);
    }
  };

  const nextTurn = () => {
    if (socketRef.current && userType === 'master') {
      socketRef.current.emit('next-turn', sessionId);
    }
  };

  const moveToken = (tokenId: string, position: { x: number; y: number }) => {
    if (socketRef.current && userType === 'master') {
      socketRef.current.emit('move-token', sessionId, tokenId, position);
    }
  };

  // Função para adicionar listeners de eventos
  const addEventListener = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const removeEventListener = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    sendMessage,
    performAction,
    rollDice,
    endTurn,
    updateInitiative,
    nextTurn,
    moveToken,
    addEventListener,
    removeEventListener,
  };
}

