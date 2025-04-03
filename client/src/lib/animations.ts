import { gsap } from "gsap";
import * as THREE from "three";

// Camera animations
export const animateCamera = (
  camera: THREE.Camera,
  target: { position: THREE.Vector3 | { x: number; y: number; z: number }, lookAt: THREE.Vector3 | { x: number; y: number; z: number } },
  duration: number = 2
) => {
  const position = target.position instanceof THREE.Vector3 
    ? target.position 
    : new THREE.Vector3(target.position.x, target.position.y, target.position.z);
  
  const lookAt = target.lookAt instanceof THREE.Vector3 
    ? target.lookAt 
    : new THREE.Vector3(target.lookAt.x, target.lookAt.y, target.lookAt.z);
  
  // Animate camera position
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration,
    ease: "power2.inOut"
  });
  
  // Create temporary object for lookAt animation
  const lookAtObj = { x: lookAt.x, y: lookAt.y, z: lookAt.z };
  
  // Animate lookAt
  gsap.to(lookAtObj, {
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(lookAtObj.x, lookAtObj.y, lookAtObj.z);
    }
  });
};

// Object animations
export const pulseAnimation = (
  object: THREE.Object3D,
  scale: number = 1.2,
  duration: number = 0.5
) => {
  gsap.to(object.scale, {
    x: scale,
    y: scale,
    z: scale,
    duration,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  });
};

export const rotateObject = (
  object: THREE.Object3D,
  rotations: number = 1,
  duration: number = 1
) => {
  gsap.to(object.rotation, {
    y: object.rotation.y + Math.PI * 2 * rotations,
    duration,
    ease: "power2.inOut"
  });
};

export const floatAnimation = (
  object: THREE.Object3D,
  amplitude: number = 0.5,
  duration: number = 2
) => {
  const startY = object.position.y;
  
  gsap.to(object.position, {
    y: startY + amplitude,
    duration,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });
};

// Material animations
export const glowAnimation = (
  material: THREE.Material & { emissiveIntensity?: number },
  maxIntensity: number = 2,
  duration: number = 1
) => {
  if ('emissiveIntensity' in material) {
    const startIntensity = material.emissiveIntensity || 0;
    
    gsap.to(material, {
      emissiveIntensity: maxIntensity,
      duration,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
      onComplete: () => {
        material.emissiveIntensity = startIntensity;
      }
    });
  }
};

// UI animations
export const fadeIn = (
  element: HTMLElement,
  duration: number = 0.5,
  delay: number = 0
) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
  );
};

export const fadeOut = (
  element: HTMLElement,
  duration: number = 0.5,
  onComplete?: () => void
) => {
  gsap.to(element, {
    opacity: 0,
    y: 20,
    duration,
    ease: "power2.in",
    onComplete
  });
};
