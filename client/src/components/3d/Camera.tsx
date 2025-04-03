import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface CameraProps {
  activeSection: string;
}

export default function Camera({ activeSection }: CameraProps) {
  const { camera, scene } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const playerPosition = usePortfolio(state => state.playerPosition);
  const followPlayer = usePortfolio(state => state.followPlayer);
  
  // Set up initial camera
  useEffect(() => {
    if (cameraRef.current) {
      // Update main camera with our camera's properties
      camera.position.copy(cameraRef.current.position);
      camera.rotation.copy(cameraRef.current.rotation);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Camera follow logic
  useFrame(() => {
    if (!followPlayer || !cameraRef.current) return;
    
    // Smoothly follow player from behind and slightly above
    const idealOffset = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + 3,
      playerPosition.z + 5
    );
    
    // Smooth camera movement
    cameraRef.current.position.lerp(idealOffset, 0.05);
    
    // Look at player
    const lookAtPos = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + 1,
      playerPosition.z
    );
    cameraRef.current.lookAt(lookAtPos);
    
    // Update main camera
    camera.position.copy(cameraRef.current.position);
    camera.rotation.copy(cameraRef.current.rotation);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 3, 10]}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
}
