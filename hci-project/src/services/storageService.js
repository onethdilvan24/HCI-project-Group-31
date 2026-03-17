const STORAGE_KEY = 'interior_designs';

export const storageService = {
  getAllDesigns() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading designs:', error);
      return [];
    }
  },

  getDesign(id) {
    const designs = this.getAllDesigns();
    return designs.find(d => d.id === id) || null;
  },

  saveDesign(design) {
    try {
      const designs = this.getAllDesigns();
      const existingIndex = designs.findIndex(d => d.id === design.id);
      
      if (existingIndex >= 0) {
        designs[existingIndex] = design;
      } else {
        designs.push(design);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
      return true;
    } catch (error) {
      console.error('Error saving design:', error);
      return false;
    }
  },

  deleteDesign(id) {
    try {
      const designs = this.getAllDesigns();
      const filtered = designs.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting design:', error);
      return false;
    }
  },

  clearAllDesigns() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing designs:', error);
      return false;
    }
  }
};
