import { type FC } from "react";

export const ServiceCta: FC = () => (
  <a
    href="#contact"
    className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.04] py-2 pl-2 pr-6 text-white backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white/35 hover:bg-white/[0.08] hover:shadow-[0_0_25px_rgba(234,72,132,0.3)]"
  >
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary transition-transform duration-300 group-hover:scale-105 group-hover:rotate-45">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    </span>
    <span className="text-sm font-medium tracking-tight md:text-base">
      Start this project
    </span>
  </a>
);
