import { ColorPicker } from './ColorPicker';

export function EditorToolbar({ selectedItem, onRotate, onDelete, onColorChange, onClearSelection }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4 shrink-0">
      <span className="text-sm text-gray-500">Tools:</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onRotate}
          disabled={!selectedItem}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Rotate 45°"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={onDelete}
          disabled={!selectedItem}
          className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Delete"
        >
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ColorPicker
          color={selectedItem?.color || '#6B7280'}
          onChange={onColorChange}
          disabled={!selectedItem}
        />
      </div>

      {selectedItem && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Selected:</span>
            <span className="font-medium text-gray-900">{selectedItem.name}</span>
            <button
              onClick={onClearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}

      <div className="ml-auto text-xs text-gray-400">
        Tip: Click furniture in 2D view to select, drag to move
      </div>
    </div>
  );
}
