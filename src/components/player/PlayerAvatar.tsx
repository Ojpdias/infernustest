import React from 'react';
import { Character } from '@/types/game';
import { formatHP, getHPPercentage } from '@/lib/utils';

interface PlayerAvatarProps {
  character: Character;
  isCurrentPlayer?: boolean;
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  character,
  isCurrentPlayer = false,
  className = '',
}) => {
  return (
    <div className={`player-avatar ${isCurrentPlayer ? 'ring-4 ring-infernus-gold' : ''} ${className}`}>
      <div className="w-20 h-20 bg-infernus-charcoal rounded-full flex items-center justify-center relative overflow-hidden">
        {/* Avatar placeholder - poderia ser uma imagem real */}
        <div className="text-2xl font-bold text-infernus-gold">
          {character.name.charAt(0).toUpperCase()}
        </div>
        
        {/* Indicador de turno atual */}
        {isCurrentPlayer && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-infernus-gold rounded-full animate-pulse"></div>
        )}
      </div>
      
      {/* Informações do personagem */}
      <div className="mt-2 text-center">
        <div className="text-sm font-bold text-infernus-gold truncate">
          {character.name}
        </div>
        <div className="text-xs text-infernus-silver">
          {character.class} {character.level}
        </div>
        
        {/* Barra de HP */}
        <div className="mt-1">
          <div className="text-xs text-infernus-silver mb-1">
            {formatHP(character.hp, character.maxHp)}
          </div>
          <div className="status-bar h-1">
            <div
              className="hp-bar"
              style={{ width: `${getHPPercentage(character.hp, character.maxHp)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Barra de MP */}
        <div className="mt-1">
          <div className="text-xs text-infernus-silver mb-1">
            {formatHP(character.mp, character.maxMp)}
          </div>
          <div className="status-bar h-1">
            <div
              className="mp-bar"
              style={{ width: `${getHPPercentage(character.mp, character.maxMp)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Condições */}
        {character.conditions.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {character.conditions.map((condition, index) => (
              <span
                key={index}
                className="text-xs bg-red-600 text-white px-1 rounded"
              >
                {condition}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerAvatar;

