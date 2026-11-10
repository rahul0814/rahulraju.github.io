"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { revealProps } from "@/animations/scroll-animations";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_LINKEDIN,
  CONTACT_GITHUB,
} from "@/constants/portfolio-constants";
import { ContactInfoCard } from "./contact-info-card";

export const ContactDetails: FC = () => (
  <motion.div {...revealProps()} className="lg:col-span-5">
    <p className="text-eyebrow">Let&apos;s Connect</p>
    <h2 className="text-heading mt-3">
      Need reliable cloud? <br />
      <span className="text-gradient">Let&apos;s build it.</span>
    </h2>
    <p className="mt-4 leading-relaxed text-neutral-400">
      Whether you&apos;re automating CI/CD release pipelines, provisioning Terraform infrastructure, optimizing EKS clusters, or cutting cloud costs across AWS and Azure, reach out and let&apos;s make it happen.
    </p>

    <div className="mt-8 space-y-3.5">
      <ContactInfoCard
        icon="✉"
        label="Email"
        value={CONTACT_EMAIL}
        href={`mailto:${CONTACT_EMAIL}`}
        gradient="from-coral/30 to-lavender/30"
      />
      <ContactInfoCard
        icon="⌖"
        label="Location"
        value={CONTACT_LOCATION}
        gradient="from-aqua/30 to-mint/30"
      />
      <ContactInfoCard
        icon="💼"
        label="LinkedIn"
        value="rahul-raju-6856a423a"
        href={CONTACT_LINKEDIN}
        gradient="from-mint/30 to-aqua/30"
      />
      <ContactInfoCard
        icon="⚡"
        label="GitHub"
        value="rahul0814"
        href={CONTACT_GITHUB}
        gradient="from-lavender/30 to-royal/30"
      />
    </div>
  </motion.div>
);
