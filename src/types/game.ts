// Tipos principais para o jogo Infernus

export interface User {
  _id: string;
  googleId?: string;
  discordId?: string;
  username: string;
  email: string;
  role: 'master' | 'player';
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  _id: string;
  masterId: string;
  title: string;
  description: string;
  players: string[];
  mapData: MapData;
  initiativeOrder: InitiativeEntry[];
  npcs: NPC[];
  monsters: Monster[];
  chatLog: ChatMessage[];
  secretLogs: SecretLog[];
  currentTurn: string | null;
  status: 'active' | 'paused' | 'finished';
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  _id: string;
  userId: string;
  gameSessionId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  conditions: string[];
  stats: CharacterStats;
  inventory: InventoryItem[];
  spells: Spell[];
  abilities: Ability[];
  tokenPosition: Position;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armorClass: number;
  speed: number;
}

export interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
}

export interface Spell {
  _id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface Ability {
  _id: string;
  name: string;
  description: string;
  type: 'passive' | 'active';
  cooldown?: number;
}

export interface Token {
  _id: string;
  gameSessionId: string;
  type: 'player' | 'monster' | 'npc' | 'generic';
  refId: string;
  x: number;
  y: number;
  imageUrl: string;
  size: number;
  isVisible: boolean;
}

export interface Monster {
  _id: string;
  gameSessionId: string;
  name: string;
  type: string;
  hp: number;
  maxHp: number;
  ac: number;
  stats: CharacterStats;
  abilities: Ability[];
  tokenPosition: Position;
  initiative: number;
}

export interface NPC {
  _id: string;
  gameSessionId: string;
  name: string;
  description: string;
  hp?: number;
  tokenPosition: Position;
}

export interface ChatMessage {
  _id: string;
  gameSessionId: string;
  senderId: string;
  senderType: 'user' | 'character' | 'system';
  message: string;
  type: 'public' | 'whisper' | 'secret';
  targetId?: string;
  timestamp: Date;
}

export interface SecretLog {
  _id: string;
  gameSessionId: string;
  masterId: string;
  message: string;
  timestamp: Date;
}

export interface DiceRoll {
  _id: string;
  gameSessionId: string;
  rollerId: string;
  rollerType: 'user' | 'character' | 'system';
  formula: string;
  result: number;
  details: any;
  isSecret: boolean;
  timestamp: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface MapData {
  width: number;
  height: number;
  gridSize: number;
  backgroundImage?: string;
  tokens: Token[];
  fogOfWar: boolean[][];
}

export interface InitiativeEntry {
  characterId: string;
  name: string;
  initiative: number;
  type: 'player' | 'monster' | 'npc';
}

// Tipos para eventos Socket.IO
export interface SocketEvents {
  // Cliente para Servidor
  joinGameSession: (data: { sessionId: string; token: string }) => void;
  'master:moveToken': (data: { sessionId: string; tokenId: string; newPosition: Position }) => void;
  'player:rollDice': (data: { sessionId: string; formula: string; isSecret: boolean }) => void;
  sendMessage: (data: { sessionId: string; message: string; type: 'public' | 'whisper'; targetUserId?: string }) => void;
  'master:updateInitiative': (data: { sessionId: string; initiativeOrder: InitiativeEntry[] }) => void;

  // Servidor para Cliente
  'gameSession:joined': (data: { sessionId: string; gameData: GameSession }) => void;
  'gameSession:tokenMoved': (data: { tokenId: string; newPosition: Position }) => void;
  'gameSession:diceRolled': (data: { rollerId: string; formula: string; result: number; details: any; isSecret: boolean }) => void;
  'gameSession:messageReceived': (data: { senderId: string; message: string; type: 'public' | 'whisper' }) => void;
  'gameSession:initiativeUpdated': (data: { initiativeOrder: InitiativeEntry[] }) => void;
}

