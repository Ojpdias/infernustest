import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage } from 'react-konva';
import { MapData, Token, Position } from '@/types/game';

interface MapCanvasProps {
  mapData: MapData;
  isMaster: boolean;
  onTokenMove?: (tokenId: string, newPosition: Position) => void;
  onMapClick?: (position: Position) => void;
  className?: string;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  mapData,
  isMaster,
  onTokenMove,
  onMapClick,
  className = '',
}) => {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        const container = stageRef.current.container().parentNode;
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleStageClick = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    const gridPos = {
      x: Math.floor(pos.x / mapData.gridSize),
      y: Math.floor(pos.y / mapData.gridSize),
    };

    if (onMapClick) {
      onMapClick(gridPos);
    }

    // Deselecionar token se clicar no vazio
    if (e.target === e.target.getStage()) {
      setSelectedTokenId(null);
    }
  };

  const handleTokenDragEnd = (tokenId: string, e: any) => {
    if (!isMaster || !onTokenMove) return;

    const newPos = {
      x: Math.floor(e.target.x() / mapData.gridSize),
      y: Math.floor(e.target.y() / mapData.gridSize),
    };

    onTokenMove(tokenId, newPos);
  };

  const renderGrid = () => {
    const lines = [];
    const { width, height, gridSize } = mapData;

    // Linhas verticais
    for (let i = 0; i <= width; i++) {
      lines.push(
        <Rect
          key={`v-${i}`}
          x={i * gridSize}
          y={0}
          width={1}
          height={height * gridSize}
          fill="rgba(255, 215, 0, 0.2)"
        />
      );
    }

    // Linhas horizontais
    for (let i = 0; i <= height; i++) {
      lines.push(
        <Rect
          key={`h-${i}`}
          x={0}
          y={i * gridSize}
          width={width * gridSize}
          height={1}
          fill="rgba(255, 215, 0, 0.2)"
        />
      );
    }

    return lines;
  };

  const renderFogOfWar = () => {
    if (isMaster || !mapData.fogOfWar) return null;

    const fogRects = [];
    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        if (!mapData.fogOfWar[y][x]) {
          fogRects.push(
            <Rect
              key={`fog-${x}-${y}`}
              x={x * mapData.gridSize}
              y={y * mapData.gridSize}
              width={mapData.gridSize}
              height={mapData.gridSize}
              fill="rgba(0, 0, 0, 0.8)"
            />
          );
        }
      }
    }

    return fogRects;
  };

  const renderTokens = () => {
    return mapData.tokens
      .filter(token => isMaster || token.isVisible)
      .map(token => (
        <TokenComponent
          key={token._id}
          token={token}
          gridSize={mapData.gridSize}
          isSelected={selectedTokenId === token._id}
          isDraggable={isMaster}
          onSelect={() => setSelectedTokenId(token._id)}
          onDragEnd={(e) => handleTokenDragEnd(token._id, e)}
        />
      ));
  };

  return (
    <div className={`map-container ${className}`}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Fundo do mapa */}
          <Rect
            x={0}
            y={0}
            width={mapData.width * mapData.gridSize}
            height={mapData.height * mapData.gridSize}
            fill="#1A1A1A"
            stroke="#2C2C2C"
            strokeWidth={2}
          />

          {/* Grid */}
          {renderGrid()}

          {/* Tokens */}
          {renderTokens()}

          {/* Fog of War */}
          {renderFogOfWar()}
        </Layer>
      </Stage>
    </div>
  );
};

interface TokenComponentProps {
  token: Token;
  gridSize: number;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: () => void;
  onDragEnd: (e: any) => void;
}

const TokenComponent: React.FC<TokenComponentProps> = ({
  token,
  gridSize,
  isSelected,
  isDraggable,
  onSelect,
  onDragEnd,
}) => {
  const getTokenColor = () => {
    switch (token.type) {
      case 'player':
        return '#4CAF50';
      case 'monster':
        return '#F44336';
      case 'npc':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <>
      <Circle
        x={token.x * gridSize + gridSize / 2}
        y={token.y * gridSize + gridSize / 2}
        radius={(gridSize * token.size) / 2 - 2}
        fill={getTokenColor()}
        stroke={isSelected ? '#FFD700' : '#000000'}
        strokeWidth={isSelected ? 3 : 1}
        draggable={isDraggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.6}
      />
      
      {/* Inicial do token */}
      <Text
        x={token.x * gridSize + gridSize / 2}
        y={token.y * gridSize + gridSize / 2 - 6}
        text={token.refId.charAt(0).toUpperCase()}
        fontSize={12}
        fontFamily="Arial"
        fill="white"
        align="center"
        width={0}
        listening={false}
      />
    </>
  );
};

export default MapCanvas;

