import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, useTexture, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { GALLERY_ITEMS } from "@/lib/constants";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface GalleryProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function Gallery({ isActive, onShowInfo }: GalleryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameRefs = useRef<THREE.Mesh[]>([]);
  
  // Load textures for the gallery items
  const textures = useMemo(() => {
    return GALLERY_ITEMS.map(item => useTexture(item.preview));
  }, []);
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("gallery", {
      position: { x: 0, y: 3, z: 0 },
      lookAt: { x: 0, y: 1, z: -15 }
    });
    
    // Register interactive objects
    GALLERY_ITEMS.forEach((item) => {
      usePortfolio.getState().registerInteractiveObject({
        id: `gallery-${item.id}`,
        position: { x: item.position[0], y: item.position[1], z: item.position[2] },
        radius: 3,
        title: item.title,
        content: item.description
      });
    });
  }, []);
  
  // Animate gallery items when section becomes active
  useEffect(() => {
    if (isActive && frameRefs.current.length) {
      frameRefs.current.forEach((frame, index) => {
        if (frame) {
          // Initial position (hidden)
          gsap.set(frame.position, { y: -5 });
          
          // Animate into view
          gsap.to(frame.position, {
            y: GALLERY_ITEMS[index].position[1],
            duration: 1.2,
            delay: index * 0.3,
            ease: "elastic.out(1, 0.5)"
          });
          
          // Rotation animation
          gsap.fromTo(
            frame.rotation,
            { y: GALLERY_ITEMS[index].rotation[1] - Math.PI },
            { 
              y: GALLERY_ITEMS[index].rotation[1],
              duration: 1.5,
              delay: index * 0.3,
              ease: "power2.out"
            }
          );
        }
      });
    }
  }, [isActive]);
  
  // Continuous animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate gallery items
    frameRefs.current.forEach((frame, index) => {
      if (frame) {
        // Floating animation
        frame.position.y = GALLERY_ITEMS[index].position[1] + Math.sin(t * 0.5 + index) * 0.2;
        // Subtle rotation
        frame.rotation.y = GALLERY_ITEMS[index].rotation[1] + Math.sin(t * 0.3 + index * 2) * 0.1;
      }
    });
  });

  // Save refs for the frames
  const setFrameRef = (el: THREE.Mesh, index: number) => {
    if (frameRefs.current.length <= index) {
      frameRefs.current = [...frameRefs.current, el];
    } else {
      frameRefs.current[index] = el;
    }
  };

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Section title */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          font="/fonts/inter.woff"
          position={[0, 7, -15]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          3D Gallery
        </Text>
      </Float>
      
      {/* Gallery displays */}
      {GALLERY_ITEMS.map((item, index) => (
        <group 
          key={item.id} 
          position={item.position as [number, number, number]} 
          rotation={item.rotation as [number, number, number]}
        >
          {/* Frame */}
          <mesh 
            ref={(el) => el && setFrameRef(el, index)} 
            castShadow 
            receiveShadow
            onClick={() => onShowInfo(item.title, item.description)}
          >
            {/* Display stand */}
            <mesh position={[0, -1.5, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.7, 1, 16]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.2} />
            </mesh>
            
            {/* Gallery item frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[4, 3, 0.2]} />
              <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.5} />
              
              {/* Display content (image or preview) */}
              <mesh position={[0, 0, 0.11]}>
                <planeGeometry args={[3.8, 2.8]} />
                <meshBasicMaterial map={textures[index]} />
              </mesh>
              
              {/* Title */}
              <Text
                position={[0, -1.7, 0.15]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
              >
                {item.title}
              </Text>
            </mesh>
          </mesh>
          
          {/* Particle effects around the display */}
          <Sparkles 
            count={20} 
            scale={[4, 3, 4]} 
            size={2} 
            speed={0.3} 
            color="#ffffff" 
          />
        </group>
      ))}
      
      {/* Gallery floor with reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -15]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial 
          color="#111111" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Interactive prompt */}
      <Text
        position={[0, -3, -10]}
        fontSize={0.2}
        color="rgba(255,255,255,0.6)"
        anchorX="center"
        anchorY="middle"
      >
        Click on displays or press E when near to view details
      </Text>
      
      {/* Ambient particles in the gallery space */}
      <Sparkles
        count={100}
        scale={[30, 10, 20]}
        position={[0, 2, -15]}
        size={0.5}
        speed={0.2}
        opacity={0.5}
      />
    </group>
  );
}