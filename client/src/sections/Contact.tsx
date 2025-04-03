import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface ContactProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

// Contact links data
const CONTACT_LINKS = [
  { 
    id: "email", 
    label: "Email", 
    icon: "✉️", 
    link: "mailto:your.email@example.com",
    description: "Reach out via email at your.email@example.com for project inquiries or collaborations."
  },
  { 
    id: "github", 
    label: "GitHub", 
    icon: "🐙", 
    link: "https://github.com/yourusername",
    description: "Check out my open-source projects and contributions on GitHub."
  },
  { 
    id: "linkedin", 
    label: "LinkedIn", 
    icon: "🔗", 
    link: "https://linkedin.com/in/yourusername",
    description: "Connect with me professionally on LinkedIn to discuss opportunities."
  },
  { 
    id: "twitter", 
    label: "Twitter", 
    icon: "🐦", 
    link: "https://twitter.com/yourusername",
    description: "Follow me on Twitter for updates on my latest projects and tech insights."
  }
];

export default function Contact({ isActive, onShowInfo }: ContactProps) {
  const groupRef = useRef<THREE.Group>(null);
  const contactRefs = useRef<THREE.Mesh[]>([]);
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(5, 5);
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("contact", {
      position: { x: 0, y: 3, z: -5 },
      lookAt: { x: 0, y: 1, z: -15 }
    });
    
    // Register interactive objects
    CONTACT_LINKS.forEach((contact, index) => {
      const angle = (index - CONTACT_LINKS.length / 2 + 0.5) * (Math.PI / (CONTACT_LINKS.length - 1));
      const x = Math.sin(angle) * 5;
      const z = -15 + Math.cos(angle) * 2;
      
      usePortfolio.getState().registerInteractiveObject({
        id: contact.id,
        position: { x, y: 1, z },
        radius: 2,
        title: contact.label,
        content: contact.description
      });
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
      
      // Animate each contact
      contactRefs.current.forEach((mesh, i) => {
        gsap.to(mesh.position, {
          y: 1,
          duration: 0.8,
          delay: 0.1 * i,
          ease: "back.out(1.7)"
        });
        
        gsap.to(mesh.rotation, {
          y: mesh.rotation.y + Math.PI * 2,
          duration: 1,
          delay: 0.1 * i,
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
      
      // Reset positions
      contactRefs.current.forEach((mesh) => {
        gsap.to(mesh.position, {
          y: -2,
          duration: 0.3
        });
      });
    }
  }, [isActive]);
  
  // Animate contacts
  useFrame((state) => {
    if (!groupRef.current || !isActive) return;
    
    const t = state.clock.getElapsedTime();
    
    // Floating animation for contact items
    contactRefs.current.forEach((mesh, i) => {
      mesh.position.y = 1 + Math.sin(t * 0.5 + i * 0.3) * 0.2;
      mesh.rotation.y += 0.005;
    });
  });

  return (
    <group ref={groupRef} position={[0, -10, -15]}>
      {/* Contact Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Contact
      </Text>
      
      {/* Contact links */}
      {CONTACT_LINKS.map((contact, index) => {
        const angle = (index - CONTACT_LINKS.length / 2 + 0.5) * (Math.PI / (CONTACT_LINKS.length - 1));
        const x = Math.sin(angle) * 5;
        const z = Math.cos(angle) * 2;
        
        return (
          <group key={contact.id} position={[x, 0, z]}>
            <mesh
              ref={(el) => {
                if (el) contactRefs.current[index] = el;
              }}
              position={[0, -2, 0]} // Start below, will animate up
              castShadow
              onClick={() => onShowInfo(contact.label, contact.description)}
            >
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial 
                color="#333344"
                metalness={0.3}
                roughness={0.7}
              />
              
              {/* Icon */}
              <Text
                position={[0, 0, 0.76]}
                fontSize={0.6}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {contact.icon}
              </Text>
              
              {/* Label on all sides */}
              {[
                [0, 0, 0.76],   // front
                [0, 0, -0.76],  // back
                [0.76, 0, 0],   // right
                [-0.76, 0, 0]   // left
              ].map((pos, i) => (
                <Text
                  key={i}
                  position={pos}
                  rotation={[0, i === 0 ? 0 : i === 1 ? Math.PI : i === 2 ? Math.PI/2 : -Math.PI/2, 0]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {contact.label}
                </Text>
              ))}
            </mesh>
          </group>
        );
      })}
      
      {/* Ground platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial
          map={grassTexture}
          color="#447744"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
