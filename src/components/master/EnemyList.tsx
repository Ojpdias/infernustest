import React, { useState } from 'react';
import { Monster } from '@/types/game';
import Button from '@/components/ui/Button';
import { formatHP, getHPPercentage } from '@/lib/utils';

interface EnemyListProps {
  enemies: Monster[];
  onAddEnemy: (enemy: Omit<Monster, '_id'>) => void;
  onUpdateEnemy: (enemyId: string, updates: Partial<Monster>) => void;
  onRemoveEnemy: (enemyId: string) => void;
}

const EnemyList: React.FC<EnemyListProps> = ({
  enemies,
  onAddEnemy,
  onUpdateEnemy,
  onRemoveEnemy,
}) => {
  const [isAddingEnemy, setIsAddingEnemy] = useState(false);
  const [newEnemy, setNewEnemy] = useState({
    name: '',
    type: '',
    hp: 10,
    maxHp: 10,
    ac: 10,
  });

  const handleAddEnemy = () => {
    if (newEnemy.name.trim()) {
      onAddEnemy({
        gameSessionId: '', // Será preenchido pelo componente pai
        name: newEnemy.name,
        type: newEnemy.type || 'Monster',
        hp: newEnemy.hp,
        maxHp: newEnemy.maxHp,
        ac: newEnemy.ac,
        stats: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          armorClass: newEnemy.ac,
          speed: 30,
        },
        abilities: [],
        tokenPosition: { x: 0, y: 0 },
        initiative: 0,
      });

      setNewEnemy({
        name: '',
        type: '',
        hp: 10,
        maxHp: 10,
        ac: 10,
      });
      setIsAddingEnemy(false);
    }
  };

  const handleHPChange = (enemyId: string, newHP: number) => {
    onUpdateEnemy(enemyId, { hp: Math.max(0, newHP) });
  };

  return (
    <div className="infernal-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="gothic-title text-lg">Enemies</h3>
        <Button
          size="sm"
          onClick={() => setIsAddingEnemy(!isAddingEnemy)}
          variant={isAddingEnemy ? 'ghost' : 'primary'}
        >
          {isAddingEnemy ? 'Cancel' : 'Add Enemy'}
        </Button>
      </div>

      {isAddingEnemy && (
        <div className="mb-4 p-3 bg-infernus-black rounded border border-infernus-charcoal">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={newEnemy.name}
              onChange={(e) => setNewEnemy({ ...newEnemy, name: e.target.value })}
              className="px-2 py-1 bg-infernus-charcoal border border-infernus-gold rounded text-infernus-gold text-sm"
            />
            <input
              type="text"
              placeholder="Type"
              value={newEnemy.type}
              onChange={(e) => setNewEnemy({ ...newEnemy, type: e.target.value })}
              className="px-2 py-1 bg-infernus-charcoal border border-infernus-gold rounded text-infernus-gold text-sm"
            />
            <input
              type="number"
              placeholder="HP"
              value={newEnemy.hp}
              onChange={(e) => {
                const hp = parseInt(e.target.value) || 10;
                setNewEnemy({ ...newEnemy, hp, maxHp: hp });
              }}
              className="px-2 py-1 bg-infernus-charcoal border border-infernus-gold rounded text-infernus-gold text-sm"
            />
            <input
              type="number"
              placeholder="AC"
              value={newEnemy.ac}
              onChange={(e) => setNewEnemy({ ...newEnemy, ac: parseInt(e.target.value) || 10 })}
              className="px-2 py-1 bg-infernus-charcoal border border-infernus-gold rounded text-infernus-gold text-sm"
            />
          </div>
          <Button size="sm" onClick={handleAddEnemy} className="w-full">
            Create Enemy
          </Button>
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {enemies.map((enemy) => (
          <div
            key={enemy._id}
            className="p-3 bg-infernus-black rounded border border-infernus-charcoal"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-infernus-gold">{enemy.name}</h4>
                <p className="text-xs text-infernus-silver">{enemy.type}</p>
              </div>
              <button
                onClick={() => onRemoveEnemy(enemy._id)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-infernus-silver mb-1">
                  <span>HP</span>
                  <span>{formatHP(enemy.hp, enemy.maxHp)}</span>
                </div>
                <div className="status-bar h-2">
                  <div
                    className="hp-bar"
                    style={{ width: `${getHPPercentage(enemy.hp, enemy.maxHp)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-infernus-silver">
                AC: {enemy.ac}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleHPChange(enemy._id, enemy.hp - 1)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
              >
                -1 HP
              </button>
              <button
                onClick={() => handleHPChange(enemy._id, enemy.hp - 5)}
                className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-xs"
              >
                -5 HP
              </button>
              <button
                onClick={() => handleHPChange(enemy._id, enemy.hp + 1)}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
              >
                +1 HP
              </button>
              <button
                onClick={() => handleHPChange(enemy._id, enemy.hp + 5)}
                className="px-2 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs"
              >
                +5 HP
              </button>
            </div>
          </div>
        ))}

        {enemies.length === 0 && (
          <div className="text-center text-infernus-silver py-4">
            No enemies added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default EnemyList;

