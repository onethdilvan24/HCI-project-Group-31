export function Room3D({ width, depth, height }) {
  const wallThickness = 0.05;
  const wallColor = '#F5F5F4';
  const floorColor = '#E7E5E4';

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[width / 2, 0, depth / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      <mesh 
        position={[width / 2, height / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh 
        position={[0, height / 2, depth / 2]}
        receiveShadow
      >
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh 
        position={[width, height / 2, depth / 2]}
        receiveShadow
      >
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>

      <mesh 
        position={[width / 2, height / 2, depth]}
        receiveShadow
      >
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
