import React, { useState } from 'react';
import { Character } from '@/types/game';
import { formatHP, getHPPercentage } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CharacterSheetProps {
  character: Character;
  onUpdateCharacter: (updates: Partial<Character>) => void;
  className?: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  onUpdateCharacter,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatChange = (stat: keyof Character['stats'], value: number) => {
    onUpdateCharacter({
      stats: {
        ...character.stats,
        [stat]: value,
      },
    });
  };

  const handleHPChange = (newHP: number) => {
    onUpdateCharacter({
      hp: Math.max(0, Math.min(character.maxHp, newHP)),
    });
  };

  const handleMPChange = (newMP: number) => {
    onUpdateCharacter({
      mp: Math.max(0, Math.min(character.maxMp, newMP)),
    });
  };

  return (
    <div className={`infernal-panel ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="gothic-title text-lg">{character.name}</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-infernus-silver">Race</div>
          <div className="text-infernus-gold">{character.race}</div>
        </div>
        <div>
          <div className="text-sm text-infernus-silver">Class</div>
          <div className="text-infernus-gold">{character.class}</div>
        </div>
        <div>
          <div className="text-sm text-infernus-silver">Level</div>
          <div className="text-infernus-gold">{character.level}</div>
        </div>
        <div>
          <div className="text-sm text-infernus-silver">AC</div>
          <div className="text-infernus-gold">{character.stats.armorClass}</div>
        </div>
      </div>

      {/* HP e MP */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-infernus-silver">Hit Points</span>
            <span className="text-sm text-infernus-gold">
              {formatHP(character.hp, character.maxHp)}
            </span>
          </div>
          <div className="status-bar h-3 mb-2">
            <div
              className="hp-bar"
              style={{ width: `${getHPPercentage(character.hp, character.maxHp)}%` }}
            ></div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handleHPChange(character.hp - 1)}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
            >
              -1
            </button>
            <button
              onClick={() => handleHPChange(character.hp + 1)}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              +1
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-infernus-silver">Magic Points</span>
            <span className="text-sm text-infernus-gold">
              {formatHP(character.mp, character.maxMp)}
            </span>
          </div>
          <div className="status-bar h-3 mb-2">
            <div
              className="mp-bar"
              style={{ width: `${getHPPercentage(character.mp, character.maxMp)}%` }}
            ></div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handleMPChange(character.mp - 1)}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
            >
              -1
            </button>
            <button
              onClick={() => handleMPChange(character.mp + 1)}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      {/* Condições */}
      {character.conditions.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-infernus-silver mb-2">Conditions</div>
          <div className="flex flex-wrap gap-1">
            {character.conditions.map((condition, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Atributos */}
          <div>
            <div className="text-sm text-infernus-silver mb-2">Attributes</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-infernus-silver">STR</div>
                <div className="text-infernus-gold font-bold">{character.stats.strength}</div>
              </div>
              <div className="text-center">
                <div className="text-infernus-silver">DEX</div>
                <div className="text-infernus-gold font-bold">{character.stats.dexterity}</div>
              </div>
              <div className="text-center">
                <div className="text-infernus-silver">CON</div>
                <div className="text-infernus-gold font-bold">{character.stats.constitution}</div>
              </div>
              <div className="text-center">
                <div className="text-infernus-silver">INT</div>
                <div className="text-infernus-gold font-bold">{character.stats.intelligence}</div>
              </div>
              <div className="text-center">
                <div className="text-infernus-silver">WIS</div>
                <div className="text-infernus-gold font-bold">{character.stats.wisdom}</div>
              </div>
              <div className="text-center">
                <div className="text-infernus-silver">CHA</div>
                <div className="text-infernus-gold font-bold">{character.stats.charisma}</div>
              </div>
            </div>
          </div>

          {/* Inventário resumido */}
          <div>
            <div className="text-sm text-infernus-silver mb-2">Inventory ({character.inventory.length} items)</div>
            <div className="max-h-20 overflow-y-auto">
              {character.inventory.slice(0, 5).map((item) => (
                <div key={item._id} className="text-xs text-infernus-gold">
                  {item.name} {item.quantity > 1 && `(${item.quantity})`}
                </div>
              ))}
              {character.inventory.length > 5 && (
                <div className="text-xs text-infernus-silver">
                  ...and {character.inventory.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;

