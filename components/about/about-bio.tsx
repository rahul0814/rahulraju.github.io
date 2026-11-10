"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import { fadeInUp } from "@/animations/scroll-animations";
import {
  HERO_LOCATION,
  HERO_NAME,
  RESUME_URL,
} from "@/constants/hero-constants";
import {
  ABOUT_BIO_P1,
  ABOUT_BIO_P2,
  ABOUT_BIO_P3,
} from "@/constants/about-constants";

export const AboutBio: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7 }}
      className="glass-strong gradient-border p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] md:p-10 lg:col-span-7"
    >
      <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-400">
        Who I Am
      </p>
      <h3 className="mb-4 text-2xl font-bold md:text-3xl">
        {HERO_NAME} · {HERO_LOCATION}
      </h3>
      <p className="text-base leading-relaxed text-neutral-300 md:text-lg">
        {ABOUT_BIO_P1}
      </p>
      <p className="mt-4 leading-relaxed text-neutral-400">
        {ABOUT_BIO_P2}
      </p>
      <p className="mt-4 leading-relaxed text-neutral-400">
        {ABOUT_BIO_P3}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#contact" className="btn-primary">
          <span>Get in touch</span>
          <span aria-hidden>→</span>
        </a>
        <a href="#work" className="btn-ghost">
          <span>See my work</span>
        </a>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          <span>Resume</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </motion.div>
  );
};
