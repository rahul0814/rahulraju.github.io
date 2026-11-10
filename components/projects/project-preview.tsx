"use client";

import { type FC, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { TILT_RANGE, TILT_SPRING } from "@/constants/projects-constants";
import { formatCounter, padIndex } from "@/helpers/format-helpers";
import { type ProjectPreviewProps } from "@/types/project-types";

const BADGE =
  "rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md";

export const ProjectPreview: FC<ProjectPreviewProps> = ({
  project,
  index,
  total,
  showPreview,
}) => {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], TILT_RANGE.x),
    TILT_SPRING
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], TILT_RANGE.y),
    TILT_SPRING
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const techLogo = project.logo || project.tags?.[0]?.path || "";

  return (
    <div className="order-1 lg:order-2 lg:col-span-7">
      <div style={{ perspective: "1400px" }} className="relative">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-midnight shadow-2xl shadow-black/50 md:aspect-[16/10]"
        >
          {/* Ambient gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-40`}
          />

          {/* Background large index number */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[10rem] font-black leading-none tracking-tighter text-white/5 md:text-[14rem]">
              {padIndex(index + 1)}
            </span>
          </div>

          {/* Project visual rendering */}
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} homepage`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="pointer-events-none select-none object-cover object-top"
            />
          ) : project.href ? (
            showPreview && (
              <iframe
                src={project.href}
                title={project.title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute inset-0 select-none bg-transparent"
                style={{
                  width: "180%",
                  height: "180%",
                  transform: "scale(0.555)",
                  transformOrigin: "top left",
                  border: 0,
                  colorScheme: "normal",
                }}
              />
            )
          ) : (
            /* Designed project visual: Tech logo on white tile with animated spinning rings */
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Radial glow backdrop */}
              <div className="absolute h-64 w-64 rounded-full bg-gradient-to-tr from-coral/20 via-lavender/25 to-aqua/20 blur-3xl" />

              {/* Outer spinning ring */}
              <div
                style={{ transform: "translateZ(30px)" }}
                className="absolute h-64 w-64 rounded-full border border-dashed border-white/20 md:h-80 md:w-80 animate-[spin_32s_linear_infinite]"
              >
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_rgba(46,230,246,0.9)]" />
              </div>

              {/* Middle reverse spinning ring */}
              <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute h-48 w-48 rounded-full border border-white/15 md:h-60 md:w-60 animate-[spin_24s_linear_infinite_reverse]"
              >
                <span className="absolute top-1/2 -left-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_10px_rgba(234,72,132,0.9)]" />
                <span className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_10px_rgba(87,219,150,0.9)]" />
              </div>

              {/* Inner dashed ring */}
              <div
                style={{ transform: "translateZ(70px)" }}
                className="absolute h-36 w-36 rounded-full border border-dotted border-white/25 md:h-44 md:w-44 animate-[spin_16s_linear_infinite]"
              />

              {/* Centered white tile with technology logo */}
              <div
                style={{ transform: "translateZ(95px)" }}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-4 shadow-2xl shadow-black/80 ring-1 ring-black/10 md:h-28 md:w-28 md:p-5 transition-transform hover:scale-105"
              >
                {techLogo ? (
                  <img
                    src={techLogo}
                    alt={`${project.title} icon`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl font-black text-neutral-900">
                    {project.title.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Vignette & highlights */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.45),transparent_45%)]" />

          {/* Top badges */}
          <div
            style={{ transform: "translateZ(70px)" }}
            className="pointer-events-none absolute left-5 right-5 top-5 flex items-center justify-between"
          >
            <span
              className={`${BADGE} inline-flex items-center gap-2 border-white/25 bg-black/50 text-white`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
              </span>
              {project.image
                ? "Preview"
                : project.href
                ? "Live Preview"
                : "Enterprise Platform"}
            </span>
            <span className={`${BADGE} text-white/70`}>
              {formatCounter(index, total)}
            </span>
          </div>

          {/* Open Site button only when href is non-empty */}
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transform: "translateZ(80px)" }}
              className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-md hover:border-white/40"
            >
              <span>Open Site</span>
              <span aria-hidden>↗</span>
            </a>
          ) : null}

          {/* Bottom left project title pill */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className={`${BADGE} pointer-events-none absolute bottom-5 left-5 text-white/85`}
          >
            {project.title}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        </motion.div>
      </div>
    </div>
  );
};
