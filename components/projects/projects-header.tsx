import { type FC } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { padIndex } from "@/helpers/format-helpers";

export const ProjectsHeader: FC<{ total: number }> = ({ total }) => (
  <div className="c-space pt-24 md:pt-32">
    <SectionHeader
      eyebrow={`Selected Work · ${padIndex(total)}`}
      title={
        <>
          Platforms I&apos;ve built &amp;{" "}
          <span className="text-gradient">automated.</span>
        </>
      }
      hint={["Scroll", "Pinned"]}
    />
  </div>
);
