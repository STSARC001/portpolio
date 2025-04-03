import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onStart: () => void;
}

export default function LoadingScreen({ onStart }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + (100 - prev) / 10;
        
        if (nextProgress > 99) {
          clearInterval(interval);
          setTimeout(() => {
            setIsReady(true);
          }, 500);
          return 100;
        }
        
        return nextProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

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
      
      {!isReady ? (
        <div className="w-64 bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="bg-cyan-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <button
          onClick={onStart}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-colors mt-4 flex items-center space-x-2"
        >
          <span>Start Exploring</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
        </button>
      )}
      
      <div className={cn(
        "grid grid-cols-3 gap-8 mt-12 max-w-3xl opacity-0 transition-opacity duration-700",
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
      
      <div className="fixed bottom-4 text-gray-500 text-sm">
        Press ESC to exit fullscreen • Best experienced with headphones
      </div>
    </div>
  );
}
