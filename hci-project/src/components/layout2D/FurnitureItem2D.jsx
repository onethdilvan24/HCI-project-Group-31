import { useState, useRef, useEffect } from 'react';

export function FurnitureItem2D({ item, scale, isSelected, onSelect, onDrag, roomBounds }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const displayWidth = item.width * (item.scale || 1);
  const displayDepth = item.depth * (item.scale || 1);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const parent = elementRef.current?.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const x = (e.clientX - parentRect.left) / scale - dragOffset.x;
      const y = (e.clientY - parentRect.top) / scale - dragOffset.y;

      onDrag({ x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, scale, onDrag]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect();

    const rect = elementRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / scale;
    const offsetY = (e.clientY - rect.top) / scale;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const rotationRad = (item.rotation || 0) * (Math.PI / 180);
  const cos = Math.abs(Math.cos(rotationRad));
  const sin = Math.abs(Math.sin(rotationRad));
  const rotatedWidth = displayWidth * cos + displayDepth * sin;
  const rotatedDepth = displayWidth * sin + displayDepth * cos;

  const boundedX = Math.max(rotatedWidth / 2, Math.min(item.position.x, roomBounds.width - rotatedWidth / 2));
  const boundedY = Math.max(rotatedDepth / 2, Math.min(item.position.y, roomBounds.height - rotatedDepth / 2));

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move transition-shadow ${
        isSelected ? 'z-10' : 'z-0'
      }`}
      style={{
        left: boundedX - displayWidth / 2,
        top: boundedY - displayDepth / 2,
        width: displayWidth,
        height: displayDepth,
        transform: `rotate(${item.rotation || 0}deg)`,
        transformOrigin: 'center center'
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`w-full h-full rounded-sm transition-all ${
          isSelected 
            ? 'ring-2 ring-primary-500 ring-offset-2' 
            : 'hover:ring-2 hover:ring-gray-300'
        } ${isDragging ? 'opacity-80' : ''}`}
        style={{ backgroundColor: item.color }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-xs font-medium px-1 py-0.5 rounded bg-white bg-opacity-90 text-gray-700 truncate max-w-full"
            style={{ 
              transform: `rotate(-${item.rotation || 0}deg)`,
              fontSize: Math.max(8, Math.min(12, displayWidth / 10))
            }}
          >
            {item.name}
          </span>
        </div>
      </div>

      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
        </>
      )}
    </div>
  );
}
