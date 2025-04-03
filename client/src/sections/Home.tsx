import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface HomeProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function Home({ isActive, onShowInfo }: HomeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nameRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("home", {
      position: { x: 0, y: 3, z: 10 },
      lookAt: { x: 0, y: 1, z: 0 }
    });
  }, []);
  
  // Create particles for background effect
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const posArray = new Float32Array(particlesCount * 3);
  
  // Generate random positions for particles
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Handle section visibility
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (isActive) {
      // Make visible and animate in
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      });
      
      // Animate name text
      if (nameRef.current) {
        gsap.from(nameRef.current.position, {
          y: -5,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
        
        gsap.from(nameRef.current.scale, {
          x: 0, y: 0, z: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
      }
      
      // Animate title text
      if (titleRef.current) {
        gsap.from(titleRef.current.position, {
          y: 5,
          delay: 0.3,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
        
        gsap.from(titleRef.current.scale, {
          x: 0, y: 0, z: 0,
          delay: 0.3,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
      }
    } else {
      // Hide when not active
      gsap.to(groupRef.current.position, {
        y: -20,
        duration: 0.8,
        ease: "power2.in"
      });
    }
  }, [isActive]);
  
  // Interactive animations
  useFrame((state) => {
    if (!isActive) return;
    
    const t = state.clock.getElapsedTime();
    
    // Rotate particles slightly
    if (particlesRef.current) {
      particlesRef.current.rotation.x = t * 0.05;
      particlesRef.current.rotation.y = t * 0.03;
    }
    
    // Subtle floating animation for name
    if (nameRef.current) {
      nameRef.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.1;
    }
    
    // Subtle rotation for title
    if (titleRef.current) {
      titleRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, isActive ? 0 : -20, 0]}>
      {/* Name */}
      <group ref={nameRef} position={[0, 1.5, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={2}
          color="#ffffff"
          font="/fonts/inter.json"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#4488ff"
        >
          Abhijit Dengale
        </Text>
      </group>
      
      {/* Title */}
      <group ref={titleRef} position={[0, -1, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="#aaddff"
          font="/fonts/inter.json"
          anchorX="center"
          anchorY="middle"
        >
          AI-Powered Solutions | CEO at ZyraTech | Full Stack & ML Developer
        </Text>
      </group>
      
      {/* Interactive 3D elements */}
      <group position={[0, 0, -3]}>
        {/* Rotating cube for AI */}
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
          position={[-5, 0, 0]}
        >
          <mesh castShadow onClick={() => onShowInfo("AI Expertise", "Developing cutting-edge AI solutions that enhance business operations and user experiences")}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#4488ff" metalness={0.7} roughness={0.2} />
            <Text
              position={[0, 0, 0.8]}
              fontSize={0.5}
              color="#ffffff"
              font="/fonts/inter.json"
              anchorX="center"
              anchorY="middle"
            >
              AI
            </Text>
          </mesh>
        </Float>
        
        {/* Sphere for Full Stack */}
        <Float
          speed={1.5}
          rotationIntensity={0.4}
          floatIntensity={0.4}
          position={[0, 0, 0]}
        >
          <mesh castShadow onClick={() => onShowInfo("Full Stack Development", "Creating end-to-end solutions with modern frameworks and optimized performance")}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#44cc88" metalness={0.5} roughness={0.3} />
            <Text
              position={[0, 0, 1.1]}
              fontSize={0.4}
              color="#ffffff"
              font="/fonts/inter.json"
              anchorX="center"
              anchorY="middle"
            >
              Full Stack
            </Text>
          </mesh>
        </Float>
        
        {/* Octahedron for Leadership */}
        <Float
          speed={1.8}
          rotationIntensity={0.6}
          floatIntensity={0.6}
          position={[5, 0, 0]}
        >
          <mesh castShadow onClick={() => onShowInfo("Leadership", "Growing teams and driving innovation as the CEO of ZyraTech")}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#ff6644" metalness={0.6} roughness={0.2} />
            <Text
              position={[0, 0, 1.1]}
              fontSize={0.4}
              color="#ffffff"
              font="/fonts/inter.json"
              anchorX="center"
              anchorY="middle"
            >
              Leadership
            </Text>
          </mesh>
        </Float>
      </group>
      
      {/* Background particles */}
      <points ref={particlesRef}>
        <primitive object={particlesGeometry} />
        <pointsMaterial 
          size={0.05} 
          color="#ffffff" 
          sizeAttenuation={true} 
          transparent={true}
          alphaTest={0.5}
          opacity={0.8}
        />
      </points>
      
      {/* Ground plane with glow */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#112233"
          emissive="#112244"
          emissiveIntensity={0.5}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}