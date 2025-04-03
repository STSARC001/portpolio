import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface ProjectsProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

// Sample project data
const PROJECTS = [
  {
    id: "project1",
    title: "E-Commerce Platform",
    image: "/textures/asphalt.png", // Using available texture
    description: "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product search, cart management, and payment processing."
  },
  {
    id: "project2",
    title: "Portfolio Dashboard",
    image: "/textures/wood.jpg", // Using available texture
    description: "Interactive dashboard for financial portfolio analysis. Built with D3.js for data visualization and React for UI components. Includes real-time data updates and historical performance tracking."
  },
  {
    id: "project3",
    title: "Mobile Weather App",
    image: "/textures/sky.png", // Using available texture
    description: "Weather forecast application with location-based services. Developed with React Native for cross-platform compatibility. Features include 7-day forecasts, weather alerts, and customizable settings."
  }
];

export default function Projects({ isActive, onShowInfo }: ProjectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const carouselRef = useRef<THREE.Group>(null);
  
  // Load textures
  const textures = {
    project1: useTexture("/textures/asphalt.png"),
    project2: useTexture("/textures/wood.jpg"),
    project3: useTexture("/textures/sky.png")
  };
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("projects", {
      position: { x: 10, y: 3, z: 5 },
      lookAt: { x: 10, y: 1, z: -5 }
    });
    
    // Register interactive objects for each project
    PROJECTS.forEach((project, index) => {
      const angle = (index - 1) * (2 * Math.PI / PROJECTS.length);
      const radius = 3;
      const x = 10 + Math.sin(angle) * radius;
      const z = -5 + Math.cos(angle) * radius;
      
      usePortfolio.getState().registerInteractiveObject({
        id: project.id,
        position: { x, y: 1, z },
        radius: 2,
        title: project.title,
        content: project.description
      });
    });
  }, []);
  
  // Handle section visibility
  useEffect(() => {
    if (!groupRef.current || !carouselRef.current) return;
    
    if (isActive) {
      // Make visible and animate in
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 1,
        ease: "power2.out"
      });
      
      // Animate carousel
      gsap.to(carouselRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.inOut"
      });
    } else {
      // Hide when not active
      gsap.to(groupRef.current.position, {
        y: -10,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [isActive]);
  
  // Carousel rotation
  useFrame((state) => {
    if (!carouselRef.current || !isActive) return;
    
    const t = state.clock.getElapsedTime();
    carouselRef.current.rotation.y = t * 0.1;
  });

  return (
    <group ref={groupRef} position={[10, -10, -5]}>
      {/* Projects Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Projects
      </Text>
      
      {/* Projects Carousel */}
      <group ref={carouselRef}>
        {PROJECTS.map((project, index) => {
          const angle = (index - 1) * (2 * Math.PI / PROJECTS.length);
          const radius = 3;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          
          return (
            <group key={project.id} position={[x, 1, z]} rotation={[0, -angle, 0]}>
              <mesh
                castShadow
                onClick={() => onShowInfo(project.title, project.description)}
              >
                <boxGeometry args={[2, 1.5, 0.1]} />
                <meshStandardMaterial color="#222233" />
                
                {/* Project image */}
                <mesh position={[0, 0.2, 0.06]}>
                  <planeGeometry args={[1.8, 1]} />
                  <meshStandardMaterial 
                    map={textures[project.id as keyof typeof textures]} 
                    color="#ffffff"
                  />
                </mesh>
                
                {/* Project title */}
                <Text
                  position={[0, -0.5, 0.06]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={1.8}
                >
                  {project.title}
                </Text>
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Central display stand */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 1, 0.2, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.5} roughness={0.5} />
      </mesh>
      
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
