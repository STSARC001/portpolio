import { create } from 'zustand';

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameState>()(
  (set) => ({
    phase: "ready",
    
    start: () => set({ phase: "playing" }),
    restart: () => set({ phase: "ready" }),
    end: () => set({ phase: "ended" }),
  })
);