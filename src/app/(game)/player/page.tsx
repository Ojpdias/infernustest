'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PlayerAvatar from '@/components/player/PlayerAvatar';
import PlayerActions from '@/components/player/PlayerActions';
import CharacterSheet from '@/components/player/CharacterSheet';
import MapCanvasSimple from '@/components/game/MapCanvasSimple';
import CombatLog, { createLogEntry } from '@/components/game/CombatLog';
import PublicChat, { createChatMessage } from '@/components/game/PublicChat';
import MasterShield from '@/components/master/MasterShield';
import { Character, GameSession, Position } from '@/types/game';
import { generateId } from '@/lib/utils';

const PlayerPage: React.FC = () => {
  // Estado mock para demonstração
  const currentUserId = 'player-1';
  
  const [gameSession, setGameSession] = useState<GameSession>({
    _id: 'session-1',
    masterId: 'master-1',
    title: 'The Infernal Depths',
    description: 'A dark adventure in the depths of hell',
    players: ['player-1', 'player-2', 'player-3'],
    mapData: {
      width: 20,
      height: 15,
      gridSize: 30, // Menor para a interface do jogador
      tokens: [
        {
          _id: 'token-1',
          gameSessionId: 'session-1',
          type: 'player',
          refId: 'char-1',
          x: 2,
          y: 3,
          imageUrl: '',
          size: 1,
          isVisible: true,
        },
        {
          _id: 'token-2',
          gameSessionId: 'session-1',
          type: 'monster',
          refId: 'monster-1',
          x: 8,
          y: 7,
          imageUrl: '',
          size: 1,
          isVisible: true,
        },
        {
          _id: 'token-3',
          gameSessionId: 'session-1',
          type: 'player',
          refId: 'char-2',
          x: 3,
          y: 4,
          imageUrl: '',
          size: 1,
          isVisible: true,
        },
      ],
      fogOfWar: Array(15).fill(null).map((_, y) => 
        Array(20).fill(null).map((_, x) => 
          // Simular fog of war - visível apenas em um raio ao redor dos jogadores
          Math.abs(x - 2) <= 3 && Math.abs(y - 3) <= 3 ||
          Math.abs(x - 3) <= 3 && Math.abs(y - 4) <= 3
        )
      ),
    },
    initiativeOrder: [
      { characterId: 'char-1', name: 'Aragorn', initiative: 18, type: 'player' },
      { characterId: 'monster-1', name: 'Orc Warrior', initiative: 12, type: 'monster' },
      { characterId: 'char-2', name: 'Legolas', initiative: 15, type: 'player' },
    ],
    npcs: [],
    monsters: [],
    chatLog: [],
    secretLogs: [],
    currentTurn: 'char-1',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [characters] = useState<Character[]>([
    {
      _id: 'char-1',
      userId: 'player-1',
      gameSessionId: 'session-1',
      name: 'Aragorn',
      race: 'Human',
      class: 'Ranger',
      level: 5,
      hp: 45,
      maxHp: 50,
      mp: 8,
      maxMp: 10,
      conditions: [],
      stats: {
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 12,
        wisdom: 16,
        charisma: 13,
        armorClass: 15,
        speed: 30,
      },
      inventory: [
        { _id: '1', name: 'Longsword', description: 'A sharp blade', quantity: 1, type: 'weapon' },
        { _id: '2', name: 'Healing Potion', description: 'Restores HP', quantity: 3, type: 'consumable' },
      ],
      spells: [],
      abilities: [],
      tokenPosition: { x: 2, y: 3 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'char-2',
      userId: 'player-2',
      gameSessionId: 'session-1',
      name: 'Legolas',
      race: 'Elf',
      class: 'Ranger',
      level: 5,
      hp: 40,
      maxHp: 42,
      mp: 12,
      maxMp: 15,
      conditions: [],
      stats: {
        strength: 12,
        dexterity: 18,
        constitution: 14,
        intelligence: 14,
        wisdom: 16,
        charisma: 15,
        armorClass: 16,
        speed: 35,
      },
      inventory: [
        { _id: '3', name: 'Elven Bow', description: 'A masterwork bow', quantity: 1, type: 'weapon' },
        { _id: '4', name: 'Arrows', description: 'Sharp arrows', quantity: 30, type: 'weapon' },
      ],
      spells: [],
      abilities: [],
      tokenPosition: { x: 3, y: 4 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: 'char-3',
      userId: 'player-3',
      gameSessionId: 'session-1',
      name: 'Gimli',
      race: 'Dwarf',
      class: 'Fighter',
      level: 5,
      hp: 55,
      maxHp: 60,
      mp: 0,
      maxMp: 0,
      conditions: ['Blessed'],
      stats: {
        strength: 18,
        dexterity: 12,
        constitution: 17,
        intelligence: 10,
        wisdom: 13,
        charisma: 11,
        armorClass: 18,
        speed: 25,
      },
      inventory: [
        { _id: '5', name: 'Battleaxe', description: 'A dwarven axe', quantity: 1, type: 'weapon' },
        { _id: '6', name: 'Shield', description: 'A sturdy shield', quantity: 1, type: 'armor' },
      ],
      spells: [],
      abilities: [],
      tokenPosition: { x: 1, y: 2 },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [combatLog, setCombatLog] = useState([
    createLogEntry('Combat has begun!', 'system'),
    createLogEntry('Aragorn attacks Orc Warrior → 15 damage', 'damage', 'Aragorn', 'Orc Warrior'),
    createLogEntry('Orc Warrior attacks Aragorn → 8 damage', 'damage', 'Orc Warrior', 'Aragorn'),
  ]);

  const [chatMessages, setChatMessages] = useState([
    createChatMessage('player-2', 'Legolas', 'Ready for battle!'),
    createChatMessage('player-1', 'Aragorn', 'Let\'s take down this orc'),
  ]);

  const currentCharacter = characters.find(c => c.userId === currentUserId);
  const isPlayerTurn = gameSession.currentTurn === currentCharacter?._id;

  const handlePlayerAction = (action: string, data?: any) => {
    console.log('Player action:', action, data);
    
    if (action === 'roll' && data) {
      const logEntry = createLogEntry(
        `${currentCharacter?.name} rolled ${data.formula} → ${data.result}`,
        'system',
        currentCharacter?.name
      );
      setCombatLog(prev => [...prev, logEntry]);
      
      const chatMessage = createChatMessage(
        currentUserId,
        currentCharacter?.name || 'Player',
        `Rolled ${data.formula}: ${data.result}`,
        'roll'
      );
      setChatMessages(prev => [...prev, chatMessage]);
    }
  };

  const handleSendMessage = (message: string) => {
    const chatMessage = createChatMessage(
      currentUserId,
      currentCharacter?.name || 'Player',
      message
    );
    setChatMessages(prev => [...prev, chatMessage]);
  };

  const handleUpdateCharacter = (updates: Partial<Character>) => {
    // Atualizar personagem (normalmente seria via API)
    console.log('Update character:', updates);
  };

  const handleMapClick = (position: Position) => {
    if (isPlayerTurn) {
      console.log('Move to:', position);
      // Lógica de movimentação
    }
  };

  return (
    <div className="min-h-screen bg-gradient-infernal text-infernus-gold">
      {/* Header com logo */}
      <header className="flex items-center justify-center py-2 border-b border-infernus-gold">
        <Image
          src="/infernus_logo_3.png"
          alt="Infernus"
          width={150}
          height={60}
          className="opacity-90"
        />
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Avatares dos jogadores - canto superior esquerdo */}
        <div className="absolute top-20 left-4 z-10">
          <div className="grid grid-cols-2 gap-3">
            {characters.map((character) => (
              <PlayerAvatar
                key={character._id}
                character={character}
                isCurrentPlayer={character.userId === currentUserId}
                className="w-24"
              />
            ))}
          </div>
        </div>

        {/* Escudo do mestre - canto superior direito (não interativo) */}
        <div className="absolute top-20 right-4 z-10 opacity-60">
          <MasterShield className="w-20 h-20" />
        </div>

        {/* Área principal do mapa */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 pt-32">
            <MapCanvasSimple
              mapData={gameSession.mapData}
              isMaster={false}
              onMapClick={handleMapClick}
              className="w-full h-full max-w-4xl mx-auto"
            />
          </div>
        </div>

        {/* Painel lateral direito */}
        <div className="w-80 p-4 space-y-4 overflow-y-auto border-l border-infernus-gold">
          {/* Ficha do personagem */}
          {currentCharacter && (
            <CharacterSheet
              character={currentCharacter}
              onUpdateCharacter={handleUpdateCharacter}
            />
          )}

          {/* Ações do jogador */}
          <PlayerActions
            isPlayerTurn={isPlayerTurn}
            onAction={handlePlayerAction}
          />
        </div>
      </div>

      {/* Painel inferior com logs e chat */}
      <div className="h-64 border-t border-infernus-gold flex">
        <div className="flex-1">
          <CombatLog entries={combatLog} className="h-full" />
        </div>
        <div className="flex-1 border-l border-infernus-gold">
          <PublicChat
            messages={chatMessages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;

