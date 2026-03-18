import { useState, useRef, useEffect } from 'react';

const PRESET_COLORS = [
  '#1F2937', '#374151', '#6B7280', '#9CA3AF',
  '#78350F', '#92400E', '#B45309', '#D97706',
  '#166534', '#15803D', '#22C55E', '#4ADE80',
  '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA',
  '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
  '#BE185D', '#DB2777', '#EC4899', '#F472B6',
  '#F5F5F4', '#E7E5E4', '#D6D3D1', '#A8A29E'
];

export function ColorPicker({ color, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color);
  const containerRef = useRef(null);

  useEffect(() => {
    setCustomColor(color);
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (newColor) => {
    onChange(newColor);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Change Color"
      >
        <div 
          className="w-5 h-5 rounded border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-700">Color</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-200 z-50 w-64">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleColorSelect(presetColor)}
                className={`w-7 h-7 rounded border-2 transition-transform hover:scale-110 ${
                  color === presetColor ? 'border-primary-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                  onChange(e.target.value);
                }
              }}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
