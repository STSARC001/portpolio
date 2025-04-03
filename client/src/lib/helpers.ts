import * as THREE from "three";

// Calculate distance between two 3D points
export const calculateDistance = (p1: THREE.Vector3 | { x: number, y: number, z: number }, p2: THREE.Vector3 | { x: number, y: number, z: number }): number => {
  const x1 = p1 instanceof THREE.Vector3 ? p1.x : p1.x;
  const y1 = p1 instanceof THREE.Vector3 ? p1.y : p1.y;
  const z1 = p1 instanceof THREE.Vector3 ? p1.z : p1.z;
  
  const x2 = p2 instanceof THREE.Vector3 ? p2.x : p2.x;
  const y2 = p2 instanceof THREE.Vector3 ? p2.y : p2.y;
  const z2 = p2 instanceof THREE.Vector3 ? p2.z : p2.z;
  
  return Math.sqrt(
    Math.pow(x2 - x1, 2) +
    Math.pow(y2 - y1, 2) +
    Math.pow(z2 - z1, 2)
  );
};

// Check if point is within radius of another point
export const isWithinRadius = (
  center: THREE.Vector3 | { x: number, y: number, z: number },
  point: THREE.Vector3 | { x: number, y: number, z: number },
  radius: number
): boolean => {
  return calculateDistance(center, point) <= radius;
};

// Generate random positions on a circle
export const getPointsOnCircle = (
  center: { x: number, y: number, z: number },
  radius: number,
  count: number,
  randomizeRadius: boolean = false
): Array<{ x: number, y: number, z: number }> => {
  const points = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const actualRadius = randomizeRadius ? radius * (0.5 + Math.random() * 0.5) : radius;
    
    points.push({
      x: center.x + Math.cos(angle) * actualRadius,
      y: center.y,
      z: center.z + Math.sin(angle) * actualRadius
    });
  }
  
  return points;
};

// Generate random positions in a sphere
export const getPointsInSphere = (
  center: { x: number, y: number, z: number },
  radius: number,
  count: number
): Array<{ x: number, y: number, z: number }> => {
  const points = [];
  
  for (let i = 0; i < count; i++) {
    // Random point in sphere using rejection sampling
    let x, y, z;
    do {
      x = (Math.random() * 2 - 1) * radius;
      y = (Math.random() * 2 - 1) * radius;
      z = (Math.random() * 2 - 1) * radius;
    } while (x*x + y*y + z*z > radius*radius);
    
    points.push({
      x: center.x + x,
      y: center.y + y,
      z: center.z + z
    });
  }
  
  return points;
};

// Lerp between two points
export const lerpPoints = (
  start: { x: number, y: number, z: number },
  end: { x: number, y: number, z: number },
  t: number
): { x: number, y: number, z: number } => {
  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t,
    z: start.z + (end.z - start.z) * t
  };
};

// Clamp a value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Format large numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Debounce function for limiting function calls
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Parse an rgba color string to a THREE.Color with opacity
export const parseRgba = (
  rgba: string
): { color: THREE.Color, opacity: number } => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
  
  if (!match) {
    return { color: new THREE.Color("#ffffff"), opacity: 1 };
  }
  
  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
  
  return {
    color: new THREE.Color(r, g, b),
    opacity: a
  };
};
