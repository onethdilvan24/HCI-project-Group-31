import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { FurnitureLibrary } from '../components/furniture/FurnitureLibrary';
import { Canvas2D } from '../components/layout2D/Canvas2D';
import { Scene3D } from '../components/layout3D/Scene3D';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { Button } from '../components/common/Button';

export function EditorPage() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentDesign, 
    loadDesign, 
    createDesign,
    saveDesign, 
    updateDesignName,
    selectedItemId,
    getSelectedItem,
    updateFurniture,
    removeFurniture,
    clearSelection
  } = useDesign();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (designId) {
      const loaded = loadDesign(designId);
      if (!loaded) {
        navigate('/dashboard');
      }
    } else if (!currentDesign) {
      createDesign('Untitled Design');
    }
  }, [designId, loadDesign, createDesign, currentDesign, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const success = saveDesign();
    setIsSaving(false);
    
    if (success) {
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const handleNameEdit = () => {
    setEditedName(currentDesign?.name || '');
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (editedName.trim()) {
      updateDesignName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleRotate = () => {
    const item = getSelectedItem();
    if (item) {
      updateFurniture(item.instanceId, { 
        rotation: (item.rotation + 45) % 360 
      });
    }
  };

  const handleDelete = () => {
    if (selectedItemId) {
      removeFurniture(selectedItemId);
    }
  };

  const handleColorChange = (color) => {
    const item = getSelectedItem();
    if (item) {
      updateFurniture(item.instanceId, { color });
    }
  };

  if (!currentDesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const selectedItem = getSelectedItem();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              className="text-lg font-semibold px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          ) : (
            <button
              onClick={handleNameEdit}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {currentDesign.name}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.name}</span>
          {saveMessage && (
            <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Design'}
          </Button>
        </div>
      </header>

      <EditorToolbar
        selectedItem={selectedItem}
        onRotate={handleRotate}
        onDelete={handleDelete}
        onColorChange={handleColorChange}
        onClearSelection={clearSelection}
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <FurnitureLibrary />
        </aside>

        <main className="flex-1 flex">
          <div className="flex-1 p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-sm h-full overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">2D Layout</h3>
              </div>
              <div className="h-[calc(100%-40px)]">
                <Canvas2D />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-sm h-full overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">3D Preview</h3>
              </div>
              <div className="h-[calc(100%-40px)]">
                <Scene3D />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
