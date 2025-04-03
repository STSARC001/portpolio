import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Environment, 
  Preload, 
  OrbitControls,
  useTexture,
  Sky,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import Camera from "./Camera";
import Controls from "./Controls";
import DevObjects from "./DevObjects";
import EnvironmentSetup from "./EnvironmentSetup";
import ProjectShowcase from "./ProjectShowcase";
import { usePortfolio } from "@/lib/stores/usePortfolio";

// Import all sections
import Home from "@/sections/Home";
import About from "@/sections/About";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";
import Experience from "@/sections/Experience";
import Education from "@/sections/Education";
import Gallery from "@/sections/Gallery";
import Blog from "@/sections/Blog";

interface SceneProps {
  activeSection: string;
  onShowInfo: (title: string, content: string) => void;
}

export default function Scene({ activeSection, onShowInfo }: SceneProps) {
  const { gl, camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const cameraTargets = usePortfolio(state => state.cameraTargets);
  
  // Set up textures
  const terrainTexture = useTexture("/textures/grass.png");
  terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(50, 50);
  
  // Handle section changes with camera animation
  useEffect(() => {
    if (activeSection in cameraTargets) {
      const target = cameraTargets[activeSection];
      
      // Animate camera position
      gsap.to(camera.position, {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
        duration: 2,
        ease: "power2.inOut"
      });
      
      // Animate camera lookAt
      gsap.to(orbitControlsRef.current.target, {
        x: target.lookAt.x,
        y: target.lookAt.y,
        z: target.lookAt.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          orbitControlsRef.current.update();
        }
      });
    }
  }, [activeSection, camera, cameraTargets]);
  
  // Optimize rendering
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    return () => {
      // Clean up
      gl.dispose();
    };
  }, [gl]);
  
  // Custom render loop
  useFrame((state, delta) => {
    // Update any animations or continuous movements here
  });

  return (
    <>
      {/* Environment */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={terrainTexture} 
          color="#88aa88" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Skybox */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.3}
        azimuth={0.25}
        rayleigh={0.5}
      />
      
      {/* Custom Components */}
      <Camera activeSection={activeSection} />
      <Controls />
      <EnvironmentSetup />
      <DevObjects activeSection={activeSection} onShowInfo={onShowInfo} />
      
      {/* All sections */}
      <Home isActive={activeSection === "home"} onShowInfo={onShowInfo} />
      <ProjectShowcase activeSection={activeSection} onShowInfo={onShowInfo} />
      <About isActive={activeSection === "about"} onShowInfo={onShowInfo} />
      <Skills isActive={activeSection === "skills"} onShowInfo={onShowInfo} />
      <Contact isActive={activeSection === "contact"} onShowInfo={onShowInfo} />
      <Experience isActive={activeSection === "experience"} onShowInfo={onShowInfo} />
      <Education isActive={activeSection === "education"} onShowInfo={onShowInfo} />
      <Gallery isActive={activeSection === "gallery"} onShowInfo={onShowInfo} />
      <Blog isActive={activeSection === "blog"} onShowInfo={onShowInfo} />
      
      {/* Stars for enhanced 3D environment */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={1}
      />
      
      {/* Orbit Controls */}
      <OrbitControls 
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 - 0.1}
        dampingFactor={0.1}
        enabled={false} // Disable direct user interaction - controlled by navigation
      />
      
      {/* Preload assets */}
      <Preload all />
      <Environment preset="city" />
    </>
  );
}
