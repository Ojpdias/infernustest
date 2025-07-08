import React, { useEffect, useRef } from 'react';

interface CombatLogEntry {
  id: string;
  message: string;
  type: 'attack' | 'damage' | 'heal' | 'spell' | 'system' | 'death';
  timestamp: Date;
  actor?: string;
  target?: string;
}

interface CombatLogProps {
  entries: CombatLogEntry[];
  className?: string;
}

const CombatLog: React.FC<CombatLogProps> = ({ entries, className = '' }) => {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a mensagem mais recente
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'attack':
        return 'text-orange-400';
      case 'damage':
        return 'text-red-400';
      case 'heal':
        return 'text-green-400';
      case 'spell':
        return 'text-blue-400';
      case 'death':
        return 'text-red-600 font-bold';
      case 'system':
      default:
        return 'text-infernus-silver';
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'attack':
        return '⚔️';
      case 'damage':
        return '💥';
      case 'heal':
        return '💚';
      case 'spell':
        return '✨';
      case 'death':
        return '💀';
      case 'system':
      default:
        return '📝';
    }
  };

  return (
    <div className={`infernal-panel ${className}`}>
      <h3 className="gothic-title text-lg mb-3">Combat Log</h3>
      
      <div ref={logRef} className="combat-log">
        {entries.length === 0 ? (
          <div className="text-center text-infernus-silver py-4">
            Combat hasn't started yet
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start space-x-2 mb-2 p-2 rounded hover:bg-infernus-charcoal/30 transition-colors"
            >
              <span className="text-sm mt-0.5">
                {getEntryIcon(entry.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${getEntryColor(entry.type)}`}>
                  {entry.message}
                </div>
                <div className="text-xs text-infernus-silver/70 mt-1">
                  {entry.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Função utilitária para criar entradas de log
export const createLogEntry = (
  message: string,
  type: CombatLogEntry['type'] = 'system',
  actor?: string,
  target?: string
): CombatLogEntry => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  message,
  type,
  timestamp: new Date(),
  actor,
  target,
});

export default CombatLog;

