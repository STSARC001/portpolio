import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface DevObjectsProps {
  activeSection: string;
  onShowInfo: (title: string, content: string) => void;
}

export default function DevObjects({ activeSection, onShowInfo }: DevObjectsProps) {
  // Initialize refs
  const groupRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Mesh>(null);
  const codeBlockRef = useRef<THREE.Mesh>(null);
  const serverRef = useRef<THREE.Mesh>(null);
  
  // Textures
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Register interactive objects in the portfolio store
  usePortfolio.getState().registerInteractiveObject({
    id: "laptop",
    position: { x: -5, y: 1, z: -7 },
    radius: 2,
    title: "Frontend Development",
    content: "Specializing in modern frontend frameworks like React, Vue.js, and Angular. Building responsive UIs with clean, maintainable code."
  });
  
  usePortfolio.getState().registerInteractiveObject({
    id: "server",
    position: { x: 5, y: 1, z: -7 },
    radius: 2,
    title: "Backend Development",
    content: "Creating robust backend systems with Node.js, Express, Python/Django, and database expertise in SQL and NoSQL solutions."
  });
  
  usePortfolio.getState().registerInteractiveObject({
    id: "codeBlock",
    position: { x: 0, y: 1, z: -10 },
    radius: 2,
    title: "Full Stack Development",
    content: "Integrating frontend and backend technologies to deliver complete web applications with optimal performance and user experience."
  });
  
  // Set up interactions handler
  useEffect(() => {
    usePortfolio.getState().setInteractionCallback((object) => {
      onShowInfo(object.title, object.content);
      
      // Animate the object when interacted with
      if (object.id === "laptop" && laptopRef.current) {
        gsap.to(laptopRef.current.rotation, {
          y: laptopRef.current.rotation.y + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut"
        });
      } else if (object.id === "server" && serverRef.current) {
        gsap.to(serverRef.current.position, {
          y: serverRef.current.position.y + 0.5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      } else if (object.id === "codeBlock" && codeBlockRef.current) {
        gsap.to(codeBlockRef.current.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "elastic.out(1, 0.3)"
        });
      }
    });
  }, [onShowInfo]);
  
  // Register camera targets
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("about", {
      position: { x: -5, y: 3, z: 0 },
      lookAt: { x: -5, y: 1, z: -7 }
    });
    
    usePortfolio.getState().setCameraTarget("skills", {
      position: { x: 5, y: 3, z: 0 },
      lookAt: { x: 5, y: 1, z: -7 }
    });
    
    usePortfolio.getState().setCameraTarget("home", {
      position: { x: 0, y: 3, z: 5 },
      lookAt: { x: 0, y: 1, z: -5 }
    });
  }, []);
  
  // Create floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (laptopRef.current) {
      laptopRef.current.position.y = 1 + Math.sin(t * 0.5) * 0.1;
      laptopRef.current.rotation.y = t * 0.2;
    }
    
    if (serverRef.current) {
      serverRef.current.position.y = 1 + Math.cos(t * 0.5) * 0.1;
    }
    
    if (codeBlockRef.current) {
      codeBlockRef.current.rotation.y = t * 0.1;
      codeBlockRef.current.position.y = 1 + Math.sin(t * 0.3) * 0.1;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
    }
  });
  
  // Generate random code platforms using useMemo (avoid direct Math.random in JSX)
  const codePlatforms = useMemo(() => {
    const platforms = [];
    const count = 20;
    
    for (let i = 0; i < count; i++) {
      platforms.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          0.05,
          (Math.random() - 0.5) * 40
        ),
        rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
        scale: new THREE.Vector3(
          2 + Math.random() * 3,
          0.1,
          2 + Math.random() * 3
        )
      });
    }
    
    return platforms;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Laptop - Frontend */}
      <group position={[-5, 1, -7]}>
        <mesh 
          ref={laptopRef}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#333333" />
          
          {/* Screen */}
          <mesh position={[0, 0.55, -0.4]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[1.8, 1, 0.1]} />
            <meshStandardMaterial color="#222222" />
            
            {/* Screen content */}
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[1.7, 0.9]} />
              <meshBasicMaterial color="#4488ff" />
              
              <Text
                position={[0, 0, 0.01]}
                fontSize={0.1}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {`<Frontend />`}
              </Text>
            </mesh>
          </mesh>
          
          {/* Keyboard */}
          <mesh position={[0, 0.05, 0.3]}>
            <boxGeometry args={[1.8, 0.05, 0.8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          React
        </Text>
      </group>
      
      {/* Server - Backend */}
      <group position={[5, 1, -7]}>
        <mesh 
          ref={serverRef}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[1.5, 2, 1]} />
          <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.2} />
          
          {/* Server details */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[0, 0.4 - i * 0.3, 0.51]} castShadow>
              <boxGeometry args={[1.3, 0.15, 0.05]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#222222" : "#333333"} />
              
              {/* LEDs */}
              <mesh position={[0.4, 0, 0.03]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={i % 2 === 0 ? "#22ff22" : "#ff2222"} />
              </mesh>
            </mesh>
          ))}
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Node.js
        </Text>
      </group>
      
      {/* Code Block - Full Stack */}
      <group position={[0, 1, -10]}>
        <mesh 
          ref={codeBlockRef}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial color="#222222" />
          
          {/* Code lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[0, 0.7 - i * 0.25, 0.11]} castShadow>
              <boxGeometry args={[2 + (i % 3) * 0.3, 0.1, 0.02]} />
              <meshBasicMaterial 
                color={['#ff8866', '#66aaff', '#66ffaa'][i % 3]} 
                opacity={0.8} 
                transparent
              />
            </mesh>
          ))}
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Full Stack
        </Text>
      </group>
      
      {/* Floating code platforms */}
      {codePlatforms.map((platform, index) => (
        <mesh 
          key={index} 
          position={platform.position} 
          rotation={platform.rotation} 
          scale={platform.scale}
          receiveShadow
        >
          <boxGeometry />
          <meshStandardMaterial 
            map={woodTexture} 
            color="#aaaaaa" 
            roughness={0.7}
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}
      
      {/* Central platform */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 50]} />
        <meshStandardMaterial
          color="#151515"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
