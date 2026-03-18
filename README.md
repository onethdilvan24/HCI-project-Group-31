# Interior Design Studio

A modern web-based interior design application built with React.js and Three.js. Create virtual room layouts with 2D drag-and-drop editing synchronized with real-time 3D visualization.

## Features

- **Authentication**: Simple login system with protected routes
- **Dashboard**: Create, view, and manage your room designs
- **2D Layout Editor**: Drag-and-drop furniture placement with rotation support
- **3D Visualization**: Real-time 3D preview synchronized with 2D layout
- **Furniture Library**: Categorized furniture items with search functionality
- **Design Persistence**: Save and load designs using localStorage

## Tech Stack

- React 18 with functional components and hooks
- Vite for fast development and building
- Three.js with @react-three/fiber and @react-three/drei for 3D rendering
- React Router v6 for navigation
- Context API for state management
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Login**: Use any email and password to sign in (mock authentication)
2. **Dashboard**: Click "New Design" to create a room layout
3. **Editor**: 
   - Browse furniture in the left panel
   - Click the + button to add furniture to the room
   - Drag furniture in the 2D view to position it
   - Use the toolbar to rotate, delete, or change colors
   - View real-time 3D preview on the right
4. **Save**: Click "Save Design" to persist your work

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login form
│   ├── common/        # Reusable UI components
│   ├── dashboard/     # Design list and cards
│   ├── editor/        # Toolbar and color picker
│   ├── furniture/     # Furniture library
│   ├── layout2D/      # 2D canvas and items
│   └── layout3D/      # 3D scene and models
├── context/           # Auth and Design contexts
├── data/              # Furniture JSON data
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # Storage service
└── utils/             # Helper functions
```

## License

MIT
