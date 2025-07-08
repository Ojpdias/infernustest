import React, { useState } from 'react';
import { diceRoller } from '@/lib/diceRoller';
import Button from '@/components/ui/Button';

interface SecretRoll {
  id: string;
  formula: string;
  result: number;
  timestamp: Date;
}

interface SecretRollsProps {
  onSecretRoll?: (formula: string, result: number) => void;
}

const SecretRolls: React.FC<SecretRollsProps> = ({ onSecretRoll }) => {
  const [rolls, setRolls] = useState<SecretRoll[]>([]);
  const [formula, setFormula] = useState('1d20');

  const commonFormulas = [
    '1d20',
    '1d20+5',
    '2d6',
    '1d8+3',
    '3d6',
    '1d12',
    '1d100',
  ];

  const handleRoll = (rollFormula?: string) => {
    const diceFormula = rollFormula || formula;
    
    try {
      const result = diceRoller.roll(diceFormula);
      const newRoll: SecretRoll = {
        id: Date.now().toString(),
        formula: diceFormula,
        result: result.result,
        timestamp: new Date(),
      };

      setRolls(prev => [newRoll, ...prev.slice(0, 9)]); // Manter apenas os últimos 10 rolls

      if (onSecretRoll) {
        onSecretRoll(diceFormula, result.result);
      }
    } catch (error) {
      console.error('Erro ao rolar dados:', error);
    }
  };

  const clearRolls = () => {
    setRolls([]);
  };

  return (
    <div className="infernal-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="gothic-title text-lg">Secret Rolls</h3>
        {rolls.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearRolls}>
            Clear
          </Button>
        )}
      </div>

      {/* Input customizado */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="1d20+5"
            className="flex-1 px-3 py-2 bg-infernus-black border border-infernus-gold rounded text-infernus-gold"
            onKeyPress={(e) => e.key === 'Enter' && handleRoll()}
          />
          <Button onClick={() => handleRoll()}>
            Roll
          </Button>
        </div>

        {/* Botões de fórmulas comuns */}
        <div className="grid grid-cols-3 gap-1">
          {commonFormulas.map((commonFormula) => (
            <button
              key={commonFormula}
              onClick={() => handleRoll(commonFormula)}
              className="px-2 py-1 bg-infernus-charcoal hover:bg-infernus-blood text-infernus-gold text-xs rounded border border-infernus-silver hover:border-infernus-gold transition-all duration-200"
            >
              {commonFormula}
            </button>
          ))}
        </div>
      </div>

      {/* Histórico de rolagens */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {rolls.map((roll) => (
          <div
            key={roll.id}
            className="flex justify-between items-center p-2 bg-infernus-black rounded border border-infernus-charcoal"
          >
            <div>
              <span className="text-infernus-gold font-mono">{roll.formula}</span>
              <div className="text-xs text-infernus-silver">
                {roll.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <div className="text-lg font-bold text-infernus-gold">
              {roll.result}
            </div>
          </div>
        ))}

        {rolls.length === 0 && (
          <div className="text-center text-infernus-silver py-4">
            No secret rolls yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretRolls;

