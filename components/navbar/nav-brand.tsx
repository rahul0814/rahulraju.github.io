"use client";

import { useState, type FC, type MouseEvent } from "react";
import Image from "next/image";
import { HERO_NAME } from "@/constants/hero-constants";
import { goToAnchor } from "@/helpers/scroll-helpers";
import { ProfileModal } from "./profile-modal";

export const NavBrand: FC = () => {
  const [showPhoto, setShowPhoto] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2.5">
        {/* Profile Avatar Button with Photo */}
        <button
          type="button"
          onClick={() => setShowPhoto(true)}
          className="group relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-midnight/80 p-0.5 shadow-md shadow-royal/30 transition-all duration-300 hover:scale-105 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(51,194,204,0.4)] cursor-pointer"
          title="Click to view profile photo"
          aria-label="View Rahul's profile photo"
        >
          <Image
            src="/assets/avatar.png"
            alt={HERO_NAME}
            width={36}
            height={36}
            className="h-full w-full rounded-lg object-cover"
            priority
            unoptimized
          />
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15 transition-opacity group-hover:opacity-100" />
        </button>

        {/* Name link that smoothly scrolls to #home */}
        <a
          href="#home"
          onClick={(event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            goToAnchor("#home");
          }}
          className="text-base font-semibold tracking-tight text-white transition-colors hover:text-cyan-400"
        >
          <span className="hidden sm:inline">{HERO_NAME}</span>
        </a>
      </div>

      {/* Modal Popup Viewer */}
      <ProfileModal isOpen={showPhoto} onClose={() => setShowPhoto(false)} />
    </>
  );
};
