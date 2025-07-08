import React, { useState } from 'react';
import { MapData, Token, Position } from '@/types/game';

interface MapCanvasSimpleProps {
  mapData: MapData;
  isMaster: boolean;
  onTokenMove?: (tokenId: string, newPosition: Position) => void;
  onMapClick?: (position: Position) => void;
  className?: string;
}

const MapCanvasSimple: React.FC<MapCanvasSimpleProps> = ({
  mapData,
  isMaster,
  onTokenMove,
  onMapClick,
  className = '',
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [draggedToken, setDraggedToken] = useState<string | null>(null);

  const handleCellClick = (x: number, y: number) => {
    if (selectedTokenId && isMaster && onTokenMove) {
      onTokenMove(selectedTokenId, { x, y });
      setSelectedTokenId(null);
    } else if (onMapClick) {
      onMapClick({ x, y });
    }
  };

  const handleTokenClick = (tokenId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTokenId(selectedTokenId === tokenId ? null : tokenId);
  };

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-green-500';
      case 'monster':
        return 'bg-red-500';
      case 'npc':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        const isVisible = isMaster || !mapData.fogOfWar || mapData.fogOfWar[y][x];
        const token = mapData.tokens.find(t => t.x === x && t.y === y && (isMaster || t.isVisible));
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`
              relative border border-infernus-gold/20 cursor-pointer
              ${isVisible ? 'bg-infernus-black/50' : 'bg-black'}
              hover:bg-infernus-charcoal/30 transition-colors
            `}
            style={{
              width: `${mapData.gridSize}px`,
              height: `${mapData.gridSize}px`,
            }}
            onClick={() => handleCellClick(x, y)}
          >
            {token && (
              <div
                className={`
                  absolute inset-1 rounded-full flex items-center justify-center
                  ${getTokenColor(token.type)}
                  ${selectedTokenId === token._id ? 'ring-2 ring-infernus-gold' : ''}
                  cursor-pointer text-white font-bold text-xs
                  hover:scale-110 transition-transform
                `}
                onClick={(e) => handleTokenClick(token._id, e)}
              >
                {token.refId.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Coordenadas para debug (apenas para mestre) */}
            {isMaster && (
              <div className="absolute top-0 left-0 text-xs text-infernus-silver/50 pointer-events-none">
                {x},{y}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className={`map-container ${className}`}>
      <div className="p-4">
        <div
          className="grid gap-0 border-2 border-infernus-gold rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${mapData.width}, ${mapData.gridSize}px)`,
            width: `${mapData.width * mapData.gridSize}px`,
            height: `${mapData.height * mapData.gridSize}px`,
          }}
        >
          {renderGrid()}
        </div>
        
        {selectedTokenId && isMaster && (
          <div className="mt-4 text-center text-infernus-gold">
            Token selecionado. Clique em uma célula para mover.
          </div>
        )}
      </div>
    </div>
  );
};

export default MapCanvasSimple;

