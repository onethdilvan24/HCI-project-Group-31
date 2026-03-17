import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function GLTFModel({ url, targetWidth, targetHeight, targetDepth }) {
  const { scene } = useGLTF(url);
  
  const { clonedScene, scale } = useMemo(() => {
    const cloned = scene.clone(true);
    
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    const scaleX = targetWidth / size.x;
    const scaleY = targetHeight / size.y;
    const scaleZ = targetDepth / size.z;
    const uniformScale = Math.min(scaleX, scaleY, scaleZ);
    
    cloned.position.set(-center.x, -center.y + size.y / 2, -center.z);
    
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return { clonedScene: cloned, scale: uniformScale };
  }, [scene, targetWidth, targetHeight, targetDepth]);

  return (
    <group scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  );
}

function SofaModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const darkColor = colorObj.clone().multiplyScalar(0.7);
  
  const seatHeight = height * 0.4;
  const backHeight = height * 0.6;
  const armWidth = width * 0.1;
  const cushionDepth = depth * 0.7;
  
  return (
    <group>
      {/* Base/Seat */}
      <mesh castShadow receiveShadow position={[0, seatHeight / 2, 0]}>
        <boxGeometry args={[width, seatHeight, depth]} />
        <meshStandardMaterial color={darkColor} />
      </mesh>
      {/* Back cushion */}
      <mesh castShadow receiveShadow position={[0, seatHeight + backHeight / 2, -depth / 2 + depth * 0.15]}>
        <boxGeometry args={[width - armWidth * 2, backHeight, depth * 0.3]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Left arm */}
      <mesh castShadow receiveShadow position={[-width / 2 + armWidth / 2, seatHeight + backHeight * 0.3, 0]}>
        <boxGeometry args={[armWidth, backHeight * 0.6, depth]} />
        <meshStandardMaterial color={darkColor} />
      </mesh>
      {/* Right arm */}
      <mesh castShadow receiveShadow position={[width / 2 - armWidth / 2, seatHeight + backHeight * 0.3, 0]}>
        <boxGeometry args={[armWidth, backHeight * 0.6, depth]} />
        <meshStandardMaterial color={darkColor} />
      </mesh>
      {/* Seat cushions */}
      <mesh castShadow receiveShadow position={[0, seatHeight + 0.02, depth * 0.1]}>
        <boxGeometry args={[width - armWidth * 2.5, 0.08, cushionDepth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
    </group>
  );
}

function ChairModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const legColor = new THREE.Color('#4a3728');
  
  const seatHeight = height * 0.45;
  const seatThickness = height * 0.05;
  const legWidth = width * 0.08;
  const backHeight = height * 0.5;
  
  return (
    <group>
      {/* Seat */}
      <mesh castShadow receiveShadow position={[0, seatHeight, 0]}>
        <boxGeometry args={[width, seatThickness, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Back */}
      <mesh castShadow receiveShadow position={[0, seatHeight + backHeight / 2, -depth / 2 + legWidth / 2]}>
        <boxGeometry args={[width * 0.9, backHeight, legWidth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Front left leg */}
      <mesh castShadow receiveShadow position={[-width / 2 + legWidth, seatHeight / 2, depth / 2 - legWidth]}>
        <boxGeometry args={[legWidth, seatHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      {/* Front right leg */}
      <mesh castShadow receiveShadow position={[width / 2 - legWidth, seatHeight / 2, depth / 2 - legWidth]}>
        <boxGeometry args={[legWidth, seatHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      {/* Back left leg */}
      <mesh castShadow receiveShadow position={[-width / 2 + legWidth, seatHeight / 2 + backHeight / 2, -depth / 2 + legWidth]}>
        <boxGeometry args={[legWidth, seatHeight + backHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      {/* Back right leg */}
      <mesh castShadow receiveShadow position={[width / 2 - legWidth, seatHeight / 2 + backHeight / 2, -depth / 2 + legWidth]}>
        <boxGeometry args={[legWidth, seatHeight + backHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
    </group>
  );
}

function OfficeChairModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const metalColor = new THREE.Color('#333333');
  
  const seatHeight = height * 0.45;
  const seatThickness = height * 0.06;
  const backHeight = height * 0.45;
  
  return (
    <group>
      {/* Base star */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh key={i} castShadow receiveShadow 
          position={[
            Math.sin(angle * Math.PI / 180) * width * 0.4,
            0.02,
            Math.cos(angle * Math.PI / 180) * width * 0.4
          ]}
          rotation={[0, angle * Math.PI / 180, 0]}
        >
          <boxGeometry args={[width * 0.08, 0.04, width * 0.4]} />
          <meshStandardMaterial color={metalColor} />
        </mesh>
      ))}
      {/* Center pole */}
      <mesh castShadow receiveShadow position={[0, seatHeight / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, seatHeight, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} />
      </mesh>
      {/* Seat */}
      <mesh castShadow receiveShadow position={[0, seatHeight, 0]}>
        <boxGeometry args={[width * 0.9, seatThickness, depth * 0.9]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Back */}
      <mesh castShadow receiveShadow position={[0, seatHeight + backHeight / 2 + seatThickness, -depth / 2 + depth * 0.1]}>
        <boxGeometry args={[width * 0.85, backHeight, depth * 0.1]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Armrests */}
      <mesh castShadow receiveShadow position={[-width * 0.4, seatHeight + seatThickness + 0.1, 0]}>
        <boxGeometry args={[0.04, 0.04, depth * 0.5]} />
        <meshStandardMaterial color={metalColor} />
      </mesh>
      <mesh castShadow receiveShadow position={[width * 0.4, seatHeight + seatThickness + 0.1, 0]}>
        <boxGeometry args={[0.04, 0.04, depth * 0.5]} />
        <meshStandardMaterial color={metalColor} />
      </mesh>
    </group>
  );
}

function TableModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const legColor = colorObj.clone().multiplyScalar(0.8);
  
  const topThickness = height * 0.06;
  const legWidth = Math.min(width, depth) * 0.08;
  const legHeight = height - topThickness;
  
  return (
    <group>
      {/* Table top */}
      <mesh castShadow receiveShadow position={[0, height - topThickness / 2, 0]}>
        <boxGeometry args={[width, topThickness, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Legs */}
      <mesh castShadow receiveShadow position={[-width / 2 + legWidth, legHeight / 2, -depth / 2 + legWidth]}>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      <mesh castShadow receiveShadow position={[width / 2 - legWidth, legHeight / 2, -depth / 2 + legWidth]}>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      <mesh castShadow receiveShadow position={[-width / 2 + legWidth, legHeight / 2, depth / 2 - legWidth]}>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      <mesh castShadow receiveShadow position={[width / 2 - legWidth, legHeight / 2, depth / 2 - legWidth]}>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial color={legColor} />
      </mesh>
    </group>
  );
}

function BedModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const frameColor = new THREE.Color('#5c4033');
  const pillowColor = new THREE.Color('#f5f5f5');
  
  const frameHeight = height * 0.3;
  const mattressHeight = height * 0.4;
  const headboardHeight = height * 0.8;
  
  return (
    <group>
      {/* Frame */}
      <mesh castShadow receiveShadow position={[0, frameHeight / 2, 0]}>
        <boxGeometry args={[width, frameHeight, depth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Mattress */}
      <mesh castShadow receiveShadow position={[0, frameHeight + mattressHeight / 2, depth * 0.02]}>
        <boxGeometry args={[width * 0.95, mattressHeight, depth * 0.92]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Headboard */}
      <mesh castShadow receiveShadow position={[0, headboardHeight / 2, -depth / 2 + 0.05]}>
        <boxGeometry args={[width, headboardHeight, 0.1]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Pillows */}
      <mesh castShadow receiveShadow position={[-width * 0.25, frameHeight + mattressHeight + 0.05, -depth * 0.35]}>
        <boxGeometry args={[width * 0.35, 0.1, depth * 0.2]} />
        <meshStandardMaterial color={pillowColor} />
      </mesh>
      <mesh castShadow receiveShadow position={[width * 0.25, frameHeight + mattressHeight + 0.05, -depth * 0.35]}>
        <boxGeometry args={[width * 0.35, 0.1, depth * 0.2]} />
        <meshStandardMaterial color={pillowColor} />
      </mesh>
    </group>
  );
}

function BookshelfModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const shelfCount = 5;
  const shelfThickness = height * 0.03;
  const sideThickness = width * 0.05;
  
  return (
    <group>
      {/* Left side */}
      <mesh castShadow receiveShadow position={[-width / 2 + sideThickness / 2, height / 2, 0]}>
        <boxGeometry args={[sideThickness, height, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Right side */}
      <mesh castShadow receiveShadow position={[width / 2 - sideThickness / 2, height / 2, 0]}>
        <boxGeometry args={[sideThickness, height, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Back */}
      <mesh castShadow receiveShadow position={[0, height / 2, -depth / 2 + 0.01]}>
        <boxGeometry args={[width - sideThickness * 2, height, 0.02]} />
        <meshStandardMaterial color={colorObj.clone().multiplyScalar(0.9)} />
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => (
        <mesh key={i} castShadow receiveShadow 
          position={[0, (height / (shelfCount - 1)) * i + shelfThickness / 2, 0]}
        >
          <boxGeometry args={[width - sideThickness * 2, shelfThickness, depth]} />
          <meshStandardMaterial color={colorObj} />
        </mesh>
      ))}
    </group>
  );
}

function CabinetModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const handleColor = new THREE.Color('#888888');
  
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Doors (visual lines) */}
      <mesh castShadow receiveShadow position={[0, height / 2, depth / 2 + 0.005]}>
        <boxGeometry args={[0.01, height * 0.9, 0.01]} />
        <meshStandardMaterial color={colorObj.clone().multiplyScalar(0.7)} />
      </mesh>
      {/* Handles */}
      <mesh castShadow receiveShadow position={[-width * 0.15, height / 2, depth / 2 + 0.02]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[width * 0.15, height / 2, depth / 2 + 0.02]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} />
      </mesh>
    </group>
  );
}

function WardrobeModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const handleColor = new THREE.Color('#888888');
  
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Door line */}
      <mesh position={[0, height / 2, depth / 2 + 0.005]}>
        <boxGeometry args={[0.01, height * 0.95, 0.01]} />
        <meshStandardMaterial color={colorObj.clone().multiplyScalar(0.6)} />
      </mesh>
      {/* Handles */}
      <mesh castShadow position={[-width * 0.2, height * 0.5, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} />
      </mesh>
      <mesh castShadow position={[width * 0.2, height * 0.5, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} />
      </mesh>
    </group>
  );
}

function PlantModel({ width, height, depth, color }) {
  const potColor = new THREE.Color('#8B4513');
  const leafColor = new THREE.Color(color);
  
  const potHeight = height * 0.25;
  const potWidth = width * 0.6;
  
  return (
    <group>
      {/* Pot */}
      <mesh castShadow receiveShadow position={[0, potHeight / 2, 0]}>
        <cylinderGeometry args={[potWidth / 2, potWidth / 2.5, potHeight, 16]} />
        <meshStandardMaterial color={potColor} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, potHeight, 0]}>
        <cylinderGeometry args={[potWidth / 2.2, potWidth / 2.2, 0.02, 16]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      {/* Plant leaves (simplified as spheres) */}
      <mesh castShadow position={[0, height * 0.6, 0]}>
        <sphereGeometry args={[width * 0.4, 8, 8]} />
        <meshStandardMaterial color={leafColor} />
      </mesh>
      <mesh castShadow position={[width * 0.15, height * 0.75, width * 0.1]}>
        <sphereGeometry args={[width * 0.25, 8, 8]} />
        <meshStandardMaterial color={leafColor.clone().multiplyScalar(1.1)} />
      </mesh>
      <mesh castShadow position={[-width * 0.12, height * 0.7, -width * 0.08]}>
        <sphereGeometry args={[width * 0.28, 8, 8]} />
        <meshStandardMaterial color={leafColor.clone().multiplyScalar(0.9)} />
      </mesh>
    </group>
  );
}

function LampModel({ width, height, depth, color }) {
  const baseColor = new THREE.Color('#333333');
  const shadeColor = new THREE.Color(color);
  
  const baseHeight = height * 0.05;
  const poleHeight = height * 0.7;
  const shadeHeight = height * 0.25;
  
  return (
    <group>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, baseHeight / 2, 0]}>
        <cylinderGeometry args={[width * 0.4, width * 0.45, baseHeight, 16]} />
        <meshStandardMaterial color={baseColor} metalness={0.5} />
      </mesh>
      {/* Pole */}
      <mesh castShadow position={[0, baseHeight + poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, poleHeight, 8]} />
        <meshStandardMaterial color={baseColor} metalness={0.8} />
      </mesh>
      {/* Shade */}
      <mesh castShadow position={[0, baseHeight + poleHeight + shadeHeight / 2, 0]}>
        <cylinderGeometry args={[width * 0.35, width * 0.5, shadeHeight, 16, 1, true]} />
        <meshStandardMaterial color={shadeColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RugModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  
  return (
    <group>
      <mesh receiveShadow position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colorObj} side={THREE.DoubleSide} />
      </mesh>
      {/* Border */}
      <mesh receiveShadow position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(width, depth) * 0.45, Math.min(width, depth) * 0.48, 32]} />
        <meshStandardMaterial color={colorObj.clone().multiplyScalar(0.7)} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DresserModel({ width, height, depth, color }) {
  const colorObj = new THREE.Color(color);
  const handleColor = new THREE.Color('#888888');
  const drawerCount = 3;
  const drawerHeight = (height * 0.85) / drawerCount;
  
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={colorObj} />
      </mesh>
      {/* Drawers */}
      {Array.from({ length: drawerCount }).map((_, i) => (
        <group key={i}>
          {/* Drawer face */}
          <mesh position={[0, height * 0.1 + drawerHeight * i + drawerHeight / 2, depth / 2 + 0.005]}>
            <boxGeometry args={[width * 0.92, drawerHeight * 0.85, 0.01]} />
            <meshStandardMaterial color={colorObj.clone().multiplyScalar(0.95)} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, height * 0.1 + drawerHeight * i + drawerHeight / 2, depth / 2 + 0.02]}>
            <boxGeometry args={[width * 0.2, 0.02, 0.02]} />
            <meshStandardMaterial color={handleColor} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function getProceduralModel(furnitureId, width, height, depth, color) {
  if (furnitureId.includes('sofa')) {
    return <SofaModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('armchair')) {
    return <SofaModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('chair') && furnitureId.includes('office')) {
    return <OfficeChairModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('chair')) {
    return <ChairModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('table') || furnitureId.includes('desk')) {
    return <TableModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('bed')) {
    return <BedModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('bookshelf')) {
    return <BookshelfModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('cabinet')) {
    return <CabinetModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('wardrobe')) {
    return <WardrobeModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('dresser')) {
    return <DresserModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('plant')) {
    return <PlantModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('lamp')) {
    return <LampModel width={width} height={height} depth={depth} color={color} />;
  }
  if (furnitureId.includes('rug')) {
    return <RugModel width={width} height={height} depth={depth} color={color} />;
  }
  
  // Default box fallback
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function ModelLoader({ item, width, height, depth }) {
  const modelPath = item.model3D;
  const furnitureId = item.furnitureId || item.id || '';
  
  // Always use procedural models for now (more reliable than loading external files)
  return getProceduralModel(furnitureId, width, height, depth, item.color);
}

export function FurnitureItem3D({ item, scale3D, roomDimensions, isSelected, onSelect }) {
  const groupRef = useRef();
  const outlineRef = useRef();

  const width = item.width * scale3D * (item.scale || 1);
  const height = item.height * scale3D * (item.scale || 1);
  const depth = item.depth * scale3D * (item.scale || 1);

  const posX = item.position.x * scale3D;
  const posZ = item.position.y * scale3D;
  const posY = 0; // Models are positioned from ground level

  const rotationY = -(item.rotation || 0) * (Math.PI / 180);

  useFrame(() => {
    if (outlineRef.current) {
      outlineRef.current.visible = isSelected;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[posX, posY, posZ]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <ModelLoader item={item} width={width} height={height} depth={depth} />

      {isSelected && (
        <lineSegments ref={outlineRef} position={[0, height / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(width + 0.02, height + 0.02, depth + 0.02)]} />
          <lineBasicMaterial color="#0ea5e9" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}
