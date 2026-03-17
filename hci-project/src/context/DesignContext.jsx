import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storageService';

const DesignContext = createContext(null);

const DEFAULT_ROOM_DIMENSIONS = {
  width: 800,
  height: 600,
  depth: 300
};

const createNewDesign = (name = 'Untitled Design') => ({
  id: uuidv4(),
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  roomDimensions: { ...DEFAULT_ROOM_DIMENSIONS },
  furniture: []
});

export function DesignProvider({ children }) {
  const [currentDesign, setCurrentDesign] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    const designs = storageService.getAllDesigns();
    setSavedDesigns(designs);
  }, []);

  const createDesign = useCallback((name) => {
    const newDesign = createNewDesign(name);
    setCurrentDesign(newDesign);
    setSelectedItemId(null);
    return newDesign;
  }, []);

  const loadDesign = useCallback((designId) => {
    const design = storageService.getDesign(designId);
    if (design) {
      setCurrentDesign(design);
      setSelectedItemId(null);
      return design;
    }
    return null;
  }, []);

  const saveDesign = useCallback(() => {
    if (!currentDesign) return false;
    
    const updatedDesign = {
      ...currentDesign,
      updatedAt: new Date().toISOString()
    };
    
    storageService.saveDesign(updatedDesign);
    setCurrentDesign(updatedDesign);
    
    setSavedDesigns(prev => {
      const exists = prev.find(d => d.id === updatedDesign.id);
      if (exists) {
        return prev.map(d => d.id === updatedDesign.id ? updatedDesign : d);
      }
      return [...prev, updatedDesign];
    });
    
    return true;
  }, [currentDesign]);

  const deleteDesign = useCallback((designId) => {
    storageService.deleteDesign(designId);
    setSavedDesigns(prev => prev.filter(d => d.id !== designId));
    
    if (currentDesign?.id === designId) {
      setCurrentDesign(null);
      setSelectedItemId(null);
    }
  }, [currentDesign]);

  const updateDesignName = useCallback((name) => {
    if (!currentDesign) return;
    setCurrentDesign(prev => ({ ...prev, name }));
  }, [currentDesign]);

  const updateRoomDimensions = useCallback((dimensions) => {
    if (!currentDesign) return;
    setCurrentDesign(prev => ({
      ...prev,
      roomDimensions: { ...prev.roomDimensions, ...dimensions }
    }));
  }, [currentDesign]);

  const addFurniture = useCallback((furnitureData) => {
    if (!currentDesign) return null;
    
    const newItem = {
      instanceId: uuidv4(),
      furnitureId: furnitureData.id,
      name: furnitureData.name,
      width: furnitureData.width,
      height: furnitureData.height,
      depth: furnitureData.depth,
      position: { x: 100, y: 100 },
      rotation: 0,
      scale: 1,
      color: furnitureData.color
    };
    
    setCurrentDesign(prev => ({
      ...prev,
      furniture: [...prev.furniture, newItem]
    }));
    
    setSelectedItemId(newItem.instanceId);
    return newItem;
  }, [currentDesign]);

  const updateFurniture = useCallback((instanceId, updates) => {
    if (!currentDesign) return;
    
    setCurrentDesign(prev => ({
      ...prev,
      furniture: prev.furniture.map(item =>
        item.instanceId === instanceId ? { ...item, ...updates } : item
      )
    }));
  }, [currentDesign]);

  const removeFurniture = useCallback((instanceId) => {
    if (!currentDesign) return;
    
    setCurrentDesign(prev => ({
      ...prev,
      furniture: prev.furniture.filter(item => item.instanceId !== instanceId)
    }));
    
    if (selectedItemId === instanceId) {
      setSelectedItemId(null);
    }
  }, [currentDesign, selectedItemId]);

  const selectItem = useCallback((instanceId) => {
    setSelectedItemId(instanceId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItemId(null);
  }, []);

  const getSelectedItem = useCallback(() => {
    if (!currentDesign || !selectedItemId) return null;
    return currentDesign.furniture.find(item => item.instanceId === selectedItemId);
  }, [currentDesign, selectedItemId]);

  const value = {
    currentDesign,
    savedDesigns,
    selectedItemId,
    createDesign,
    loadDesign,
    saveDesign,
    deleteDesign,
    updateDesignName,
    updateRoomDimensions,
    addFurniture,
    updateFurniture,
    removeFurniture,
    selectItem,
    clearSelection,
    getSelectedItem
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
