import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface SkillsProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

// Skill data
const SKILLS = [
  {
    id: "frontend",
    title: "Frontend",
    items: ["React", "Vue.js", "Angular", "CSS/SASS", "TypeScript"],
    description: "Building intuitive user interfaces and responsive web applications with modern JavaScript frameworks and tools."
  },
  {
    id: "backend",
    title: "Backend",
    items: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"],
    description: "Developing robust server-side applications with focus on scalability, security, and performance."
  },
  {
    id: "devops",
    title: "DevOps",
    items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure"],
    description: "Automating development workflows, deployment processes, and infrastructure management for efficient delivery."
  }
];

export default function Skills({ isActive, onShowInfo }: SkillsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const skillRefs = useRef<THREE.Mesh[]>([]);
  
  // Load texture
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("skills", {
      position: { x: 0, y: 3, z: 10 },
      lookAt: { x: 0, y: 1, z: 0 }
    });
    
    // Register interactive objects
    SKILLS.forEach((skill, index) => {
      const angle = (index - 1) * Math.PI / 2;
      const x = Math.sin(angle) * 5;
      const z = Math.cos(angle) * 5;
      
      usePortfolio.getState().registerInteractiveObject({
        id: skill.id,
        position: { x, y: 1, z },
        radius: 2,
        title: skill.title,
        content: skill.description
      });
    });
  }, []);
  
  // Generate random skill bubbles using useMemo
  const skillBubbles = useMemo(() => {
    const bubbles = [];
    
    SKILLS.forEach((skillCategory, categoryIndex) => {
      skillCategory.items.forEach((skill, skillIndex) => {
        const angle = (categoryIndex - 1) * (Math.PI / 1.5) + (skillIndex * 0.3);
        const radius = 2 + skillIndex * 0.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = 0.5 + skillIndex * 0.3;
        
        bubbles.push({
          categoryIndex,
          skillIndex,
          text: skill,
          position: [x, y, z],
          offset: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
          amplitude: 0.2 + Math.random() * 0.3
        });
      });
    });
    
    return bubbles;
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
      
      // Animate each skill category
      skillRefs.current.forEach((mesh, i) => {
        gsap.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          delay: 0.2 * i,
          ease: "back.out(1.7)"
        });
      });
    } else {
      // Hide when not active
      gsap.to(groupRef.current.position, {
        y: -10,
        duration: 0.5,
        ease: "power2.in"
      });
      
      // Reset scales
      skillRefs.current.forEach((mesh) => {
        gsap.to(mesh.scale, {
          x: 0.1, y: 0.1, z: 0.1,
          duration: 0.3
        });
      });
    }
  }, [isActive]);
  
  // Animate skills
  useFrame((state) => {
    if (!groupRef.current || !isActive) return;
    
    const t = state.clock.getElapsedTime();
    
    // Rotate group slightly
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    
    // Animate skill categories
    skillRefs.current.forEach((mesh, i) => {
      mesh.rotation.y = t * 0.2 + i * Math.PI / 3;
      mesh.position.y = 1 + Math.sin(t * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      {/* Skills Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Skills
      </Text>
      
      {/* Skill Categories */}
      {SKILLS.map((skill, index) => {
        const angle = (index - 1) * (2 * Math.PI / SKILLS.length);
        const x = Math.sin(angle) * 5;
        const z = Math.cos(angle) * 5;
        
        return (
          <group key={skill.id} position={[x, 1, z]}>
            <mesh
              ref={(el) => {
                if (el) skillRefs.current[index] = el;
              }}
              scale={[0.1, 0.1, 0.1]} // Start small, will animate to full size
              castShadow
              onClick={() => onShowInfo(skill.title, skill.description)}
            >
              <boxGeometry args={[2.5, 1.5, 0.2]} />
              <meshStandardMaterial 
                map={woodTexture}
                color="#333344" 
                roughness={0.7}
              />
              
              <Text
                position={[0, 0.4, 0.11]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {skill.title}
              </Text>
              
              <Text
                position={[0, 0, 0.11]}
                fontSize={0.15}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
              >
                {skill.items.slice(0, 3).join(" • ")}
              </Text>
              
              <Text
                position={[0, -0.3, 0.11]}
                fontSize={0.15}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
              >
                {skill.items.slice(3, 6).join(" • ")}
              </Text>
            </mesh>
          </group>
        );
      })}
      
      {/* Skill bubbles */}
      {skillBubbles.map((bubble, index) => (
        <mesh
          key={`bubble-${index}`}
          position={bubble.position}
          castShadow
        >
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color={["#4488ff", "#44aaff", "#44ddff"][bubble.categoryIndex % 3]} 
            transparent 
            opacity={0.7}
          />
          
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {bubble.text}
          </Text>
        </mesh>
      ))}
      
      {/* Central platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial
          color="#333344"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
