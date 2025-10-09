"use client";
import * as THREE from "three";
import { useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";

export default function HoloAvatar(props: ThreeElements["group"]) {
  const mat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#7fffd4"),
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
      transmission: 0.8,
      emissive: new THREE.Color("#00e5ff"),
      emissiveIntensity: 1.2,
    });
    return m;
  }, []);

  return (
    <group {...props}>
      <mesh material={mat} position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.45, 64, 64]} />
      </mesh>
      <mesh material={mat} position={[0, 0.2, 0]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.42, 0.7, 64]} />
      </mesh>
      <mesh material={mat} position={[0, -0.6, 0]}>
        <torusGeometry args={[0.7, 0.08, 16, 80]} />
      </mesh>
      <gridHelper args={[8, 24, "#00d0ff", "#002233"]} position={[0, -1.1, 0]} />
    </group>
  );
}

