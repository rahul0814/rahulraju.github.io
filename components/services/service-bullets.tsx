"use client";

import { type FC } from "react";
import { motion } from "motion/react";

export const ServiceBullets: FC<{ bullets: string[]; icon?: string }> = ({
  bullets,
  icon,
}) => (
  <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)]">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
          What&apos;s included
        </p>
        <ul className="space-y-3">
          {bullets.map((bullet, index) => (
            <motion.li
              key={bullet}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-start gap-3 text-sm text-white/85 md:text-base"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {icon && (
        <div className="group/icon relative self-end flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 hover:scale-105 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] md:h-16 md:w-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/icon:opacity-100" />
          <img
            src={icon}
            alt=""
            loading="lazy"
            decoding="async"
            className="relative z-10 h-7 w-7 object-contain opacity-95 transition-transform duration-500 group-hover/icon:scale-110 md:h-9 md:w-9"
          />
        </div>
      )}
    </div>
  </div>
);
