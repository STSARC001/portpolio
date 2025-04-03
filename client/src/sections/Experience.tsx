import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { EXPERIENCE } from "@/lib/constants";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface ExperienceProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function Experience({ isActive, onShowInfo }: ExperienceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timelineRef = useRef<THREE.Group>(null);
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("experience", {
      position: { x: -10, y: 5, z: 5 },
      lookAt: { x: 0, y: 2, z: -10 }
    });
    
    // Register interactive objects
    EXPERIENCE.forEach((exp, index) => {
      usePortfolio.getState().registerInteractiveObject({
        id: `experience-${exp.id}`,
        position: { x: 0, y: 3 - index * 2, z: -10 },
        radius: 2,
        title: `${exp.title} at ${exp.company}`,
        content: `${exp.description} (${exp.duration})\n\nTechnologies: ${exp.technologies.join(", ")}`
      });
    });
  }, []);
  
  // Animate on section activation
  useEffect(() => {
    if (isActive && timelineRef.current) {
      // Animate timeline items in sequence
      EXPERIENCE.forEach((_, index) => {
        const item = timelineRef.current?.children[index];
        if (item) {
          gsap.fromTo(
            item.position,
            { x: -10, opacity: 0 },
            { 
              x: 0, 
              opacity: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "back.out(1.7)"
            }
          );
          
          gsap.fromTo(
            item.scale,
            { x: 0.5, y: 0.5, z: 0.5 },
            {
              x: 1, y: 1, z: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "back.out(1.7)"
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
    
    // Animate individual timeline items
    if (timelineRef.current && isActive) {
      EXPERIENCE.forEach((_, index) => {
        const item = timelineRef.current?.children[index];
        if (item) {
          item.position.y = 3 - index * 2 + Math.sin(t * 0.5 + index * 1.5) * 0.1;
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
          position={[0, 7, -10]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Experience
        </Text>
      </Float>
      
      {/* Timeline line */}
      <mesh position={[0, 3, -10]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Experience timeline items */}
      <group ref={timelineRef}>
        {EXPERIENCE.map((exp, index) => (
          <group 
            key={exp.id} 
            position={[0, 3 - index * 2, -10]}
            onClick={() => onShowInfo(`${exp.title} at ${exp.company}`, `${exp.description} (${exp.duration})\n\nTechnologies: ${exp.technologies.join(", ")}`)}
          >
            {/* Timeline node */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={exp.color} />
            </mesh>
            
            {/* Experience card */}
            <group position={[2, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[4, 1.2, 0.1]} />
                <MeshTransmissionMaterial
                  backside
                  samples={4}
                  thickness={0.5}
                  roughness={0.05}
                  clearcoat={0.1}
                  clearcoatRoughness={0.1}
                  transmission={0.95}
                  reflectivity={0.2}
                  distortion={0.2}
                  distortionScale={0.5}
                  temporalDistortion={0.1}
                  ior={1.5}
                  color={exp.color}
                />
              </mesh>
              
              {/* Job title */}
              <Text
                position={[0, 0.3, 0.1]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
              >
                {exp.title}
              </Text>
              
              {/* Company and duration */}
              <Text
                position={[0, 0, 0.1]}
                fontSize={0.18}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
              >
                {exp.company} | {exp.duration}
              </Text>
              
              {/* Technologies */}
              <Text
                position={[0, -0.3, 0.1]}
                fontSize={0.15}
                color="rgba(255,255,255,0.7)"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
              >
                {exp.technologies.join(" • ")}
              </Text>
            </group>
          </group>
        ))}
      </group>
      
      {/* Interactive prompt */}
      <Text
        position={[0, -2, -8]}
        fontSize={0.2}
        color="rgba(255,255,255,0.6)"
        anchorX="center"
        anchorY="middle"
      >
        Click on experience cards or press E when near to view details
      </Text>
    </group>
  );
}