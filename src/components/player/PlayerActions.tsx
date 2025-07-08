import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { diceRoller } from '@/lib/diceRoller';

interface PlayerActionsProps {
  isPlayerTurn: boolean;
  onAction: (action: string, data?: any) => void;
}

const PlayerActions: React.FC<PlayerActionsProps> = ({
  isPlayerTurn,
  onAction,
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);

  const handleAction = (actionType: string) => {
    if (!isPlayerTurn) return;
    
    setSelectedAction(actionType);
    onAction(actionType);
  };

  const handleRoll = (formula: string) => {
    try {
      const result = diceRoller.roll(formula);
      setRollResult(result.result);
      onAction('roll', { formula, result: result.result });
    } catch (error) {
      console.error('Erro ao rolar dados:', error);
    }
  };

  const actions = [
    {
      id: 'attack',
      label: 'Attack',
      icon: '⚔️',
      description: 'Make a weapon attack',
    },
    {
      id: 'cast-spell',
      label: 'Cast Spell',
      icon: '🔮',
      description: 'Cast a spell or cantrip',
    },
    {
      id: 'use-item',
      label: 'Use Item',
      icon: '🧪',
      description: 'Use an item from inventory',
    },
    {
      id: 'move',
      label: 'Move',
      icon: '👟',
      description: 'Move to a different position',
    },
  ];

  const quickRolls = [
    { label: 'Attack', formula: '1d20+5' },
    { label: 'Damage', formula: '1d8+3' },
    { label: 'Save', formula: '1d20+2' },
    { label: 'Skill', formula: '1d20+3' },
  ];

  return (
    <div className="infernal-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="gothic-title text-lg">Actions</h3>
        {!isPlayerTurn && (
          <span className="text-sm text-infernus-silver">Not your turn</span>
        )}
      </div>

      {/* Ações principais */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={!isPlayerTurn}
            className={`
              action-button flex-col h-20 space-y-1
              ${!isPlayerTurn ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedAction === action.id ? 'ring-2 ring-infernus-gold' : ''}
            `}
            title={action.description}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Rolagens rápidas */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-infernus-gold mb-2">Quick Rolls</h4>
        <div className="grid grid-cols-2 gap-2">
          {quickRolls.map((roll) => (
            <button
              key={roll.label}
              onClick={() => handleRoll(roll.formula)}
              className="px-3 py-2 bg-infernus-charcoal hover:bg-infernus-blood text-infernus-gold text-sm rounded border border-infernus-silver hover:border-infernus-gold transition-all duration-200"
            >
              {roll.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado da última rolagem */}
      {rollResult !== null && (
        <div className="text-center p-3 bg-infernus-black rounded border border-infernus-gold">
          <div className="text-sm text-infernus-silver mb-1">Last Roll</div>
          <div className="text-2xl font-bold text-infernus-gold">{rollResult}</div>
        </div>
      )}

      {/* Ações secundárias */}
      <div className="mt-4 flex justify-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAction('end-turn')}
          disabled={!isPlayerTurn}
        >
          End Turn
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onAction('ready-action')}
          disabled={!isPlayerTurn}
        >
          Ready Action
        </Button>
      </div>
    </div>
  );
};

export default PlayerActions;

