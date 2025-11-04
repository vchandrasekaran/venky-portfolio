// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import { VRM, VRMLoaderPlugin, VRMExpressionPresetName } from "@pixiv/three-vrm";

function VRMModel({ speaking, variant }: { speaking?: boolean; variant: 'mini'|'portrait' }){
  const { scene } = useThree();
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [error, setError] = useState(false);
  const target = useRef(new THREE.Object3D());
  const baseOffset = useRef(variant === 'mini' ? 0.48 : 0.58);
  const vrmRef = useRef<VRM | null>(null);

  const normalizeVRM = (v: VRM) => {
    v.scene.updateMatrixWorld(true);
    const initialBox = new THREE.Box3().setFromObject(v.scene);
    const currentHeight = Math.max(0.01, initialBox.max.y - initialBox.min.y);
    const targetHeight = variant === 'mini' ? 1.62 : 1.78;
    const scaleFactor = targetHeight / currentHeight;
    v.scene.scale.setScalar(scaleFactor);
    v.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(v.scene);
    const center = box.getCenter(new THREE.Vector3());
    v.scene.position.sub(center);
    baseOffset.current = variant === 'mini' ? 0.52 : 0.62;
    v.scene.position.y += baseOffset.current;
  };

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load('/models/avatar.vrm', (gltf) => {
      const v = gltf.userData.vrm as VRM;
      v.scene.traverse((obj:any)=>{ obj.frustumCulled = false; });
      normalizeVRM(v);
      scene.add(v.scene);
      setVrm(v);
      vrmRef.current = v;
    }, undefined, () => setError(true));
    return () => {
      if (vrmRef.current) scene.remove(vrmRef.current.scene);
    }
  }, []);

  useEffect(() => {
    if (!vrmRef.current) return;
    normalizeVRM(vrmRef.current);
  }, [variant]);

  useFrame((state, delta) => {
    const current = vrmRef.current;
    if (!current) return;
    // idle bob
    const t = state.clock.getElapsedTime();
    current.scene.position.y = baseOffset.current + Math.sin(t * 1.2) * 0.03;
    // simple look at mouse
    const x = (state.pointer.x||0) * 0.4; const y = (state.pointer.y||0) * 0.3;
    target.current.position.set(x, 1.45 + y, 1.8);
    current.lookAt?.lookAt(target.current.position);
    // lip-sync lite
    const em = (current.expressionManager||current.blendShapeProxy);
    if (em) {
      const val = speaking ? 0.5 + (Math.sin(t*10)+1)/4 : 0.0;
      try { em.setValue?.(VRMExpressionPresetName.Aa, val); } catch {}
      try { em.setValue?.("A", val); } catch {}
      em.update?.delta?.(delta) || em.update?.(delta);
    }
  });

  if (error) return null;
  return null;
}

function CameraRig({ variant }: { variant: 'mini'|'portrait' }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetY = variant === 'mini' ? 1.05 : 1.22;
    const pos = variant === 'mini' ? [0, 1.5, 3.35] : [0, 1.65, 3.65];
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(0, targetY, 0);
  });
  return null;
}

export default function VRMStage({ className, speaking = false, variant = 'portrait', url = '/models/avatar.vrm' }: { className?: string; speaking?: boolean; variant?: 'mini'|'portrait', url?: string }){
  const cam = variant === 'mini' ? { position: [0, 1.5, 3.35], fov: 32 } : { position: [0, 1.65, 3.65], fov: 32 };
  const [headOk, setHeadOk] = useState<'checking'|'ok'|'missing'>('checking');
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      try{ const res = await fetch(url, { method:'HEAD' }); if(!alive) return; setHeadOk(res.ok ? 'ok' : 'missing'); }
      catch{ if(!alive) return; setHeadOk('missing'); }
    })();
    return ()=>{ alive = false };
  },[url]);
  return (
    <div className={`relative h-full w-full ${className||''}`}>
      <Canvas dpr={[1,2]} camera={cam as any}>
        <color attach="background" args={["#090a0f"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 2, 2]} intensity={1.2} color="#ffffff" />
        <Environment preset="city" />
        <CameraRig variant={variant as any} />
        <VRMModel speaking={speaking} variant={variant as any} />
      </Canvas>
      {headOk === 'missing' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[10px] text-red-300 opacity-80">
          VRM not found at /models/avatar.vrm. Using fallback.
        </div>
      ) : null}
    </div>
  );
}


