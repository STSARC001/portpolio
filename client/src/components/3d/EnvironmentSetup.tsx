import { Environment, Sky, Stars } from '@react-three/drei';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';

export default function EnvironmentSetup() {
  // Physics floor
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
    type: 'Static',
  }));

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Sky environment */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={1}
      />
      
      {/* Stars for night effect */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      
      {/* Environment map for realistic reflections */}
      <Environment preset="city" background={false} />
      
      {/* Floor */}
      <mesh 
        // @ts-ignore - Type issues with ref from physics
        ref={floorRef} 
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#808080" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </>
  );
}