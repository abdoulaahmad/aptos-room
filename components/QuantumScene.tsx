/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Node: React.FC<{ position: [number, number, number], color?: string }> = ({ position, color = "#00F0FF" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
       meshRef.current.rotation.x += 0.01;
       meshRef.current.rotation.y += 0.01;
       const scale = hovered ? 1.5 : 1 + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.2;
       meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial 
        color={hovered ? "#FFFFFF" : color} 
        emissive={color} 
        emissiveIntensity={hovered ? 4 : 2} 
        toneMapped={false}
      />
    </mesh>
  );
};

const Connection: React.FC<{ start: [number, number, number], end: [number, number, number] }> = ({ start, end }) => {
  return (
    <Line 
      points={[start, end]} 
      color="#00F0FF" 
      transparent 
      opacity={0.1} 
      lineWidth={1} 
    />
  );
};

const Network = () => {
  const count = 60;
  const nodes = useMemo(() => {
    const temp: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 6;
      temp.push([x, y, z]);
    }
    return temp;
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      
      // Mouse parallax
      const { mouse } = state;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.2, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2 + state.clock.getElapsedTime() * 0.02, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} />
      ))}
      {nodes.map((pos, i) => {
         if (i % 2 === 0) return null; 
         const targetIndex = (i + Math.floor(Math.random() * 3) + 1) % count;
         return <Connection key={`link-${i}`} start={pos} end={nodes[targetIndex]} />;
      })}
    </group>
  );
};

export const NetworkScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true }}>
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 5, 20]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00F0FF" distance={20} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF00FF" distance={20} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
           <Network />
        </Float>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export const HeroScene: React.FC = () => <NetworkScene />;
export const QuantumComputerScene: React.FC = () => <div className="w-full h-full bg-aptos-card"></div>;