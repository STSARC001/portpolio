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
import PhysicsProvider from "./PhysicsProvider";
import InteractiveObject from "./InteractiveObject";
import { usePortfolio } from "../../lib/stores/usePortfolio";
import { useAudio } from "../../lib/stores/useAudio";

// Import all sections
import Home from "../../sections/Home";
import About from "../../sections/About";
import Projects from "../../sections/Projects";
import Skills from "../../sections/Skills";
import Contact from "../../sections/Contact";
import Experience from "../../sections/Experience";
import Education from "../../sections/Education";
import Gallery from "../../sections/Gallery";
import Blog from "../../sections/Blog";

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

  // Set up audio elements
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Background music
        const bgMusic = new Audio('/sounds/background.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        // Effect sounds
        const hitSound = new Audio('/sounds/hit.mp3');
        hitSound.volume = 0.5;
        
        const successSound = new Audio('/sounds/success.mp3');
        successSound.volume = 0.7;
        
        // Set to store
        useAudio.getState().setBackgroundMusic(bgMusic);
        useAudio.getState().setHitSound(hitSound);
        useAudio.getState().setSuccessSound(successSound);
        
        // Start background music
        bgMusic.play().catch(err => {
          console.error('Failed to play background music:', err);
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };
    
    setupAudio();
    
    return () => {
      // Clean up audio on unmount
      const { backgroundMusic } = useAudio.getState();
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      {/* Wrap scene in physics */}
      <PhysicsProvider debug={false}>
        {/* Environment lighting handled by EnvironmentSetup component */}
        <EnvironmentSetup />
      
        {/* Interactive physics objects */}
        <group position={[0, 0, -10]}>
          {/* Interactive objects for demonstration */}
          <InteractiveObject 
            position={[-3, 3, 0]} 
            shape="box" 
            color="#ff5500" 
            size={1} 
            onClick={() => onShowInfo("Physics Demo", "This is a physics-enabled box. Click to apply force and interact!")}
          />
          <InteractiveObject 
            position={[0, 5, 0]} 
            shape="sphere" 
            color="#5555ff" 
            size={1.2} 
            onClick={() => onShowInfo("Physics Demo", "This is a physics-enabled sphere. Objects react to gravity and collisions!")}
          />
          <InteractiveObject 
            position={[3, 4, 0]} 
            shape="cylinder" 
            color="#55ff55" 
            size={[0.8, 2, 0.8]} 
            onClick={() => onShowInfo("Physics Demo", "This is a physics-enabled cylinder. Try clicking on different objects!")}
          />
        </group>
        
        {/* Custom Components */}
        <Camera activeSection={activeSection} />
        <Controls />
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
      </PhysicsProvider>
      
      {/* Objects outside physics */}
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
    </>
  );
}
