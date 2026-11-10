"use client";

import { type FC } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import {
  MY_PROJECTS,
  PREVIEW_WINDOW,
  TRACK_SPRING,
} from "@/constants/projects-constants";
import { padIndex } from "@/helpers/format-helpers";
import { usePinnedProgress } from "@/hooks/use-pinned-progress";
import { type ProjectListProps } from "@/types/project-types";
import { ProjectPanel } from "./project-panel";

export const PinnedShowcase: FC<ProjectListProps> = ({ onOpen }) => {
  const total = MY_PROJECTS.length;
  const { trackRef, progress, activeIndex } = usePinnedProgress(total);

  const x = useSpring(
    useTransform(progress, [0, 1], ["0vw", `-${(total - 1) * 100}vw`]),
    TRACK_SPRING
  );
  const progressScale = useSpring(progress, TRACK_SPRING);

  const navigateTo = (targetIndex: number) => {
    if (!trackRef.current) return;
    const bounded = Math.max(0, Math.min(total - 1, targetIndex));
    const rect = trackRef.current.getBoundingClientRect();
    const scrollable = trackRef.current.offsetHeight - window.innerHeight;
    const topOfTrack = window.scrollY + rect.top;
    const targetScroll = topOfTrack + (bounded / (total - 1)) * scrollable;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      ref={trackRef}
      style={{ height: `${total * 100}vh` }}
      className="relative mt-10"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/3 h-72 w-72 rounded-full bg-royal/10 blur-[140px]" />
          <div className="absolute bottom-1/3 right-0 h-80 w-80 rounded-full bg-coral/10 blur-[140px]" />
        </div>

        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {MY_PROJECTS.map((project, index) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={index}
              total={total}
              onOpen={() => onOpen(project)}
              showPreview={Math.abs(index - activeIndex) <= PREVIEW_WINDOW}
              onNavigate={navigateTo}
            />
          ))}
        </motion.div>

        {/* Bottom Turn-the-Orbit & Project Navigation Track matching reference */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center px-4">
          <div className="mb-2.5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.35em] text-neutral-400 select-none">
            <span className="text-neutral-500">‹</span>
            <span>DRAG TO TURN THE ORBIT</span>
            <span className="text-neutral-500">›</span>
          </div>

          <div className="flex max-w-[94vw] items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-[#080c1f]/85 p-1.5 backdrop-blur-xl shadow-2xl scrollbar-none">
            {MY_PROJECTS.map((proj, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => navigateTo(idx)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 text-white shadow-lg shadow-violet-600/40 ring-1 ring-violet-400/50"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isActive
                        ? "text-violet-200"
                        : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                  >
                    {padIndex(idx + 1)}
                  </span>
                  <span className="max-w-[110px] truncate md:max-w-[170px]">
                    {proj.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-coral via-lavender to-royal"
        />
      </div>
    </div>
  );
};
