export function FurnitureCard({ item, onAdd }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: item.color + '20' }}
      >
        <div 
          className="w-8 h-8 rounded"
          style={{ backgroundColor: item.color }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-xs text-gray-500">
          {item.width} × {item.depth} cm
        </p>
      </div>
      
      <button
        onClick={onAdd}
        className="p-2 rounded-lg bg-primary-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700"
        title="Add to room"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
