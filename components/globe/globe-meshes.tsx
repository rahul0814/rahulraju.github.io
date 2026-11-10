import { useEffect, useState, type FC, type RefObject } from "react";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  type Mesh,
  type ShaderMaterial,
} from "three";
import { Billboard } from "@react-three/drei";
import { GLOBE, ORB_COLORS } from "@/constants/globe-constants";
import {
  atmosphereHaloFragmentShader,
  atmosphereHaloVertexShader,
  orbFragmentShader,
  orbVertexShader,
  planetSurfaceFragmentShader,
  planetSurfaceVertexShader,
  ringFragmentShader,
  ringVertexShader,
} from "@/lib/globe/globe-shaders";

const TECH_ORB_SETS = [
  [
    { name: "AWS", icon: "/assets/icons/aws.svg" },
    { name: "Kubernetes", icon: "/assets/icons/kubernetes.svg" },
    { name: "Terraform", icon: "/assets/icons/terraform.svg" },
    { name: "Docker", icon: "/assets/icons/docker.svg" },
  ],
  [
    { name: "Azure", icon: "/assets/icons/azure.svg" },
    { name: "Amazon EKS", icon: "/assets/icons/aws-eks.svg" },
    { name: "Jenkins", icon: "/assets/icons/jenkins.svg" },
    { name: "Databricks", icon: "/assets/icons/databricks.svg" },
  ],
  [
    { name: "Python", icon: "/assets/icons/python.svg" },
    { name: "GitHub Actions", icon: "/assets/icons/githubactions.svg" },
    { name: "Grafana", icon: "/assets/icons/grafana.svg" },
    { name: "Linux", icon: "/assets/icons/linux.svg" },
  ],
];

const TechOrbBadge: FC<{ index: number; color: string }> = ({
  index,
  color,
}) => {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSetIndex((prev) => (prev + 1) % TECH_ORB_SETS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const currentSkill = TECH_ORB_SETS[setIndex][index];

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, 256, 256);

      // Dark translucent glass backing circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(128, 128, 114, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(4, 7, 24, 0.9)";
      ctx.fill();

      // Glowing outer rim matching orb color
      ctx.lineWidth = 10;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 22;
      ctx.stroke();

      // Inner specular rim
      ctx.beginPath();
      ctx.arc(128, 128, 105, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.stroke();
      ctx.restore();

      // Center tech logo icon
      const iconSize = 138;
      ctx.drawImage(
        img,
        (256 - iconSize) / 2,
        (256 - iconSize) / 2,
        iconSize,
        iconSize
      );

      const nextTex = new CanvasTexture(canvas);
      nextTex.needsUpdate = true;
      setTexture(nextTex);
    };
    img.src = currentSkill.icon;

    return () => {
      cancelled = true;
    };
  }, [currentSkill, color]);

  if (!texture) return null;

  return (
    <Billboard follow lockX={false} lockY={false} lockZ={false}>
      <mesh position={[0, 0, 0.02]} renderOrder={3}>
        <planeGeometry args={[0.36, 0.36]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.96}
          depthTest={false}
        />
      </mesh>
    </Billboard>
  );
};

export const PlanetOrbitRing: FC<{
  ringMaterial: RefObject<ShaderMaterial | null>;
  ringUniforms: Record<string, { value: unknown }>;
}> = ({ ringMaterial, ringUniforms }) => (
  // Dramatic equatorial orbit ring tilted to frame the project preview
  <group rotation={[-1.28, 0.14, 0.28]}>
    <mesh renderOrder={2}>
      <ringGeometry args={[1.88, 2.58, 128, 1]} />
      <shaderMaterial
        ref={ringMaterial}
        vertexShader={ringVertexShader}
        fragmentShader={ringFragmentShader}
        uniforms={ringUniforms}
        transparent
        side={DoubleSide}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  </group>
);

interface GlobeMeshesProps {
  planetMaterial: RefObject<ShaderMaterial | null>;
  atmosphereMaterial: RefObject<ShaderMaterial | null>;
  ringMaterial: RefObject<ShaderMaterial | null>;
  orbs: RefObject<(Mesh | null)[]>;
  planetUniforms: Record<string, { value: unknown }>;
  atmosphereUniforms: Record<string, { value: unknown }>;
  ringUniforms: Record<string, { value: unknown }>;
  orbUniforms: Record<string, { value: unknown }>[];
}

export const GlobeMeshes = ({
  planetMaterial,
  atmosphereMaterial,
  ringMaterial,
  orbs,
  planetUniforms,
  atmosphereUniforms,
  ringUniforms,
  orbUniforms,
}: GlobeMeshesProps) => (
  <>
    {/* 1. Photorealistic Planet Sphere */}
    <mesh renderOrder={0}>
      <sphereGeometry args={[GLOBE.sphereRadius, 64, 48]} />
      <shaderMaterial
        ref={planetMaterial}
        vertexShader={planetSurfaceVertexShader}
        fragmentShader={planetSurfaceFragmentShader}
        uniforms={planetUniforms}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>

    {/* 2. Glowing Atmosphere Halo Sphere */}
    <mesh renderOrder={1}>
      <sphereGeometry args={[GLOBE.sphereRadius * 1.15, 64, 32]} />
      <shaderMaterial
        ref={atmosphereMaterial}
        vertexShader={atmosphereHaloVertexShader}
        fragmentShader={atmosphereHaloFragmentShader}
        uniforms={atmosphereUniforms}
        side={BackSide}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>

    {/* 3. Tilted Equatorial Typography Orbit Ring */}
    <PlanetOrbitRing
      ringMaterial={ringMaterial}
      ringUniforms={ringUniforms}
    />

    {/* 4. Satellite Tech Badges */}
    {ORB_COLORS.map((color, index) => (
      <mesh
        key={color}
        ref={(node) => {
          orbs.current[index] = node;
        }}
        renderOrder={1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <shaderMaterial
          vertexShader={orbVertexShader}
          fragmentShader={orbFragmentShader}
          uniforms={orbUniforms[index]}
        />
        <TechOrbBadge index={index} color={color} />
      </mesh>
    ))}
  </>
);
