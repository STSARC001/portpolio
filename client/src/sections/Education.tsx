import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { EDUCATION } from "@/lib/constants";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface EducationProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function Education({ isActive, onShowInfo }: EducationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<THREE.Group>(null);
  
  // Textures
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("education", {
      position: { x: 10, y: 5, z: 5 },
      lookAt: { x: 0, y: 2, z: -10 }
    });
    
    // Register interactive objects
    EDUCATION.forEach((edu, index) => {
      usePortfolio.getState().registerInteractiveObject({
        id: `education-${edu.id}`,
        position: { x: 0, y: 3 - index * 2.5, z: -12 },
        radius: 2.5,
        title: `${edu.degree}`,
        content: `${edu.institution} (${edu.duration})\n\n${edu.description}\n\nAchievements: ${edu.achievements.join(", ")}`
      });
    });
  }, []);
  
  // Animate on section activation
  useEffect(() => {
    if (isActive && itemsRef.current) {
      // Animate education items with a staggered effect
      EDUCATION.forEach((_, index) => {
        const item = itemsRef.current?.children[index];
        if (item) {
          gsap.fromTo(
            item.position,
            { z: -20 },
            { 
              z: -12, 
              duration: 1.2,
              delay: index * 0.3,
              ease: "elastic.out(1, 0.75)"
            }
          );
          
          gsap.fromTo(
            item.rotation,
            { y: Math.PI },
            {
              y: 0,
              duration: 1.2,
              delay: index * 0.3,
              ease: "elastic.out(1, 0.75)"
            }
          );
        }
      });
    }
  }, [isActive]);
  
  // Continuous animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    }
    
    // Animate individual education items
    if (itemsRef.current && isActive) {
      EDUCATION.forEach((_, index) => {
        const item = itemsRef.current?.children[index];
        if (item) {
          // Subtle floating animation
          item.position.y = 3 - index * 2.5 + Math.sin(t * 0.4 + index * 1.2) * 0.1;
          // Subtle rotation
          item.rotation.z = Math.sin(t * 0.3 + index) * 0.03;
        }
      });
    }
  });

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Section title */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          font="/fonts/inter.woff"
          position={[0, 7, -12]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Education
        </Text>
      </Float>
      
      {/* Education items */}
      <group ref={itemsRef}>
        {EDUCATION.map((edu, index) => (
          <group 
            key={edu.id} 
            position={[0, 3 - index * 2.5, -12]}
            onClick={() => onShowInfo(
              edu.degree, 
              `${edu.institution} (${edu.duration})\n\n${edu.description}\n\nAchievements: ${edu.achievements.join(", ")}`
            )}
          >
            {/* Education certificate frame */}
            <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
              <boxGeometry args={[5, 3, 0.2]} />
              <meshStandardMaterial 
                map={woodTexture} 
                color={edu.color} 
                metalness={0.3} 
                roughness={0.7}
              />
            </mesh>
            
            {/* Certificate content (diploma paper) */}
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[4.6, 2.6]} />
              <meshBasicMaterial color="#f5f5dc" /> {/* Parchment color */}
            </mesh>
            
            {/* Ribbon/Seal */}
            <mesh position={[-1.8, -1, 0.15]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
              <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Degree text */}
            <Text
              position={[0, 0.8, 0.15]}
              fontSize={0.3}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              maxWidth={4}
              font="/fonts/inter.woff"
              fontWeight="bold"
            >
              {edu.degree}
            </Text>
            
            {/* Institution text */}
            <Text
              position={[0, 0.3, 0.15]}
              fontSize={0.25}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              maxWidth={4}
              font="/fonts/inter.woff"
            >
              {edu.institution}
            </Text>
            
            {/* Duration text */}
            <Text
              position={[0, -0.1, 0.15]}
              fontSize={0.2}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              maxWidth={4}
              font="/fonts/inter.woff"
            >
              {edu.duration}
            </Text>
            
            {/* Achievement badges */}
            {edu.achievements.map((achievement, i) => (
              <group key={i} position={[-1.8 + i * 1.2, -0.8, 0.15]}>
                <mesh>
                  <circleGeometry args={[0.2, 32]} />
                  <meshStandardMaterial color={edu.color} metalness={0.5} roughness={0.5} />
                </mesh>
                <Text
                  position={[0, 0, 0.01]}
                  fontSize={0.1}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  ✓
                </Text>
              </group>
            ))}
          </group>
        ))}
      </group>
      
      {/* Interactive prompt */}
      <Text
        position={[0, -3, -10]}
        fontSize={0.2}
        color="rgba(255,255,255,0.6)"
        anchorX="center"
        anchorY="middle"
      >
        Click on certificates or press E when near to view details
      </Text>
    </group>
  );
}