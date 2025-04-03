import { ReactNode } from 'react';
import { Physics } from '@react-three/cannon';

interface PhysicsProviderProps {
  children: ReactNode;
  gravity?: [number, number, number];
  debug?: boolean;
}

export default function PhysicsProvider({ 
  children, 
  gravity = [0, -9.8, 0], 
  debug = false 
}: PhysicsProviderProps) {
  return (
    <Physics
      gravity={gravity}
      defaultContactMaterial={{
        friction: 0.5,
        restitution: 0.3,
      }}
      allowSleep={true}
      iterations={8}
    >
      {children}
      {debug && (
        <axesHelper args={[5]} />
      )}
    </Physics>
  );
}