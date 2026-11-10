"use client";

import { type FC, type MouseEvent } from "react";
import { goToAnchor } from "@/helpers/scroll-helpers";
import { type HireMeButtonProps } from "@/types/navigation-types";
import { ArrowIcon } from "./arrow-icon";

export const HireMeButton: FC<HireMeButtonProps> = ({ onClick, full }) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goToAnchor("#contact");
    onClick?.();
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] py-1.5 pl-4 pr-1.5 text-sm font-medium text-white backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/[0.12] hover:shadow-[0_0_25px_rgba(234,72,132,0.35)] ${
        full ? "w-full justify-between" : ""
      }`}
    >
      <span>Hire Me</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary transition-transform duration-300 group-hover:translate-x-0.5">
        <ArrowIcon />
      </span>
    </a>
  );
};
