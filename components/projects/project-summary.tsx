"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { formatCounter, padIndex } from "@/helpers/format-helpers";
import { type ProjectSummaryProps } from "@/types/project-types";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.5, delay },
});

export const ProjectSummary: FC<ProjectSummaryProps> = ({
  project,
  index,
  total,
  onOpen,
  onNavigate,
}) => (
  <div className="order-2 lg:order-1 lg:col-span-5">
    <div className="relative rounded-3xl border border-white/10 bg-[#090d20]/85 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/70 ring-1 ring-white/5">
      {/* Top Header metadata matching reference */}
      <motion.div {...reveal()} className="flex items-center gap-2">
        <span className="h-[2px] w-5 bg-gradient-to-r from-coral to-lavender" />
        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-lavender/90">
          SELECTED WORK · {padIndex(total)}
        </span>
      </motion.div>

      {/* Main overarching section heading */}
      <motion.h2
        {...reveal(0.05)}
        className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl"
      >
        Platforms I&apos;ve built &amp;{" "}
        <span className="bg-gradient-to-r from-lavender via-fuchsia to-coral bg-clip-text text-transparent">
          automated.
        </span>
      </motion.h2>

      {/* Active project index and category */}
      <motion.p
        {...reveal(0.1)}
        className="mt-6 text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400"
      >
        {formatCounter(index, total)} · {project.category}
      </motion.p>

      {/* Project Title */}
      <motion.h3
        {...reveal(0.15)}
        className="mt-1 text-2xl font-extrabold leading-tight text-white md:text-3xl"
      >
        {project.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        {...reveal(0.2)}
        className="mt-3 text-sm leading-relaxed text-neutral-300/90 md:text-[15px]"
      >
        {project.description}
      </motion.p>

      {/* Tech pills */}
      <motion.div {...reveal(0.25)} className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300 backdrop-blur-sm"
          >
            {tag.name}
          </span>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div {...reveal(0.3)} className="mt-6 flex flex-wrap items-center gap-3">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:brightness-110"
          >
            <span>Visit Live</span>
            <span aria-hidden>↗</span>
          </a>
        ) : null}
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/30"
        >
          <span>Case study</span>
          <span aria-hidden>→</span>
        </button>
      </motion.div>

      {/* Bottom row: Prev/Next Navigation and big hollow index number */}
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.(index - 1)}
            disabled={index === 0}
            aria-label="Previous project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/80 transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <span className="font-mono text-xs font-semibold tracking-widest text-neutral-400">
            {formatCounter(index, total)}
          </span>
          <button
            type="button"
            onClick={() => onNavigate?.(index + 1)}
            disabled={index === total - 1}
            aria-label="Next project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/80 transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>

        <span className="select-none font-mono text-5xl font-black text-transparent md:text-6xl [-webkit-text-stroke:1.5px_rgba(129,140,248,0.4)]">
          {padIndex(index + 1)}
        </span>
      </div>
    </div>
  </div>
);
