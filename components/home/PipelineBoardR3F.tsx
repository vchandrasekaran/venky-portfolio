// @ts-nocheck
"use client"

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";

const STAGES = [
  {
    title: "Ingest",
    color: "#8ee0ff",
    tools: [
      { name: "Fivetran", logo: "/logos/fivetran-logo.svg" },
      { name: "Kafka", logo: "/logos/kafka-logo.svg" },
      { name: "Snowpipe", logo: "/logos/snowflake-logo.png" },
      { name: "Matillion", logo: "/logos/matillion-logo.webp" },
    ],
  },
  {
    title: "Store",
    color: "#a7b6ff",
    tools: [
      { name: "S3", logo: "/logos/s3-logo.svg" },
      { name: "Azure", logo: "/logos/azure-logo.svg" },
      { name: "Snowflake", logo: "/logos/snowflake-logo.png" },
      { name: "Iceberg", logo: "/logos/iceberg-logo.png" },
    ],
  },
  {
    title: "Transform",
    color: "#ffc887",
    tools: [
      { name: "DBT", logo: "/logos/dbt-logo.jpg" },
      { name: "Spark", logo: "/logos/spark-logo.svg" },
      { name: "Airflow", logo: "/logos/airflow-logo.png" },
      { name: "Python", logo: "/logos/python-logo.webp" },
    ],
  },
  {
    title: "Serve",
    color: "#7efcd2",
    tools: [
      { name: "Tableau", logo: "/logos/tableau-logo.png" },
      { name: "Power BI", logo: "/logos/powerbi-logo.png" },
      { name: "Looker", logo: "/logos/looker-logo.png" },
      { name: "ClickHouse", logo: "/logos/clickhouse-logo.png" },
      { name: "Atlan", logo: "/logos/atlan-logo.png" },
    ],
  },
];

type Node = {
  id: string;
  name: string;
  logo?: string;
  stage: number;
  position: [number, number, number];
  color: string;
};

function useBoardLayout(): { nodes: Node[]; links: Array<[string, string]> } {
  return useMemo(() => {
    const nodes: Node[] = [];
    const links: Array<[string, string]> = [];

    const ySpacing = 1.5;
    const xSpacing = 3;
    const zBase = 0;

    STAGES.forEach((stage, stageIdx) => {
      stage.tools.forEach((tool, toolIdx) => {
        const id = `${stage.title}-${tool.name}`;
        const x = stageIdx * xSpacing;
        const y = (toolIdx - stage.tools.length / 2) * ySpacing;
        const z = zBase + (stageIdx % 2 === 0 ? 0.15 : -0.15);
        nodes.push({
          id,
          name: tool.name,
          logo: tool.logo,
          stage: stageIdx,
          position: [x, y, z],
          color: stage.color,
        });
        // Connect to next stage same index (or closest)
        if (stageIdx < STAGES.length - 1) {
          const nextIdx = Math.min(toolIdx, STAGES[stageIdx + 1].tools.length - 1);
          const nextId = `${STAGES[stageIdx + 1].title}-${STAGES[stageIdx + 1].tools[nextIdx].name}`;
          links.push([id, nextId]);
        }
      });
    });

    return { nodes, links };
  }, []);
}

export default function PipelineBoardR3F() {
  const { nodes, links } = useBoardLayout();

  return (
    <section className="container-max pb-16 text-white">
      <header className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/60">Workflow</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">3D board — react-three-fiber</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70 md:text-base">
          Orbit/tilt a lightweight 3D lane of the ETL toolchain. Hover highlights nodes; lines show stage flow.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b0f22] via-[#050812] to-[#040611] p-4 shadow-[0_45px_90px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,252,210,0.08),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(142,224,255,0.08),transparent_35%)]" />
        <div className="h-[540px] w-full">
          <Canvas camera={{ position: [6, 4, 12], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[6, 10, 6]} intensity={0.9} />
            <directionalLight position={[-6, -4, -6]} intensity={0.25} />
            <BoardPlane />
            <Links nodes={nodes} links={links} />
            <Nodes nodes={nodes} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minDistance={9}
              maxDistance={12}
              minPolarAngle={0.95}
              maxPolarAngle={1.25}
              minAzimuthAngle={-0.35}
              maxAzimuthAngle={0.35}
              rotateSpeed={0.35}
              enableDamping
              dampingFactor={0.08}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}

function BoardPlane() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.15) * 0.02;
  });
  return (
    <group ref={ref}>
      <mesh position={[4.5, 0, -0.6]} rotation={[-Math.PI / 2.2, 0, -0.18]}>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#0d1226" opacity={0.85} transparent />
      </mesh>
      <mesh position={[4.5, 0, -0.59]} rotation={[-Math.PI / 2.2, 0, -0.18]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial color="#6de0d0" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Nodes({ nodes }: { nodes: Node[] }) {
  return (
    <>
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </>
  );
}

function Node({ node }: { node: Node }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = node.position[1] + Math.sin(t * 0.8 + node.stage) * 0.05;
  });

  return (
    <group ref={group} position={node.position}>
      <mesh>
        <boxGeometry args={[1.8, 0.9, 0.18]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.15} opacity={0.95} transparent />
      </mesh>
      <Html center distanceFactor={8}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs text-white/80 backdrop-blur">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10">
            {node.logo ? (
              <Image src={node.logo} alt={node.name} width={20} height={20} className="h-5 w-5 object-contain" />
            ) : (
              <span className="text-[10px]">{node.name.slice(0, 2)}</span>
            )}
          </span>
          {node.name}
        </div>
      </Html>
    </group>
  );
}

function Links({ nodes, links }: { nodes: Node[]; links: Array<[string, string]> }) {
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  return (
    <>
      {links.map(([fromId, toId]) => {
        const from = nodeMap[fromId];
        const to = nodeMap[toId];
        if (!from || !to) return null;
        const points: [number, number, number][] = [
          from.position,
          [(from.position[0] + to.position[0]) / 2, (from.position[1] + to.position[1]) / 2 + 0.2, (from.position[2] + to.position[2]) / 2],
          to.position,
        ];
        return (
          <Line
            key={`${fromId}-${toId}`}
            points={points}
            color="#7efcd2"
            lineWidth={1.5}
            transparent
            opacity={0.6}
            dashed={false}
          />
        );
      })}
    </>
  );
}
