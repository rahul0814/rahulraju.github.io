"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { revealProps } from "@/animations/scroll-animations";

export const ServicesCtaCard: FC = () => (
  <motion.div
    {...revealProps()}
    className="glass gradient-border relative z-10 mt-24 flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10"
  >
    <div>
      <p className="text-eyebrow mb-2">Custom Challenge?</p>
      <h3 className="text-2xl font-bold md:text-3xl">
        Have a different challenge?{" "}
        <span className="text-gradient">Let&apos;s talk it through.</span>
      </h3>
      <p className="mt-2 max-w-xl text-neutral-400">
        Whether you need custom CI/CD pipelines, multi-cloud Terraform modules, EKS cluster migrations, or cloud cost optimizations, reach out and let&apos;s build a resilient solution.
      </p>
    </div>
    <a href="#contact" className="btn-primary">
      <span>Get in touch</span>
      <span aria-hidden>→</span>
    </a>
  </motion.div>
);
