export function RoomContainer({ width, height }) {
  const gridSize = 50;
  const gridLines = [];

  for (let x = gridSize; x < width; x += gridSize) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    );
  }

  for (let y = gridSize; y < height; y += gridSize) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 room-floor"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      {gridLines}
      
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="#374151"
        strokeWidth="4"
      />

      <text x={width / 2} y={-10} textAnchor="middle" className="text-xs fill-gray-400">
        {width} cm
      </text>
      <text 
        x={-10} 
        y={height / 2} 
        textAnchor="middle" 
        className="text-xs fill-gray-400"
        transform={`rotate(-90, -10, ${height / 2})`}
      >
        {height} cm
      </text>
    </svg>
  );
}
