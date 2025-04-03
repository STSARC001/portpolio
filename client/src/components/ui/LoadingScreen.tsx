import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/stores/useAudio";

interface LoadingScreenProps {
  onStart: () => void;
  errorMsg?: string | null;
}

export default function LoadingScreen({ onStart, errorMsg = null }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasAttemptedToStart, setHasAttemptedToStart] = useState(false);
  const [soundOption, setSoundOption] = useState<"with-sound" | "no-sound">("with-sound");
  
  // Reset the loading state if we get an error
  useEffect(() => {
    if (errorMsg) {
      setProgress(100);
      setIsReady(true);
    }
  }, [errorMsg]);
  
  // Simulate loading progress
  useEffect(() => {
    console.log("LoadingScreen mounted");
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + (100 - prev) / 10;
        
        if (nextProgress > 99) {
          clearInterval(interval);
          console.log("Loading complete");
          setTimeout(() => {
            setIsReady(true);
          }, 500);
          return 100;
        }
        
        return nextProgress;
      });
    }, 200);
    
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error("WebGL not supported");
      clearInterval(interval);
      setProgress(100);
      setIsReady(true);
    }
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStart = () => {
    console.log("Start button clicked with sound option:", soundOption);
    setHasAttemptedToStart(true);
    
    // If user chose no sound, mute audio
    if (soundOption === "no-sound") {
      useAudio.getState().toggleMute();
    }
    
    onStart();
  };
  
  const forceRestart = () => {
    console.log("Force restart requested");
    window.location.reload();
  };
  
  const toggleSoundOption = () => {
    setSoundOption(prev => prev === "with-sound" ? "no-sound" : "with-sound");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="text-cyan-400">3D</span> Developer Portfolio
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Interactive showcase of development skills in an immersive 3D environment
        </p>
      </div>
      
      {/* Error message if present */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-900/70 rounded-lg text-white max-w-md text-center">
          <h3 className="font-bold mb-2">Error Loading</h3>
          <p className="text-sm mb-3">{errorMsg}</p>
          <p className="text-xs mb-2">This may be due to WebGL compatibility issues or low device memory.</p>
        </div>
      )}
      
      {!isReady ? (
        <div className="w-64 bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="bg-cyan-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {/* Sound toggle */}
          <div className="flex items-center justify-center space-x-6 mb-2">
            <button
              onClick={toggleSoundOption}
              className={cn(
                "px-5 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 text-sm",
                soundOption === "with-sound" 
                  ? "bg-cyan-600 text-white" 
                  : "bg-gray-700 text-gray-300"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              <span>With Sound</span>
            </button>
            
            <button
              onClick={toggleSoundOption}
              className={cn(
                "px-5 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 text-sm",
                soundOption === "no-sound" 
                  ? "bg-cyan-600 text-white" 
                  : "bg-gray-700 text-gray-300"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              <span>No Sound</span>
            </button>
          </div>
          
          {/* Start button */}
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-colors flex items-center space-x-2"
          >
            <span>Start Exploring</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
          </button>
          
          {/* Restart button if needed */}
          {(errorMsg || hasAttemptedToStart) && (
            <button
              onClick={forceRestart}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors flex items-center space-x-2 text-sm"
            >
              <span>Restart Application</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
      )}
      
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 max-w-3xl opacity-0 transition-opacity duration-700",
        isReady && "opacity-100"
      )}>
        {[
          { icon: "💻", title: "Interactive 3D", description: "Explore a fully interactive 3D environment" },
          { icon: "🔍", title: "Project Showcase", description: "View detailed project information in 3D space" },
          { icon: "🎮", title: "Intuitive Controls", description: "Move around with WASD or arrow keys" }
        ].map((feature, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-gray-900 bg-opacity-50">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="text-white font-medium">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-4 text-gray-500 text-sm text-center">
        <p>Press ESC to exit fullscreen • Best experienced with headphones</p>
        <p className="mt-1 text-xs">If the 3D environment doesn't load, try using Chrome or Edge browser</p>
      </div>
    </div>
  );
}
