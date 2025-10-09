"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import HoloAvatar from "./HoloAvatar";

export default function Scene() {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full rounded-2xl overflow-hidden border border-white/10">
      <Canvas camera={{ position: [0, 1.2, 3.2], fov: 50 }}>
        <color attach="background" args={["#070a11"]} />
        <Suspense fallback={null}>
          <HoloAvatar position={[0, -1.1, 0]} />
          <Environment preset="city" />
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.25} />
            <ChromaticAberration offset={[0.001, 0.001]} />
          </EffectComposer>
          <OrbitControls enablePan={false} minDistance={2.2} maxDistance={4} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="h-full w-full bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.15)_96%),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_16px,16px_100%,100%_16px]" />
      </div>
    </div>
  );
}

