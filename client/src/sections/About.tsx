import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface AboutProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function About({ isActive, onShowInfo }: AboutProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const sandTexture = useTexture("/textures/sand.jpg");
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("about", {
      position: { x: -10, y: 3, z: 5 },
      lookAt: { x: -10, y: 1, z: -5 }
    });
    
    // Register interactive object
    usePortfolio.getState().registerInteractiveObject({
      id: "aboutMe",
      position: { x: -10, y: 1, z: -5 },
      radius: 3,
      title: "About Me",
      content: "I thrive at the intersection of technology and innovation, transforming complex ideas into impactful, real-world solutions. As the CEO of ZyraTech, I lead a dynamic team in pioneering AI-driven applications, web development, and career empowerment programs. With expertise in AI, machine learning, and full-stack development, my journey spans leadership roles across fintech and technology firms, where I have spearheaded high-impact projects that boost efficiency, scale businesses, and enhance customer experiences."
    });
  }, []);
  
  // Handle section visibility
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (isActive) {
      // Make visible and animate in
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 1,
        ease: "power2.out"
      });
      
      // Sphere animation
      if (sphereRef.current) {
        gsap.to(sphereRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)"
        });
      }
    } else {
      // Hide when not active
      gsap.to(groupRef.current.position, {
        y: -10,
        duration: 0.5,
        ease: "power2.in"
      });
      
      // Reset sphere
      if (sphereRef.current) {
        gsap.to(sphereRef.current.scale, {
          x: 0.1, y: 0.1, z: 0.1,
          duration: 0.3
        });
      }
    }
  }, [isActive]);
  
  // Interactive animation
  useFrame((state) => {
    if (!sphereRef.current || !isActive) return;
    
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.y = t * 0.2;
    // Floating animation
    sphereRef.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef} position={[-10, -10, -5]}>
      {/* About Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        About Me
      </Text>
      
      {/* 3D interactive sphere */}
      <mesh 
        ref={sphereRef} 
        position={[0, 1.5, 0]} 
        scale={[0.1, 0.1, 0.1]} // Start small, will animate to full size
        castShadow
        onClick={() => onShowInfo("About Me", "I thrive at the intersection of technology and innovation, transforming complex ideas into impactful, real-world solutions. As the CEO of ZyraTech, I lead a dynamic team in pioneering AI-driven applications, web development, and career empowerment programs. With expertise in AI, machine learning, and full-stack development, my journey spans leadership roles across fintech and technology firms, where I have spearheaded high-impact projects that boost efficiency, scale businesses, and enhance customer experiences.")}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          map={sandTexture}
          color="#66aadd"
          roughness={0.6}
          metalness={0.3}
        />
        
        {/* Add orbit rings */}
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
              <ringGeometry args={[1.8 + i * 0.2, 1.9 + i * 0.2, 64]} />
              <meshBasicMaterial color="#aaddff" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </mesh>
      
      {/* Display cards with info */}
      {["AI/ML", "Full Stack", "Leadership"].map((skill, index) => {
        const angle = (index - 1) * Math.PI / 3;
        const distance = 3;
        const x = Math.sin(angle) * distance;
        const z = Math.cos(angle) * distance;
        
        return (
          <group key={skill} position={[x, 1, z]}>
            <mesh castShadow>
              <boxGeometry args={[2, 1, 0.1]} />
              <meshStandardMaterial color="#222233" />
              
              <Text
                position={[0, 0, 0.06]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {skill}
              </Text>
            </mesh>
          </group>
        );
      })}
      
      {/* Circular platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial
          color="#333344"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
