import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function InfoPanel({ title, content, onClose }: InfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 max-w-md w-full bg-black/80 rounded-lg overflow-hidden shadow-xl backdrop-blur-md z-50 transition-all duration-300",
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
      )}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div className="p-4 text-gray-300">
        <p>{content}</p>
      </div>
      
      <div className="p-3 bg-gray-900/50 flex justify-end">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
