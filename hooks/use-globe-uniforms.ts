"use client";

import { useMemo } from "react";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  RepeatWrapping,
  Vector3,
} from "three";
import {
  LIGHT_POSITION,
  ORB_COLORS,
} from "@/constants/globe-constants";

const createRingTexture = () => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 4096;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 4096, 128);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(4096, 14);
  ctx.moveTo(0, 114);
  ctx.lineTo(4096, 114);
  ctx.stroke();

  const skills = [
    "AWS",
    "KUBERNETES",
    "TERRAFORM",
    "DOCKER",
    "AZURE",
    "JENKINS",
    "DATABRICKS",
    "PYTHON",
    "LINUX",
    "CI/CD",
    "PROMETHEUS",
    "GRAFANA",
  ];

  const sequence = (skills.join("   ✦   ") + "   ✦   ").repeat(3);

  ctx.font =
    '600 38px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = "middle";

  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(sequence, 16, 64);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(241, 245, 249, 0.98)";
  ctx.fillText(sequence, 16, 64);

  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
};

export const usePlanetUniforms = () =>
  useMemo(
    () => ({
      u_time: { value: 0 },
      u_lightPosition: { value: LIGHT_POSITION.clone() },
      u_colorOcean: { value: new Color("#050c22") },
      u_colorOceanShallow: { value: new Color("#0c2356") },
      u_colorLand: { value: new Color("#141f3d") },
      u_colorLandHigh: { value: new Color("#22386c") },
      u_colorAtmosphere: { value: new Color("#38bdf8") },
      u_colorTwilight: { value: new Color("#a855f7") },
      u_hover: { value: 0 },
      u_cursor: { value: new Vector3(0, 0, 999) },
    }),
    []
  );

export const useAtmosphereUniforms = () =>
  useMemo(
    () => ({
      u_lightPosition: { value: LIGHT_POSITION.clone() },
      u_colorAtmosphere: { value: new Color("#38bdf8") },
      u_colorOuter: { value: new Color("#818cf8") },
      u_intensity: { value: 1.0 },
    }),
    []
  );

export const useRingUniforms = () =>
  useMemo(
    () => ({
      u_ringTexture: { value: createRingTexture() },
      u_ringOffset: { value: 0 },
      u_innerRadius: { value: 1.88 },
      u_outerRadius: { value: 2.58 },
      u_lightPosition: { value: LIGHT_POSITION.clone() },
      u_opacity: { value: 0.95 },
    }),
    []
  );

export const useOrbUniforms = () =>
  useMemo(
    () =>
      ORB_COLORS.map((color) => ({
        u_color: { value: new Color(color) },
        u_lightPosition: { value: LIGHT_POSITION.clone() },
        u_intensity: { value: 1.05 },
      })),
    []
  );

