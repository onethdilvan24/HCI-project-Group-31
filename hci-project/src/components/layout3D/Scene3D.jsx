import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { useDesign } from '../../context/DesignContext';
import { Room3D } from './Room3D';
import { FurnitureItem3D } from './FurnitureItem3D';
import furnitureData from '../../data/furniture.json';

const MODEL_PATHS = furnitureData.items
  .filter(item => item.model3D)
  .map(item => item.model3D);

function PreloadModels() {
  useEffect(() => {
    MODEL_PATHS.forEach(path => {
      try {
        useGLTF.preload(path);
      } catch (e) {
        // Model might not exist yet, that's okay
      }
    });
  }, []);
  
  return null;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#e5e7eb" wireframe />
    </mesh>
  );
}

export function Scene3D() {
  const { currentDesign, selectedItemId, selectItem } = useDesign();
  const roomDimensions = currentDesign?.roomDimensions || { width: 800, height: 600, depth: 300 };

  const scale3D = 0.01;
  const roomWidth = roomDimensions.width * scale3D;
  const roomDepth = roomDimensions.height * scale3D;
  const roomHeight = roomDimensions.depth * scale3D;

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          position={[roomWidth * 1.5, roomHeight * 2, roomDepth * 1.5]} 
          fov={50}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        <Room3D 
          width={roomWidth} 
          depth={roomDepth} 
          height={roomHeight} 
        />

        <Suspense fallback={<LoadingFallback />}>
          <PreloadModels />
          {currentDesign?.furniture.map(item => (
            <FurnitureItem3D
              key={item.instanceId}
              item={item}
              scale3D={scale3D}
              roomDimensions={{ width: roomWidth, depth: roomDepth }}
              isSelected={selectedItemId === item.instanceId}
              onSelect={() => selectItem(item.instanceId)}
            />
          ))}
        </Suspense>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          target={[roomWidth / 2, 0, roomDepth / 2]}
        />

        <gridHelper 
          args={[20, 20, '#E5E7EB', '#E5E7EB']} 
          position={[roomWidth / 2, -0.01, roomDepth / 2]}
        />
      </Canvas>
    </div>
  );
}
