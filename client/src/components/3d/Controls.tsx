import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolio } from "@/lib/stores/usePortfolio";

// Controls component handles user movement through the 3D space
export default function Controls() {
  const characterRef = useRef<THREE.Group>(null);
  const speed = 0.15;
  const jumpForce = 0.5;
  const gravity = 0.02;
  
  // State for character physics
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  
  // Get movement controls
  const forward = useKeyboardControls(state => state.forward);
  const backward = useKeyboardControls(state => state.backward);
  const leftward = useKeyboardControls(state => state.leftward);
  const rightward = useKeyboardControls(state => state.rightward);
  const jump = useKeyboardControls(state => state.jump);
  const interact = useKeyboardControls(state => state.interact);
  
  // Get position and setter from global state
  const playerPosition = usePortfolio(state => state.playerPosition);
  const setPlayerPosition = usePortfolio(state => state.setPlayerPosition);
  
  // Use for user interaction
  useEffect(() => {
    if (interact) {
      console.log("Interact key pressed", playerPosition);
      // Check for nearby interactable objects and trigger interaction
      usePortfolio.getState().checkInteractions(playerPosition);
    }
  }, [interact, playerPosition]);

  // Keyboard controls update
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Movement direction
    const direction = new THREE.Vector3();
    
    // Forward/backward movement
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    
    // Left/right movement
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;
    
    // Normalize direction if moving diagonally
    if (direction.length() > 0) {
      direction.normalize();
    }
    
    // Apply movement to velocity
    velocity.current.x = direction.x * speed;
    velocity.current.z = direction.z * speed;
    
    // Handle jumping
    if (jump && isGrounded.current) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
      console.log("Jumping");
    }
    
    // Apply gravity if not on ground
    if (!isGrounded.current) {
      velocity.current.y -= gravity;
    }
    
    // Move character
    characterRef.current.position.x += velocity.current.x;
    characterRef.current.position.y += velocity.current.y;
    characterRef.current.position.z += velocity.current.z;
    
    // Check if back on ground
    if (characterRef.current.position.y < 0.5) {
      characterRef.current.position.y = 0.5;
      velocity.current.y = 0;
      isGrounded.current = true;
    }
    
    // Limit movement area
    const boundaryLimit = 40;
    characterRef.current.position.x = THREE.MathUtils.clamp(
      characterRef.current.position.x, 
      -boundaryLimit, 
      boundaryLimit
    );
    characterRef.current.position.z = THREE.MathUtils.clamp(
      characterRef.current.position.z, 
      -boundaryLimit, 
      boundaryLimit
    );
    
    // Update global position state (only when values actually change)
    if (
      characterRef.current.position.x !== playerPosition.x ||
      characterRef.current.position.y !== playerPosition.y ||
      characterRef.current.position.z !== playerPosition.z
    ) {
      setPlayerPosition({
        x: characterRef.current.position.x,
        y: characterRef.current.position.y,
        z: characterRef.current.position.z
      });
    }
    
    // Face direction of movement if moving
    if (direction.length() > 0) {
      const angle = Math.atan2(direction.x, direction.z);
      characterRef.current.rotation.y = angle;
    }
  });

  return (
    <group ref={characterRef} position={[0, 0.5, 0]}>
      {/* Player representation */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#2288ff" />
      </mesh>
      {/* Add small indicator for direction facing */}
      <mesh position={[0, 0.5, -0.35]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
