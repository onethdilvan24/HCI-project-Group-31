import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { Button } from '../components/common/Button';
import { Modal, ConfirmModal } from '../components/common/Modal';
import { DesignList } from '../components/dashboard/DesignList';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { savedDesigns, createDesign, deleteDesign } = useDesign();
  const navigate = useNavigate();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [newDesignName, setNewDesignName] = useState('');

  const handleCreateDesign = () => {
    const name = newDesignName.trim() || 'Untitled Design';
    createDesign(name);
    setNewDesignName('');
    setIsCreateModalOpen(false);
    navigate('/editor');
  };

  const handleOpenDesign = (designId) => {
    navigate(`/editor/${designId}`);
  };

  const handleDeleteClick = (design) => {
    setDesignToDelete(design);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (designToDelete) {
      deleteDesign(designToDelete.id);
      setDesignToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Interior Design Studio</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
              <Button variant="ghost" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Designs</h2>
            <p className="text-gray-600 mt-1">Create and manage your room designs</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Design
          </Button>
        </div>

        <DesignList
          designs={savedDesigns}
          onOpen={handleOpenDesign}
          onDelete={handleDeleteClick}
        />
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Design"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDesign}>
              Create Design
            </Button>
          </>
        }
      >
        <div>
          <label htmlFor="designName" className="block text-sm font-medium text-gray-700 mb-2">
            Design Name
          </label>
          <input
            id="designName"
            type="text"
            value={newDesignName}
            onChange={(e) => setNewDesignName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="My Living Room"
            autoFocus
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Design"
        message={`Are you sure you want to delete "${designToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
