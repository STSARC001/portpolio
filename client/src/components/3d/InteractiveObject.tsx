import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere, useBox, useCylinder, usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import { useAudio } from '@/lib/stores/useAudio';

type ShapeType = 'box' | 'sphere' | 'cylinder';

interface InteractiveObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number | [number, number, number];
  mass?: number;
  color?: string | THREE.Color;
  shape?: ShapeType;
  interactive?: boolean;
  onClick?: () => void;
  onCollide?: () => void;
}

export default function InteractiveObject({
  position,
  rotation = [0, 0, 0],
  size = 1,
  mass = 1,
  color = '#ff8800',
  shape = 'box',
  interactive = true,
  onClick,
  onCollide,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Normalize size to array format for all shape types
  const dimensions = Array.isArray(size) ? size : [size, size, size];
  
  // Physics body based on shape type
  const getPhysicsBody = () => {
    switch (shape) {
      case 'sphere':
        return useSphere(() => ({
          mass,
          position,
          args: [dimensions[0]],
          onCollide: (e) => {
            handleCollision(e);
          },
        }));
      case 'cylinder':
        return useCylinder(() => ({
          mass,
          position,
          rotation,
          args: [dimensions[0], dimensions[0], dimensions[1], 16] as [number, number, number, number],
          onCollide: (e) => {
            handleCollision(e);
          },
        }));
      case 'box':
      default:
        return useBox(() => ({
          mass,
          position,
          rotation,
          args: dimensions as [number, number, number],
          onCollide: (e) => {
            handleCollision(e);
          },
        }));
    }
  };
  
  // Get ref and api from the physics body
  const [ref, api] = getPhysicsBody();
  
  // Track velocity for dynamic effects
  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    // Subscribe to velocity changes
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, [api.velocity]);
  
  // Handle collisions
  const handleCollision = (event: any) => {
    if (onCollide) {
      onCollide();
    }
    
    // Play sound on significant collisions
    const impactVelocity = event.contact.impactVelocity;
    if (impactVelocity > 1.5) {
      useAudio.getState().playHit();
    }
  };
  
  // Handle interactions
  const handlePointerOver = () => {
    if (interactive) setHovered(true);
  };
  
  const handlePointerOut = () => {
    if (interactive) setHovered(false);
  };
  
  const handleClick = () => {
    if (interactive) {
      setClicked(!clicked);
      if (onClick) onClick();
      
      // Apply an upward impulse on click
      api.applyImpulse([0, 5, 0], [0, 0, 0]);
      
      // Play success sound
      useAudio.getState().playSuccess();
    }
  };
  
  // Animation for hover effect
  useFrame(() => {
    if (hovered && ref.current) {
      ref.current.scale.set(1.05, 1.05, 1.05);
    } else if (ref.current) {
      ref.current.scale.set(1, 1, 1);
    }
  });
  
  // Render appropriate geometry based on shape
  const renderGeometry = () => {
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[dimensions[0], 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[dimensions[0], dimensions[0], dimensions[1], 32]} />;
      case 'box':
      default:
        return <boxGeometry args={[dimensions[0], dimensions[1], dimensions[2]]} />;
    }
  };
  
  return (
    <mesh
      // @ts-ignore - Type issues with ref from physics
      ref={ref}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {renderGeometry()}
      <meshStandardMaterial 
        color={hovered ? '#ff4400' : color} 
        roughness={0.7}
        metalness={0.2}
        emissive={clicked ? '#441100' : '#000000'}
        emissiveIntensity={clicked ? 0.5 : 0}
      />
    </mesh>
  );
}