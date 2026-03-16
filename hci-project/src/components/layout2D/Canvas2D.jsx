import { useRef, useEffect, useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import { RoomContainer } from './RoomContainer';
import { FurnitureItem2D } from './FurnitureItem2D';

export function Canvas2D() {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { currentDesign, selectedItemId, selectItem, updateFurniture, clearSelection } = useDesign();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const roomDimensions = currentDesign?.roomDimensions || { width: 800, height: 600 };
  
  const padding = 40;
  const availableWidth = containerSize.width - padding * 2;
  const availableHeight = containerSize.height - padding * 2;
  
  const scaleX = availableWidth / roomDimensions.width;
  const scaleY = availableHeight / roomDimensions.height;
  const scale = Math.min(scaleX, scaleY, 1);

  const scaledWidth = roomDimensions.width * scale;
  const scaledHeight = roomDimensions.height * scale;

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('room-floor')) {
      clearSelection();
    }
  };

  const handleItemDrag = (instanceId, newPosition) => {
    const clampedX = Math.max(0, Math.min(newPosition.x, roomDimensions.width));
    const clampedY = Math.max(0, Math.min(newPosition.y, roomDimensions.height));
    
    updateFurniture(instanceId, { 
      position: { x: clampedX, y: clampedY } 
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center"
      onClick={handleCanvasClick}
    >
      <div 
        className="relative"
        style={{ 
          width: scaledWidth, 
          height: scaledHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <RoomContainer 
          width={roomDimensions.width} 
          height={roomDimensions.height}
          scale={scale}
        />
        
        {currentDesign?.furniture.map(item => (
          <FurnitureItem2D
            key={item.instanceId}
            item={item}
            scale={scale}
            isSelected={selectedItemId === item.instanceId}
            onSelect={() => selectItem(item.instanceId)}
            onDrag={(pos) => handleItemDrag(item.instanceId, pos)}
            roomBounds={roomDimensions}
          />
        ))}
      </div>
    </div>
  );
}
