"use client";

import { useEffect, useMemo, useRef, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Vector3,
  type Group,
  type Mesh,
  type PerspectiveCamera,
  type ShaderMaterial,
} from "three";
import {
  GLOBE,
  GLOBE_OUTER_RADIUS,
  ORBITS,
  SECTION_KEYS,
} from "@/constants/globe-constants";
import { planeBasis } from "@/helpers/globe-helpers";
import { clamp01, damp, smoothstep, type Damped } from "@/helpers/math-helpers";
import { useGlobePath } from "@/hooks/use-globe-path";
import { useGlobePostprocessing } from "@/hooks/use-globe-postprocessing";
import {
  useAtmosphereUniforms,
  useOrbUniforms,
  usePlanetUniforms,
  useRingUniforms,
} from "@/hooks/use-globe-uniforms";
import { useNormalizedPointer } from "@/hooks/use-normalized-pointer";
import { type GlobeKey, type GlobeSceneProps } from "@/types/globe-types";
import { GlobeMeshes } from "./globe-meshes";

export const GlobeScene: FC<GlobeSceneProps> = ({ paused, compact }) => {
  const dormant = useRef(false);
  const idleFrames = useRef(0);

  useGlobePostprocessing(dormant);

  const globe = useRef<Group>(null);
  const orbs = useRef<(Mesh | null)[]>([null, null, null, null]);
  const planetMaterial = useRef<ShaderMaterial>(null);
  const atmosphereMaterial = useRef<ShaderMaterial>(null);
  const ringMaterial = useRef<ShaderMaterial>(null);

  const pointer = useNormalizedPointer();
  const elapsed = useRef(0);
  const intro = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });
  const hover = useRef(0);
  const cursorWorld = useRef(new Vector3());
  const idleSpin = useRef(0);
  const scrollSpin = useRef<Damped>({ value: 0, velocity: 0 });

  // Drag-to-turn momentum physics for turning the orbit
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const dragSpin = useRef(0);

  const travel = useRef<Record<keyof GlobeKey, Damped>>({
    x: { value: SECTION_KEYS[0].x, velocity: 0 },
    y: { value: SECTION_KEYS[0].y, velocity: 0 },
    scale: { value: SECTION_KEYS[0].scale, velocity: 0 },
    presence: { value: SECTION_KEYS[0].presence, velocity: 0 },
  });

  const snap = useRef(true);
  const pathTarget = useGlobePath(snap);

  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const bases = useMemo(
    () => ORBITS.map((orbit) => planeBasis(new Vector3(...orbit.axis))),
    []
  );

  const planetUniforms = usePlanetUniforms();
  const atmosphereUniforms = useAtmosphereUniforms();
  const ringUniforms = useRingUniforms();
  const orbUniforms = useOrbUniforms();

  // Scroll tracking with passive listener
  const scrollY = useRef(0);
  useEffect(() => {
    const sync = () => {
      scrollY.current = window.scrollY;
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  // Drag interaction to turn the orbit with physics momentum
  useEffect(() => {
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const deltaVelocity = dx * 0.0035;
      dragVelocity.current = deltaVelocity;
      dragSpin.current += deltaVelocity;
    };
    const onUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);
    if (!paused) elapsed.current += step;
    const time = elapsed.current;

    intro.current = Math.min(1, intro.current + step / GLOBE.introDuration);
    const eased = 1 - Math.pow(1 - intro.current, 3);

    // Update procedural planet time and cloud layer
    if (planetMaterial.current?.uniforms) {
      planetMaterial.current.uniforms.u_time.value = time;
    }

    // Drag inertia decay & continuous ring drift
    if (!isDragging.current) {
      dragVelocity.current *= Math.pow(0.92, step * 60);
      dragSpin.current += dragVelocity.current;
    }

    // Continuous orbital ring stream + spin acceleration
    if (ringMaterial.current?.uniforms) {
      const ringSpeed = step * 0.02 + dragVelocity.current * 0.12;
      ringMaterial.current.uniforms.u_ringOffset.value += ringSpeed;
    }

    // Satellite orb orbital flight
    for (let i = 0; i < ORBITS.length; i++) {
      const orbit = ORBITS[i];
      const { u, v } = bases[i];
      const angle = orbit.dir * orbit.speed * time + orbit.phase;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      orbs.current[i]?.position.set(
        (u.x * cos + v.x * sin) * orbit.radius,
        (u.y * cos + v.y * sin) * orbit.radius,
        (u.z * cos + v.z * sin) * orbit.radius
      );
    }

    const sampled = pathTarget.current;
    const path = compact
      ? {
          x: sampled.x,
          y: sampled.y + GLOBE.compactDrop,
          scale: sampled.scale * GLOBE.compactScale,
          presence: sampled.presence,
        }
      : sampled;

    if (snap.current) {
      snap.current = false;
      for (const channel of ["x", "y", "scale", "presence"] as const) {
        travel.current[channel].value = path[channel];
        travel.current[channel].velocity = 0;
      }
    } else {
      const stiffness = GLOBE.travelStiffness;
      damp(travel.current.x, path.x, stiffness, step);
      damp(travel.current.y, path.y, stiffness, step);
      damp(travel.current.scale, path.scale, stiffness, step);
      damp(travel.current.presence, path.presence, stiffness, step);
    }

    const offsetX = travel.current.x.value;
    const offsetY = travel.current.y.value;
    const presence = clamp01(travel.current.presence.value);

    const fit =
      (Math.min(viewport.width, viewport.height) *
        GLOBE.fitFraction *
        Math.max(0.05, travel.current.scale.value) *
        presence) /
      GLOBE_OUTER_RADIUS;
    const worldRadius = GLOBE_OUTER_RADIUS * fit;
    const centreX = viewport.width * offsetX;
    const centreY = viewport.height * offsetY;

    const lens = camera as PerspectiveCamera;
    if (lens.isPerspectiveCamera) {
      lens.setViewOffset(
        size.width,
        size.height,
        -offsetX * size.width,
        offsetY * size.height,
        size.width,
        size.height
      );
      lens.updateProjectionMatrix();
    }

    const ndcRadiusX = Math.max(1e-4, worldRadius / (viewport.width / 2));
    const ndcRadiusY = Math.max(1e-4, worldRadius / (viewport.height / 2));
    const dx = (pointer.current.x - centreX / (viewport.width / 2)) / ndcRadiusX;
    const dy = (pointer.current.y - centreY / (viewport.height / 2)) / ndcRadiusY;
    const reach = Math.sqrt(dx * dx + dy * dy);
    const hoverTarget = (1 - smoothstep(0.7, 1.15, reach)) * presence;

    hover.current +=
      (hoverTarget - hover.current) * Math.min(1, step / GLOBE.hoverSmoothing);

    if (!globe.current) return;

    const targetX = paused ? 0 : -pointer.current.y * GLOBE.pointerTiltX;
    const targetY = paused ? 0 : pointer.current.x * GLOBE.pointerTiltY;
    tilt.current.x += (targetX - tilt.current.x) * Math.min(1, step * 3);
    tilt.current.y += (targetY - tilt.current.y) * Math.min(1, step * 3);

    if (!paused) {
      idleSpin.current +=
        step * (GLOBE.idleSpin + hover.current * GLOBE.hoverSpin);
      damp(
        scrollSpin.current,
        scrollY.current * GLOBE.scrollYaw,
        GLOBE.yawStiffness,
        step
      );
    }

    globe.current.rotation.x = GLOBE.baseTilt + tilt.current.x;
    globe.current.rotation.y =
      idleSpin.current + scrollSpin.current.value + dragSpin.current + tilt.current.y;
    globe.current.scale.setScalar(fit * (0.6 + 0.4 * eased));
    globe.current.position.set(0, 0, 0);

    const showing = presence > 0.005;
    globe.current.visible = showing;
    idleFrames.current = showing ? 0 : idleFrames.current + 1;
    dormant.current = idleFrames.current > 2;

    if (planetMaterial.current?.uniforms) {
      planetMaterial.current.uniforms.u_hover.value = hover.current;

      globe.current.updateMatrixWorld();
      cursorWorld.current.set(
        (pointer.current.x * viewport.width) / 2,
        (pointer.current.y * viewport.height) / 2,
        worldRadius
      );
      globe.current.worldToLocal(cursorWorld.current);
      (planetMaterial.current.uniforms.u_cursor.value as Vector3).copy(
        cursorWorld.current
      );
    }

    const orbBoost = 1.05 + hover.current * 0.45;
    for (const orb of orbs.current) {
      const orbMaterial = orb?.material as ShaderMaterial | undefined;
      if (orbMaterial) orbMaterial.uniforms.u_intensity.value = orbBoost;
    }
  });

  return (
    <group ref={globe}>
      <GlobeMeshes
        planetMaterial={planetMaterial}
        atmosphereMaterial={atmosphereMaterial}
        ringMaterial={ringMaterial}
        orbs={orbs}
        planetUniforms={planetUniforms}
        atmosphereUniforms={atmosphereUniforms}
        ringUniforms={ringUniforms}
        orbUniforms={orbUniforms}
      />
    </group>
  );
};
