import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export default function EnvironmentSetup() {
  // Sky texture
  const skyTexture = useTexture("/textures/sky.png");
  skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping;
  skyTexture.repeat.set(4, 2);
  
  // Create stars (random positions)
  const starPositions = useMemo(() => {
    const positions = [];
    const count = 200;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 40 + Math.random() * 20;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push({ 
        position: new THREE.Vector3(x, y, z),
        scale: 0.05 + Math.random() * 0.15
      });
    }
    
    return positions;
  }, []);

  return (
    <group>
      {/* Stars */}
      {starPositions.map((star, i) => (
        <mesh key={i} position={star.position} scale={star.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Ambient light particles - pre-calculated positions */}
      {useMemo(() => {
        const particles = [];
        const count = 20;
        
        for (let i = 0; i < count; i++) {
          const x = (Math.random() - 0.5) * 30;
          const y = 0.5 + Math.random() * 3;
          const z = (Math.random() - 0.5) * 30;
          const scale = 0.2 + Math.random() * 0.3;
          
          particles.push(
            <mesh 
              key={`light-particle-${i}`} 
              position={new THREE.Vector3(x, y, z)}
            >
              <sphereGeometry args={[scale, 8, 8]} />
              <meshBasicMaterial color={["#44aaff", "#aaddff"][i % 2]} transparent opacity={0.3} />
            </mesh>
          );
        }
        
        return particles;
      }, [])}
      
      {/* Developer-themed decorative elements */}
      <group position={[-15, 0, -15]}>
        {/* Large code bracket */}
        <mesh position={[0, 3, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 5, 0.5]}>
          <torusGeometry args={[1, 0.2, 8, 25, Math.PI]} />
          <meshStandardMaterial color="#44aaff" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      
      <group position={[15, 0, -15]}>
        {/* Large code bracket (mirrored) */}
        <mesh position={[0, 3, 0]} rotation={[0, -Math.PI / 4, 0]} scale={[1, 5, 0.5]}>
          <torusGeometry args={[1, 0.2, 8, 25, Math.PI]} />
          <meshStandardMaterial color="#44aaff" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Digital circuit path in the ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.2}
          roughness={0.8}
          emissive="#001122"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Glowing grid lines - pre-calculated */}
      {useMemo(() => {
        const gridLines = [];
        const count = 10;
        
        for (let i = 0; i < count; i++) {
          const pos = -22.5 + i * 5;
          gridLines.push(
            <group key={`grid-${i}`}>
              {/* Horizontal lines */}
              <mesh position={new THREE.Vector3(0, 0.02, pos)} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 0.05]} />
                <meshBasicMaterial color="#44aaff" opacity={0.3} transparent />
              </mesh>
              
              {/* Vertical lines */}
              <mesh position={new THREE.Vector3(pos, 0.02, 0)} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[50, 0.05]} />
                <meshBasicMaterial color="#44aaff" opacity={0.3} transparent />
              </mesh>
            </group>
          );
        }
        
        return gridLines;
      }, [])}
    </group>
  );
}
