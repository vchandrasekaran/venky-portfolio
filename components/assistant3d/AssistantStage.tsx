"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Head() {
  return (
    <group position={[0, 0.2, 0]}>
      {/* head sphere */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial
          color="#1a1f2a"
          metalness={0.4}
          roughness={0.35}
          emissive="#ff3b00"
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* visor band */}
      <mesh position={[0, 0.58, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 16, 64]} />
        <meshStandardMaterial color="#ffffff" emissive="#00e5ff" emissiveIntensity={0.9} roughness={0.2} />
      </mesh>
      {/* identity disc on shoulder */}
      <mesh position={[0.5, 0.2, -0.12]} rotation={[Math.PI / 2, 0, 0]}> 
        <torusGeometry args={[0.18, 0.02, 16, 64]} />
        <meshStandardMaterial color="#0b0f16" emissive="#00e5ff" emissiveIntensity={1.0} />
      </mesh>
      {/* shoulders */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.75, 0.25, 32]} />
        <meshStandardMaterial color="#0e1119" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* suit glow lines */}
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

export default function AssistantStage() {
  return (
    <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-[rgba(255,59,0,0.35)] bg-[rgba(10,12,16,0.9)]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.8, 2.2], fov: 45 }}>
        <color attach="background" args={["#090a0f"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} color="#ff8a00" />
        <directionalLight position={[-2, 2, 1]} intensity={0.6} color="#00e5ff" />
        <Suspense fallback={null}>
          <Head />
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

