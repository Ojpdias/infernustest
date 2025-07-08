'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MasterShield from '@/components/master/MasterShield';
import InitiativeTracker from '@/components/master/InitiativeTracker';
import EnemyList from '@/components/master/EnemyList';
import SecretRolls from '@/components/master/SecretRolls';
import MapCanvasSimple from '@/components/game/MapCanvasSimple';
import Button from '@/components/ui/Button';
import { GameSession, InitiativeEntry, Monster, MapData, Position } from '@/types/game';
import { generateId } from '@/lib/utils';

const MasterPage: React.FC = () => {
  // Estado mock para demonstração
  const [gameSession, setGameSession] = useState<GameSession>({
    _id: 'session-1',
    masterId: 'master-1',
    title: 'The Infernal Depths',
    description: 'A dark adventure in the depths of hell',
    players: ['player-1', 'player-2', 'player-3'],
    mapData: {
      width: 20,
      height: 15,
      gridSize: 40,
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
      ],
      fogOfWar: Array(15).fill(null).map(() => Array(20).fill(true)),
    },
    initiativeOrder: [
      { characterId: 'char-1', name: 'Aragorn', initiative: 18, type: 'player' },
      { characterId: 'monster-1', name: 'Orc Warrior', initiative: 12, type: 'monster' },
      { characterId: 'char-2', name: 'Legolas', initiative: 15, type: 'player' },
    ],
    npcs: [],
    monsters: [
      {
        _id: 'monster-1',
        gameSessionId: 'session-1',
        name: 'Orc Warrior',
        type: 'Orc',
        hp: 15,
        maxHp: 15,
        ac: 13,
        stats: {
          strength: 16,
          dexterity: 12,
          constitution: 16,
          intelligence: 7,
          wisdom: 11,
          charisma: 10,
          armorClass: 13,
          speed: 30,
        },
        abilities: [],
        tokenPosition: { x: 8, y: 7 },
        initiative: 12,
      },
    ],
    chatLog: [],
    secretLogs: [],
    currentTurn: 'char-1',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleTokenMove = (tokenId: string, newPosition: Position) => {
    setGameSession(prev => ({
      ...prev,
      mapData: {
        ...prev.mapData,
        tokens: prev.mapData.tokens.map(token =>
          token._id === tokenId
            ? { ...token, x: newPosition.x, y: newPosition.y }
            : token
        ),
      },
    }));
  };

  const handleUpdateInitiative = (newOrder: InitiativeEntry[]) => {
    setGameSession(prev => ({
      ...prev,
      initiativeOrder: newOrder,
    }));
  };

  const handleNextTurn = () => {
    const currentIndex = gameSession.initiativeOrder.findIndex(
      entry => entry.characterId === gameSession.currentTurn
    );
    const nextIndex = (currentIndex + 1) % gameSession.initiativeOrder.length;
    const nextTurn = gameSession.initiativeOrder[nextIndex]?.characterId || null;

    setGameSession(prev => ({
      ...prev,
      currentTurn: nextTurn,
    }));
  };

  const handleAddEnemy = (enemy: Omit<Monster, '_id'>) => {
    const newEnemy: Monster = {
      ...enemy,
      _id: generateId(),
      gameSessionId: gameSession._id,
    };

    setGameSession(prev => ({
      ...prev,
      monsters: [...prev.monsters, newEnemy],
    }));
  };

  const handleUpdateEnemy = (enemyId: string, updates: Partial<Monster>) => {
    setGameSession(prev => ({
      ...prev,
      monsters: prev.monsters.map(monster =>
        monster._id === enemyId ? { ...monster, ...updates } : monster
      ),
    }));
  };

  const handleRemoveEnemy = (enemyId: string) => {
    setGameSession(prev => ({
      ...prev,
      monsters: prev.monsters.filter(monster => monster._id !== enemyId),
    }));
  };

  const handleSpawnToken = () => {
    // Lógica para spawn de token
    console.log('Spawn token');
  };

  const handleOpenSecretChat = () => {
    // Lógica para abrir chat secreto
    console.log('Open secret chat');
  };

  return (
    <div className="min-h-screen bg-gradient-infernal text-infernus-gold">
      {/* Header com logo */}
      <header className="flex items-center justify-center py-4 border-b border-infernus-gold">
        <Image
          src="/infernus_logo_3.png"
          alt="Infernus"
          width={200}
          height={80}
          className="opacity-90"
        />
      </header>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Painel lateral esquerdo */}
        <div className="w-80 p-4 space-y-4 overflow-y-auto border-r border-infernus-gold">
          {/* Escudo do Mestre */}
          <div className="flex justify-center mb-6">
            <MasterShield className="w-32 h-32" />
          </div>

          {/* Rastreador de Iniciativa */}
          <InitiativeTracker
            initiativeOrder={gameSession.initiativeOrder}
            currentTurn={gameSession.currentTurn}
            onUpdateInitiative={handleUpdateInitiative}
            onNextTurn={handleNextTurn}
          />

          {/* Lista de Inimigos */}
          <EnemyList
            enemies={gameSession.monsters}
            onAddEnemy={handleAddEnemy}
            onUpdateEnemy={handleUpdateEnemy}
            onRemoveEnemy={handleRemoveEnemy}
          />

          {/* Rolagens Secretas */}
          <SecretRolls />
        </div>

        {/* Área principal do mapa */}
        <div className="flex-1 flex flex-col">
          {/* Mapa */}
          <div className="flex-1 p-4">
            <MapCanvasSimple
              mapData={gameSession.mapData}
              isMaster={true}
              onTokenMove={handleTokenMove}
              className="w-full h-full"
            />
          </div>

          {/* Botões de ação inferiores */}
          <div className="p-4 border-t border-infernus-gold">
            <div className="flex justify-center space-x-4">
              <Button onClick={handleSpawnToken}>
                Spawn Token
              </Button>
              <Button variant="secondary">
                Move Token
              </Button>
              <Button onClick={handleOpenSecretChat}>
                Open Secret Chat
              </Button>
              <Button variant="ghost">
                Save Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPage;

