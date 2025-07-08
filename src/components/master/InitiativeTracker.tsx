import React, { useState } from 'react';
import { InitiativeEntry } from '@/types/game';
import Button from '@/components/ui/Button';
import { formatInitiative } from '@/lib/utils';

interface InitiativeTrackerProps {
  initiativeOrder: InitiativeEntry[];
  currentTurn: string | null;
  onUpdateInitiative: (newOrder: InitiativeEntry[]) => void;
  onNextTurn: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({
  initiativeOrder,
  currentTurn,
  onUpdateInitiative,
  onNextTurn,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOrder, setEditingOrder] = useState<InitiativeEntry[]>(initiativeOrder);

  const handleSaveChanges = () => {
    onUpdateInitiative(editingOrder);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingOrder(initiativeOrder);
    setIsEditing(false);
  };

  const updateInitiativeValue = (characterId: string, newValue: number) => {
    setEditingOrder(prev => 
      prev.map(entry => 
        entry.characterId === characterId 
          ? { ...entry, initiative: newValue }
          : entry
      ).sort((a, b) => b.initiative - a.initiative)
    );
  };

  const removeFromInitiative = (characterId: string) => {
    setEditingOrder(prev => prev.filter(entry => entry.characterId !== characterId));
  };

  return (
    <div className="infernal-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="gothic-title text-lg">Initiative</h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button size="sm" onClick={onNextTurn} variant="secondary">
                Next Turn
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleSaveChanges}>
                Save
              </Button>
              <Button size="sm" onClick={handleCancelEdit} variant="ghost">
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="initiative-tracker max-h-64 overflow-y-auto">
        {(isEditing ? editingOrder : initiativeOrder).map((entry, index) => (
          <div
            key={entry.characterId}
            className={`initiative-entry ${
              entry.characterId === currentTurn ? 'active' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <span className="text-infernus-gold font-bold text-sm">
                  #{index + 1}
                </span>
                <div>
                  <div className="font-semibold text-infernus-gold">
                    {entry.name}
                  </div>
                  <div className="text-xs text-infernus-silver capitalize">
                    {entry.type}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={entry.initiative}
                      onChange={(e) => updateInitiativeValue(entry.characterId, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-infernus-black border border-infernus-gold rounded text-center text-infernus-gold"
                    />
                    <button
                      onClick={() => removeFromInitiative(entry.characterId)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-infernus-gold font-bold">
                    {formatInitiative(entry.initiative)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {initiativeOrder.length === 0 && (
          <div className="text-center text-infernus-silver py-4">
            No characters in initiative order
          </div>
        )}
      </div>
    </div>
  );
};

export default InitiativeTracker;

