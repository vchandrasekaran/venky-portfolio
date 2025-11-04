// @ts-nocheck
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Head({ speaking = false, variant = 'portrait' }: { speaking?: boolean; variant?: 'portrait'|'mini' }) {
  const visorRef = useRef<any>(null);
  useFrame((state) => {
    if (!visorRef.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = speaking ? 0.8 + Math.sin(t * 8) * 0.2 : 0.9;
    visorRef.current.emissiveIntensity = pulse;
  });
  const s = variant === 'mini' ? 0.78 : 0.92; // overall scale so head isn't cropped
  const headY = variant === 'mini' ? 0.52 : 0.58; // lower for mini so it's fully visible
  return (
    <group position={[0, 0.1, 0]} scale={[s, s, s]}>
      {/* helmet dome (slightly human-shaped ellipsoid) */}
      <mesh position={[0, headY, 0]} scale={[0.95, 1.1, 1]}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial color="#0e1118" metalness={0.45} roughness={0.32} emissive="#120504" emissiveIntensity={0.05} />
      </mesh>
      {/* jaw/neck plate */}
      <mesh position={[0, headY - 0.22, 0]}>
        <cylinderGeometry args={[0.36, 0.42, 0.24, 32]} />
        <meshStandardMaterial color="#0c0f16" metalness={0.35} roughness={0.5} />
      </mesh>
      {/* visor band */}
      <mesh position={[0, headY - 0.02, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 16, 64]} />
        <meshStandardMaterial ref={visorRef} color="#9fefff" emissive="#00e5ff" emissiveIntensity={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, 0.2, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.02, 16, 64]} />
        <meshStandardMaterial color="#0b0f16" emissive="#00e5ff" emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.75, 0.25, 32]} />
        <meshStandardMaterial color="#0e1119" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[-0.32, 0.22, 0.33]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.45, 0.02]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      <mesh position={[0.32, 0.22, 0.33]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.02, 0.45, 0.02]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
    </group>
  );
}

export default function Stage({ className, speaking = false, variant = 'portrait' }: { className?: string; speaking?: boolean; variant?: 'portrait' | 'mini' }) {
  const cam = variant === 'mini' ? { position: [0, 0.9, 2.6], fov: 42 } : { position: [0, 1.0, 2.5], fov: 42 };
  return (
    <div className={`relative h-full w-full ${className || ''}`}>
      <Canvas dpr={[1, 2]} camera={cam as any}>
        <color attach="background" args={["#090a0f"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} color="#ff8a00" />
        <directionalLight position={[-2, 2, 1]} intensity={0.6} color="#00e5ff" />
        <Suspense fallback={null}>
          <Head speaking={speaking} variant={variant} />
          <Environment preset="city" />
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.2} />
          </EffectComposer>
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/1.8} />
        </Suspense>
      </Canvas>
    </div>
  );
}
