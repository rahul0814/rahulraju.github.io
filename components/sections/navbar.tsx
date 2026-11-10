"use client";

import { useState, type FC } from "react";
import { HireMeButton } from "@/components/navbar/hire-me-button";
import { MobileMenu } from "@/components/navbar/mobile-menu";
import { NavBrand } from "@/components/navbar/nav-brand";
import { NavLink } from "@/components/navbar/nav-link";
import {
  NAV_ITEMS,
  NAV_SCROLLED_AT,
} from "@/constants/navigation-constants";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";

export const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrolled(NAV_SCROLLED_AT);
  const active = useActiveSection();

  return (
    <header className="reveal-down fixed inset-x-0 top-3 sm:top-5 z-40 flex justify-center px-4 sm:px-6 pointer-events-none transition-all duration-500">
      <div
        className={`pointer-events-auto relative flex items-center justify-between gap-3 sm:gap-6 rounded-full border px-4 sm:px-6 py-2 transition-all duration-500 max-w-5xl w-full ${
          scrolled
            ? "border-white/20 bg-[#06091f]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)]"
            : "border-white/15 bg-[#06091f]/60 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:border-white/25"
        }`}
      >
        <NavBrand />

        <nav className="hidden sm:flex items-center">
          <ul className="flex items-center gap-1 md:gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={active === item.href}
              />
            ))}
          </ul>
        </nav>

        <div className="hidden items-center sm:flex">
          <HireMeButton />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex cursor-pointer text-neutral-300 hover:text-white sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <img
            src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
            className="h-6 w-6"
            alt=""
          />
        </button>
      </div>

      <MobileMenu
        open={isOpen}
        active={active}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
};
