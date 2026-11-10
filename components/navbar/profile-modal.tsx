"use client";

import { useEffect, useSyncExternalStore, type FC } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HERO_NAME } from "@/constants/hero-constants";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export const ProfileModal: FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Close on Escape key press & lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${HERO_NAME} Profile`}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] overflow-hidden rounded-3xl border border-white/20 bg-[#070b1e]/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-cyan-400/25"
          >
            {/* Ambient decorative glow */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-royal/30 blur-3xl" />

            {/* Photo Container */}
            <div className="relative aspect-[318/320] w-full overflow-hidden rounded-2xl border border-white/15 bg-midnight shadow-2xl">
              <Image
                src="/assets/profile-photo.png"
                alt={HERO_NAME}
                fill
                sizes="(max-width: 640px) 320px, 360px"
                className="object-cover object-center select-none"
                priority
                unoptimized
              />

              {/* Close Button in top-right corner */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/90 hover:border-white/50 cursor-pointer shadow-lg active:scale-95"
                aria-label="Close modal"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

            {/* Profile Info Below Photo */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {HERO_NAME}
              </h3>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                DevOps &amp; Cloud Platform Engineer
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
