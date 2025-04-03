import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Scene from "./components/3d/Scene";
import LoadingScreen from "./components/ui/LoadingScreen";
import NavControls from "./components/ui/NavControls";
import InfoPanel from "./components/ui/InfoPanel";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Define control keys for navigation
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "interact", keys: ["KeyE"] },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [showControls, setShowControls] = useState(true);
  const [infoPanelContent, setInfoPanelContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    // Initialize audio elements
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.6;
    
    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.7;
    
    // Set up audio in store
    useAudio.getState().setBackgroundMusic(bgMusic);
    useAudio.getState().setHitSound(hitSound);
    useAudio.getState().setSuccessSound(successSound);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // User needs to interact with the page first for audio to play (browser policy)
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section: string) => {
    // Play sound on section change
    useAudio.getState().playHit();
    setActiveSection(section);
  };

  const handleShowInfo = (title: string, content: string) => {
    useAudio.getState().playHit();
    setInfoPanelContent({ title, content });
  };

  const handleCloseInfo = () => {
    setInfoPanelContent(null);
  };

  const handleStartExploring = () => {
    // Try to play background music on user interaction
    const bgMusic = useAudio.getState().backgroundMusic;
    if (bgMusic) {
      bgMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
    
    // Toggle mute state to unmute sounds
    if (useAudio.getState().isMuted) {
      useAudio.getState().toggleMute();
    }
    
    useAudio.getState().playSuccess();
  };

  return (
    <div className="relative w-full h-full">
      {isLoading ? (
        <LoadingScreen onStart={handleStartExploring} />
      ) : (
        <>
          <KeyboardControls map={controls}>
            <Canvas
              shadows
              camera={{ position: [0, 2, 10], fov: 45 }}
              gl={{ 
                antialias: true,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#050505"]} />
              <fog attach="fog" args={["#050505", 10, 50]} />
              
              <Suspense fallback={null}>
                <Scene 
                  activeSection={activeSection} 
                  onShowInfo={handleShowInfo}
                />
              </Suspense>
            </Canvas>
          </KeyboardControls>
          
          {showControls && (
            <NavControls 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              onToggleControls={() => setShowControls(!showControls)}
            />
          )}
          
          {!showControls && (
            <button 
              className="fixed top-4 right-4 bg-black/50 text-white p-2 rounded-full z-50 hover:bg-black/70 transition-colors"
              onClick={() => setShowControls(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          )}
          
          {infoPanelContent && (
            <InfoPanel 
              title={infoPanelContent.title} 
              content={infoPanelContent.content} 
              onClose={handleCloseInfo}
            />
          )}
          
          <div className="fixed bottom-2 left-2 text-white/50 text-xs">
            Use W,A,S,D or Arrow Keys to move • SPACE to jump • E to interact
          </div>
        </>
      )}
    </div>
  );
}

export default App;
