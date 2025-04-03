import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface ProjectShowcaseProps {
  activeSection: string;
  onShowInfo: (title: string, content: string) => void;
}

// Sample project data
const PROJECTS = [
  {
    id: "project1",
    title: "E-Commerce Platform",
    image: "/textures/asphalt.png", // Using an available texture for demo
    description: "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product search, cart management, and payment processing."
  },
  {
    id: "project2",
    title: "Portfolio Dashboard",
    image: "/textures/wood.jpg", // Using an available texture for demo
    description: "Interactive dashboard for financial portfolio analysis. Built with D3.js for data visualization and React for UI components. Includes real-time data updates and historical performance tracking."
  },
  {
    id: "project3",
    title: "Mobile Weather App",
    image: "/textures/sky.png", // Using an available texture for demo
    description: "Weather forecast application with location-based services. Developed with React Native for cross-platform compatibility. Features include 7-day forecasts, weather alerts, and customizable settings."
  }
];

export default function ProjectShowcase({ activeSection, onShowInfo }: ProjectShowcaseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const projectRefs = useRef<THREE.Mesh[]>([]);
  
  // Load textures
  const textures = {
    project1: useTexture("/textures/asphalt.png"),
    project2: useTexture("/textures/wood.jpg"),
    project3: useTexture("/textures/sky.png")
  };
  
  // Register camera target for projects section
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("projects", {
      position: { x: 0, y: 5, z: 5 },
      lookAt: { x: 0, y: 2, z: -15 }
    });
    
    // Register interactive objects
    PROJECTS.forEach((project, index) => {
      const angle = (index - 1) * Math.PI / 4;
      const x = Math.sin(angle) * 8;
      const z = -15 + Math.cos(angle) * 4;
      
      usePortfolio.getState().registerInteractiveObject({
        id: project.id,
        position: { x, y: 2, z },
        radius: 3,
        title: project.title,
        content: project.description
      });
    });
  }, []);
  
  // Handle section visibility
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (activeSection === "projects") {
      // Make visible and animate in
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 1,
        ease: "power2.out"
      });
      
      // Animate each project
      projectRefs.current.forEach((mesh, i) => {
        gsap.to(mesh.position, {
          y: 2,
          duration: 0.8,
          delay: 0.2 * i,
          ease: "back.out(1.7)"
        });
        
        gsap.to(mesh.rotation, {
          y: mesh.rotation.y + Math.PI * 2,
          duration: 1.5,
          delay: 0.2 * i,
          ease: "power2.inOut"
        });
      });
    } else {
      // Hide when not active
      gsap.to(groupRef.current.position, {
        y: -10,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [activeSection]);
  
  // Interactive rotation animation
  useFrame((state) => {
    if (!groupRef.current || activeSection !== "projects") return;
    
    const t = state.clock.getElapsedTime();
    
    // Rotate the entire showcase slowly
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    // Animate each project
    projectRefs.current.forEach((mesh, i) => {
      mesh.rotation.y += 0.005;
      mesh.position.y = 2 + Math.sin(t * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef} position={[0, -10, -15]}>
      {/* Title */}
      <Text
        position={[0, 6, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Projects
      </Text>
      
      {/* Projects display */}
      {PROJECTS.map((project, index) => {
        // Calculate position in semi-circle arrangement
        const angle = (index - 1) * Math.PI / 4;
        const x = Math.sin(angle) * 8;
        const z = Math.cos(angle) * 4;
        
        return (
          <group key={project.id} position={[x, 0, z]}>
            {/* Project Card */}
            <mesh
              ref={(el) => {
                if (el) projectRefs.current[index] = el;
              }}
              position={[0, -5, 0]} // Start below and animate up
              castShadow
              onClick={() => onShowInfo(project.title, project.description)}
            >
              <boxGeometry args={[4, 3, 0.2]} />
              <meshStandardMaterial color="#222222" />
              
              {/* Project Image */}
              <mesh position={[0, 0.5, 0.11]}>
                <planeGeometry args={[3.6, 1.8]} />
                <meshStandardMaterial 
                  map={textures[project.id as keyof typeof textures]} 
                  color="#ffffff"
                />
              </mesh>
              
              {/* Project Title */}
              <Text
                position={[0, -1, 0.11]}
                fontSize={0.25}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
              >
                {project.title}
              </Text>
              
              {/* Interaction hint */}
              <Text
                position={[0, -1.4, 0.11]}
                fontSize={0.15}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
              >
                Click for details
              </Text>
            </mesh>
          </group>
        );
      })}
      
      {/* Circular platform for projects */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial 
          color="#333333"
          roughness={0.8}
          metalness={0.2}
        />
        
        {/* Decorative rings */}
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[8, 8.1, 64]} />
          <meshBasicMaterial color="#44aaff" />
        </mesh>
        
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[10, 10.1, 64]} />
          <meshBasicMaterial color="#44aaff" />
        </mesh>
      </mesh>
    </group>
  );
}
