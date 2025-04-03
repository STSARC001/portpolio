import { Suspense, useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Scene from "./components/3d/Scene";
import LoadingScreen from "./components/ui/LoadingScreen";
import NavControls from "./components/ui/NavControls";
import InfoPanel from "./components/ui/InfoPanel";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Error boundary component to catch Three.js errors
interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Canvas error caught by boundary:", error, errorInfo);
    this.props.onError(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null; // Render nothing, let parent component handle error display
    }
    return this.props.children;
  }
}

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
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    console.log("App component mounted - initializing...");
    // Debug info - displayed on screen for debugging
    window.onerror = function(message, source, lineno, colno, error) {
      const errorInfo = `ERROR: ${message}\nSource: ${source}\nLine: ${lineno}:${colno}\n${error?.stack || "No stack trace"}`;
      console.error(errorInfo);
      setDebugInfo(errorInfo);
      return true; // Prevents the browser from showing its own error dialog
    };
    
    try {
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
      
      console.log("Audio setup complete");
    } catch (error) {
      console.error("Error setting up audio:", error);
      setLoadingError("Error loading audio resources");
    }
    
    // Simulate loading time
    const timer = setTimeout(() => {
      console.log("Loading complete, displaying 3D environment");
      setIsLoading(false);
      // User needs to interact with the page first for audio to play (browser policy)
    }, 4000);
    
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
      {isLoading || canvasError ? (
        <LoadingScreen 
          onStart={handleStartExploring} 
          errorMsg={canvasError || loadingError}
        />
      ) : (
        <>
          <KeyboardControls map={controls}>
            <ErrorBoundary onError={(error) => {
              console.error("Three.js render error:", error);
              setCanvasError("Failed to render 3D environment. Please try a different browser or device.");
            }}>
              <Canvas
                shadows
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{ 
                  antialias: true,
                  powerPreference: "default",
                  alpha: false,
                  stencil: false,
                  depth: true,
                  preserveDrawingBuffer: true
                }}
                dpr={[1, 2]} // Control pixel ratio for better performance
                style={{ 
                  height: "100vh", 
                  width: "100vw",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 10 
                }}
                onCreated={({ gl }) => {
                  console.log("Canvas created successfully");
                  try {
                    // Force the renderer to be properly initialized
                    gl.setSize(window.innerWidth, window.innerHeight);
                    gl.setClearColor(0x050505);
                    
                    // Check if WebGL contexts are valid
                    const isContextLost = gl.getContext().isContextLost();
                    if (isContextLost) {
                      throw new Error("WebGL context lost");
                    }
                  } catch (error) {
                    console.error("WebGL initialization error:", error);
                    setCanvasError("Failed to initialize 3D rendering. This may be due to WebGL support issues.");
                  }
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
            </ErrorBoundary>
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
          
          {debugInfo && (
            <div className="fixed top-0 left-0 bg-black/80 text-red-500 p-4 z-50 w-full h-64 overflow-auto text-xs whitespace-pre-wrap font-mono">
              <h3 className="text-sm font-bold mb-2">DEBUG INFO:</h3>
              {debugInfo}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
