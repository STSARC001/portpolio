import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

// Define 3D coordinate type
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Define camera target type
interface CameraTarget {
  position: Vector3;
  lookAt: Vector3;
}

// Define interactive object type
interface InteractiveObject {
  id: string;
  position: Vector3;
  radius: number;
  title: string;
  content: string;
}

interface PortfolioState {
  // Player state
  playerPosition: Vector3;
  setPlayerPosition: (position: Vector3) => void;
  
  // Camera targets for each section
  cameraTargets: Record<string, CameraTarget>;
  setCameraTarget: (section: string, target: CameraTarget) => void;
  
  // Camera follow mode
  followPlayer: boolean;
  setFollowPlayer: (follow: boolean) => void;
  
  // Interactive objects
  interactiveObjects: InteractiveObject[];
  registerInteractiveObject: (object: InteractiveObject) => void;
  checkInteractions: (position: Vector3) => void;
  
  // Callback for interaction
  interactionCallback?: (object: InteractiveObject) => void;
  setInteractionCallback: (callback: (object: InteractiveObject) => void) => void;
}

export const usePortfolio = create<PortfolioState>()(
  subscribeWithSelector((set, get) => ({
    // Player state
    playerPosition: { x: 0, y: 0.5, z: 0 },
    setPlayerPosition: (position) => set({ playerPosition: position }),
    
    // Camera targets
    cameraTargets: {
      // Default targets with initial values
      home: {
        position: { x: 0, y: 3, z: 10 },
        lookAt: { x: 0, y: 1, z: 0 }
      }
    },
    setCameraTarget: (section, target) => set((state) => ({
      cameraTargets: {
        ...state.cameraTargets,
        [section]: target
      }
    })),
    
    // Camera follow mode
    followPlayer: false,
    setFollowPlayer: (follow) => set({ followPlayer: follow }),
    
    // Interactive objects
    interactiveObjects: [],
    registerInteractiveObject: (object) => set((state) => {
      // Only add if not already registered
      if (!state.interactiveObjects.find(obj => obj.id === object.id)) {
        return {
          interactiveObjects: [...state.interactiveObjects, object]
        };
      }
      return {};
    }),
    
    // Check for interactions with nearby objects
    checkInteractions: (position) => {
      const { interactiveObjects, interactionCallback } = get();
      
      if (!interactionCallback) return;
      
      // Find the closest object within interaction radius
      let closestObject: InteractiveObject | null = null;
      let closestDistance = Infinity;
      
      interactiveObjects.forEach(object => {
        const distance = Math.sqrt(
          Math.pow(position.x - object.position.x, 2) +
          Math.pow(position.y - object.position.y, 2) +
          Math.pow(position.z - object.position.z, 2)
        );
        
        if (distance < object.radius && distance < closestDistance) {
          closestObject = object;
          closestDistance = distance;
        }
      });
      
      // Trigger callback if an object is found
      if (closestObject) {
        interactionCallback(closestObject);
      }
    },
    
    // Interaction callback
    interactionCallback: undefined,
    setInteractionCallback: (callback) => set({ interactionCallback: callback })
  }))
);
