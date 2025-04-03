import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { BLOG_POSTS } from "@/lib/constants";
import { usePortfolio } from "@/lib/stores/usePortfolio";

interface BlogProps {
  isActive: boolean;
  onShowInfo: (title: string, content: string) => void;
}

export default function Blog({ isActive, onShowInfo }: BlogProps) {
  const groupRef = useRef<THREE.Group>(null);
  const postsRef = useRef<THREE.Group>(null);
  
  // Register camera target
  useEffect(() => {
    usePortfolio.getState().setCameraTarget("blog", {
      position: { x: 0, y: 4, z: 10 },
      lookAt: { x: 0, y: 2, z: 0 }
    });
    
    // Register interactive objects
    BLOG_POSTS.forEach((post, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      
      usePortfolio.getState().registerInteractiveObject({
        id: `blog-${post.id}`,
        position: { x: (col - 1) * 4, y: 2 - row * 2.5, z: 0 },
        radius: 2,
        title: post.title,
        content: `${post.date} - ${post.category}\n\n${post.excerpt}`
      });
    });
  }, []);
  
  // Animate on section activation
  useEffect(() => {
    if (isActive && postsRef.current) {
      // Reset positions first
      postsRef.current.children.forEach((post) => {
        gsap.set(post.position, { z: 20 });
        gsap.set(post.scale, { x: 0.1, y: 0.1, z: 0.1 });
      });
      
      // Animate blog posts in with staggered effect
      postsRef.current.children.forEach((post, index) => {
        gsap.to(post.position, {
          z: 0, 
          duration: 1,
          delay: index * 0.2,
          ease: "back.out(1.5)"
        });
        
        gsap.to(post.scale, {
          x: 1, y: 1, z: 1,
          duration: 1,
          delay: index * 0.2,
          ease: "back.out(1.5)"
        });
      });
    }
  }, [isActive]);
  
  // Continuous animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
    }
    
    // Animate individual blog posts
    if (postsRef.current && isActive) {
      postsRef.current.children.forEach((post, index) => {
        // Hover animation
        post.position.y += Math.sin(t * 0.5 + index) * 0.002;
        // Subtle rotation
        post.rotation.z = Math.sin(t * 0.3 + index * 1.5) * 0.02;
      });
    }
  });

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Section title */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          font="/fonts/inter.woff"
          position={[0, 6, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Blog
        </Text>
      </Float>
      
      {/* Blog posts grid */}
      <group ref={postsRef}>
        {BLOG_POSTS.map((post, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          
          return (
            <group 
              key={post.id} 
              position={[(col - 1) * 4, 2 - row * 2.5, 0]}
              onClick={() => onShowInfo(post.title, `${post.date} - ${post.category}\n\n${post.excerpt}`)}
            >
              {/* Blog post card */}
              <RoundedBox 
                args={[3, 2, 0.1]} 
                radius={0.1} 
                smoothness={4}
                castShadow
              >
                <meshStandardMaterial 
                  color={post.color} 
                  roughness={0.5} 
                  metalness={0.2}
                />
              </RoundedBox>
              
              {/* Category tag */}
              <RoundedBox
                position={[0, 0.8, 0.06]}
                args={[1.2, 0.3, 0.05]}
                radius={0.1}
                smoothness={4}
              >
                <meshStandardMaterial 
                  color="#ffffff" 
                  roughness={0.5}
                  opacity={0.9}
                  transparent
                />
              </RoundedBox>
              
              {/* Category text */}
              <Text
                position={[0, 0.8, 0.12]}
                fontSize={0.15}
                color={post.color}
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter.woff"
              >
                {post.category}
              </Text>
              
              {/* Post title */}
              <Text
                position={[0, 0.4, 0.06]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.8}
                font="/fonts/inter.woff"
                textAlign="center"
              >
                {post.title}
              </Text>
              
              {/* Post date */}
              <Text
                position={[0, 0, 0.06]}
                fontSize={0.12}
                color="rgba(255,255,255,0.7)"
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter.woff"
              >
                {post.date}
              </Text>
              
              {/* Post excerpt */}
              <Text
                position={[0, -0.4, 0.06]}
                fontSize={0.12}
                color="rgba(255,255,255,0.9)"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.7}
                font="/fonts/inter.woff"
                textAlign="center"
              >
                {post.excerpt.length > 50 ? post.excerpt.substring(0, 50) + "..." : post.excerpt}
              </Text>
              
              {/* Read more button */}
              <RoundedBox
                position={[0, -0.8, 0.06]}
                args={[1.2, 0.3, 0.05]}
                radius={0.1}
                smoothness={4}
              >
                <meshStandardMaterial 
                  color="#ffffff" 
                  roughness={0.5}
                  opacity={0.2}
                  transparent
                />
              </RoundedBox>
              
              <Text
                position={[0, -0.8, 0.12]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter.woff"
              >
                Read More
              </Text>
            </group>
          );
        })}
      </group>
      
      {/* Interactive prompt */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.2}
        color="rgba(255,255,255,0.6)"
        anchorX="center"
        anchorY="middle"
      >
        Click on blog posts or press E when near to view details
      </Text>
    </group>
  );
}