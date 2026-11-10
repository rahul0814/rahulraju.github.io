"use client";

import { type FC, type MouseEvent } from "react";
import { motion } from "motion/react";
import { SPRING_SNAPPY } from "@/animations/ui-animations";
import { goToAnchor } from "@/helpers/scroll-helpers";
import { type NavLinkProps } from "@/types/navigation-types";

export const NavLink: FC<NavLinkProps> = ({
  href,
  label,
  active,
  onClick,
}) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      goToAnchor(href);
    }
    onClick?.();
  };

  return (
    <li className="relative">
      <a
        href={href}
        onClick={handleClick}
        aria-current={active ? "page" : undefined}
        className={`relative block rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 md:text-sm md:tracking-normal md:capitalize ${
          active
            ? "text-white"
            : "text-white/65 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        {label}
        {active && (
          <motion.span
            layoutId="active-nav"
            transition={SPRING_SNAPPY}
            className="absolute inset-0 -z-10 rounded-full border border-white/20 bg-white/[0.12] shadow-[0_0_20px_rgba(122,87,219,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          />
        )}
      </a>
    </li>
  );
};
