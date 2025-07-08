import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (gameSessionId: string, token: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
    auth: {
      token,
      gameSessionId,
    },
    transports: ['websocket'],
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Tipos para eventos Socket.IO
export interface GameSessionData {
  sessionId: string;
  masterId: string;
  title: string;
  players: string[];
  mapData: any;
  initiativeOrder: any[];
  currentTurn: string | null;
}

export interface TokenMovedEvent {
  tokenId: string;
  newPosition: { x: number; y: number };
}

export interface DiceRolledEvent {
  rollerId: string;
  formula: string;
  result: number;
  details: any;
  isSecret: boolean;
}

export interface MessageReceivedEvent {
  senderId: string;
  message: string;
  type: 'public' | 'whisper';
  timestamp: Date;
}

export interface InitiativeUpdatedEvent {
  initiativeOrder: Array<{ characterId: string; value: number }>;
}

