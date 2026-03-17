import { useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import { FurnitureCard } from './FurnitureCard';
import furnitureData from '../../data/furniture.json';

export function FurnitureLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addFurniture } = useDesign();

  const filteredItems = furnitureData.items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddFurniture = (item) => {
    addFurniture(item);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Furniture</h2>
        
        <input
          type="text"
          placeholder="Search furniture..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {furnitureData.categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No furniture found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map(item => (
              <FurnitureCard
                key={item.id}
                item={item}
                onAdd={() => handleAddFurniture(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
