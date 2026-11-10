"use client";

import { useId, type FC, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TechPill {
  name: string;
  icon: string;
}

interface TechGroup {
  title: string;
  subtitle: string;
  items: TechPill[];
}

const TECH_GROUPS: TechGroup[] = [
  {
    title: "Cloud",
    subtitle: "AWS and Azure",
    items: [
      { name: "AWS", icon: "/assets/icons/aws.svg" },
      { name: "EC2", icon: "/assets/icons/aws-ec2.svg" },
      { name: "S3", icon: "/assets/icons/aws-s3.svg" },
      { name: "VPC", icon: "/assets/icons/aws-vpc.svg" },
      { name: "RDS", icon: "/assets/icons/aws-rds.svg" },
      { name: "CloudFront", icon: "/assets/icons/aws-cloudfront.svg" },
      { name: "Lambda", icon: "/assets/icons/aws-lambda.svg" },
      { name: "API Gateway", icon: "/assets/icons/aws-api-gateway.svg" },
      { name: "EventBridge", icon: "/assets/icons/aws-eventbridge.svg" },
      { name: "IAM", icon: "/assets/icons/aws-iam.svg" },
      { name: "WAF", icon: "/assets/icons/aws-waf.svg" },
      { name: "Azure App Service", icon: "/assets/icons/azure.svg" },
      { name: "Azure Key Vault", icon: "/assets/icons/azure.svg" },
    ],
  },
  {
    title: "CI/CD",
    subtitle: "pipelines",
    items: [
      { name: "Jenkins", icon: "/assets/icons/jenkins.svg" },
      { name: "GitHub Actions", icon: "/assets/icons/githubactions.svg" },
      { name: "Azure DevOps", icon: "/assets/icons/azuredevops.svg" },
      { name: "CodePipeline", icon: "/assets/icons/aws-codepipeline.svg" },
      { name: "CodeBuild", icon: "/assets/icons/aws-codebuild.svg" },
      { name: "Git", icon: "/assets/icons/git.svg" },
      { name: "Bitbucket", icon: "/assets/icons/bitbucket.svg" },
    ],
  },
  {
    title: "Containers and IaC",
    subtitle: "platform",
    items: [
      { name: "Docker", icon: "/assets/icons/docker.svg" },
      { name: "Kubernetes", icon: "/assets/icons/kubernetes.svg" },
      { name: "Amazon EKS", icon: "/assets/icons/aws-eks.svg" },
      { name: "Terraform", icon: "/assets/icons/terraform.svg" },
    ],
  },
  {
    title: "Data and integration",
    subtitle: "platforms",
    items: [
      { name: "Databricks", icon: "/assets/icons/databricks.svg" },
      { name: "Dell Boomi", icon: "/assets/icons/boomi.svg" },
      { name: "Collibra", icon: "/assets/icons/collibra.svg" },
    ],
  },
  {
    title: "Monitoring",
    subtitle: "observability",
    items: [
      { name: "Prometheus", icon: "/assets/icons/prometheus.svg" },
      { name: "Grafana", icon: "/assets/icons/grafana.svg" },
      { name: "Splunk", icon: "/assets/icons/splunk.svg" },
      { name: "CloudWatch", icon: "/assets/icons/aws-cloudwatch.svg" },
      { name: "Python", icon: "/assets/icons/python.svg" },
      { name: "Linux", icon: "/assets/icons/linux.svg" },
    ],
  },
];

interface RatingMetric {
  name: string;
  level: "Expert" | "Advanced";
  score: number;
}

const RATING_METRICS: RatingMetric[] = [
  { name: "Cloud", level: "Expert", score: 88 },
  { name: "CI/CD", level: "Expert", score: 88 },
  { name: "Containers and IaC", level: "Expert", score: 86 },
  { name: "Data and integration", level: "Advanced", score: 80 },
  { name: "Monitoring", level: "Advanced", score: 80 },
  { name: "Scripting and tools", level: "Advanced", score: 72 },
];

const RadarChart: FC = () => {
  const gradientId = useId();
  const filterId = useId();

  const cx = 175;
  const cy = 150;
  const maxR = 86;

  // 6 vertices at angles: -90, -30, 30, 90, 150, 210 degrees
  const angles = [
    -Math.PI / 2,
    -Math.PI / 6,
    Math.PI / 6,
    Math.PI / 2,
    (5 * Math.PI) / 6,
    (-5 * Math.PI) / 6,
  ];

  const getPolygonPoints = (radius: number) =>
    angles
      .map((a) => {
        const x = cx + radius * Math.cos(a);
        const y = cy + radius * Math.sin(a);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  // Calculate polygon points based on actual scores (normalized to maxR)
  const dataPoints = RATING_METRICS.map((metric, i) => {
    const r = (metric.score / 100) * maxR;
    const a = angles[i];
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  });

  const dataPolygonString = dataPoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Labels positioning
  const labelsConfig: {
    label: string;
    score: number;
    x: number;
    y: number;
    anchor: "middle" | "start" | "end";
  }[] = [
    { label: "Cloud", score: 88, x: cx, y: cy - maxR - 18, anchor: "middle" },
    {
      label: "CI/CD",
      score: 88,
      x: cx + maxR * Math.cos(angles[1]) + 16,
      y: cy + maxR * Math.sin(angles[1]) - 4,
      anchor: "start",
    },
    {
      label: "Containers and IaC",
      score: 86,
      x: cx + maxR * Math.cos(angles[2]) + 16,
      y: cy + maxR * Math.sin(angles[2]) + 10,
      anchor: "start",
    },
    {
      label: "Data and integration",
      score: 80,
      x: cx,
      y: cy + maxR + 24,
      anchor: "middle",
    },
    {
      label: "Monitoring",
      score: 80,
      x: cx + maxR * Math.cos(angles[4]) - 16,
      y: cy + maxR * Math.sin(angles[4]) + 10,
      anchor: "end",
    },
    {
      label: "Scripting and tools",
      score: 72,
      x: cx + maxR * Math.cos(angles[5]) - 16,
      y: cy + maxR * Math.sin(angles[5]) - 4,
      anchor: "end",
    },
  ];

  return (
    <div className="relative mx-auto flex w-full max-w-[370px] items-center justify-center py-2">
      <svg
        viewBox="0 0 350 310"
        className="w-full overflow-visible select-none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#33c2cc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7a57db" stopOpacity="0.25" />
          </linearGradient>

          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="8"
              floodColor="#33c2cc"
              floodOpacity="0.75"
            />
          </filter>
        </defs>

        {/* Semi-transparent dark circular backdrop for high contrast against rotating orbital rings */}
        <circle
          cx={cx}
          cy={cy}
          r={maxR + 10}
          fill="rgba(6, 9, 31, 0.7)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeDasharray="3 3"
        />

        {/* Concentric grid rings */}
        {[0.35, 0.68, 1.0].map((scale) => (
          <polygon
            key={scale}
            points={getPolygonPoints(maxR * scale)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
        ))}

        {/* Spoke lines from center */}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(a)}
            y2={cy + maxR * Math.sin(a)}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={dataPolygonString}
          fill={`url(#${gradientId})`}
          stroke="#33c2cc"
          strokeWidth="2.5"
          filter={`url(#${filterId})`}
        />

        {/* Vertex dots */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="7"
              fill="#33c2cc"
              opacity="0.25"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#33c2cc"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Labels & scores */}
        {labelsConfig.map((item, i) => (
          <g key={i}>
            <text
              x={item.x}
              y={item.y}
              textAnchor={item.anchor}
              className="fill-neutral-200 text-[11px] font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {item.label}
            </text>
            <text
              x={item.x}
              y={item.y + 13}
              textAnchor={item.anchor}
              className="fill-cyan-400 font-mono text-[11px] font-bold drop-shadow-[0_0_8px_rgba(51,194,204,0.6)]"
            >
              {item.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* 3D Tilt Category Card with Depth and Specular Sheen */
const TechCategoryCard: FC<{ group: TechGroup; groupIndex: number }> = ({
  group,
  groupIndex,
}) => {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [6, -6]),
    { stiffness: 220, damping: 22 }
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-8, 8]),
    { stiffness: 220, damping: 22 }
  );

  const sheenBg = useTransform(
    [pointerX, pointerY],
    ([x, y]) =>
      `radial-gradient(450px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(51, 194, 204, 0.15), transparent 45%)`
  );

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - bounds.left) / bounds.width);
    pointerY.set((e.clientY - bounds.top) / bounds.height);
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div style={{ perspective: "1000px" }} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: groupIndex * 0.07 }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-2xl border border-white/10 bg-[#06091f]/70 p-5 md:p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-white/25 overflow-hidden"
      >
        {/* Specular sheen follows cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheenBg }}
        />

        {/* Ambient subtle corner glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-aqua/10 blur-2xl transition-opacity group-hover:bg-aqua/20" />

        {/* Card Header (Elevated in 3D) */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-aqua shadow-[0_0_8px_rgba(51,194,204,0.8)]" />
            <h4 className="text-base font-bold tracking-tight text-white md:text-lg">
              {group.title}
            </h4>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            {group.subtitle}
          </span>
        </div>

        {/* Badges Flex Grid (Elevated in 3D) */}
        <div
          style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          className="relative flex flex-wrap gap-2.5"
        >
          {group.items.map((item) => (
            <div
              key={item.name}
              style={{ transformStyle: "preserve-3d" }}
              className="group/badge inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105 hover:border-aqua/40 hover:bg-white/[0.1] hover:shadow-[0_0_15px_rgba(51,194,204,0.3)] hover:-translate-y-0.5 cursor-default"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-black/50 border border-white/10 p-1 transition-transform duration-300 group-hover/badge:scale-110">
                <img
                  src={item.icon}
                  alt=""
                  className="h-4 w-4 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-medium text-white/90 whitespace-nowrap group-hover/badge:text-white">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* 3D Tilt Tech Stack Rating Card with Orbital Concentric Rings (Matching Platforms Section) */
const TechRatingCard: FC = () => {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [9, -9]),
    { stiffness: 200, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-12, 12]),
    { stiffness: 200, damping: 20 }
  );

  const sheenBg = useTransform(
    [pointerX, pointerY],
    ([x, y]) =>
      `radial-gradient(550px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(51, 194, 204, 0.18), transparent 45%)`
  );

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - bounds.left) / bounds.width);
    pointerY.set((e.clientY - bounds.top) / bounds.height);
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div style={{ perspective: "1400px" }} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-3xl border border-white/15 bg-[#06091f]/85 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-colors duration-300 hover:border-white/30"
      >
        {/* Specular sheen reflection follows cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheenBg }}
        />

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aqua/15 via-royal/10 to-transparent opacity-60 rounded-3xl" />

        {/* Header - 3D elevated */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className="relative flex items-center justify-between border-b border-white/10 pb-4"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-aqua opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-aqua" />
            </span>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Tech stack rating
            </h3>
          </div>
          <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur-md">
            Self-assessed, /100
          </span>
        </div>

        {/* Radar Spider Chart with 3D Concentric Orbiting Rings */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Ambient radial glow backdrop */}
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-gradient-to-tr from-aqua/20 via-royal/20 to-lavender/25 blur-3xl" />

          {/* Outer spinning dashed ring with cyan satellite bead */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="pointer-events-none absolute h-64 w-64 rounded-full border border-dashed border-white/20 animate-[spin_32s_linear_infinite]"
          >
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-aqua shadow-[0_0_12px_rgba(51,194,204,0.95)]" />
            <span className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-royal shadow-[0_0_10px_rgba(92,51,204,0.9)]" />
          </div>

          {/* Middle reverse spinning ring with coral & mint satellite beads */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className="pointer-events-none absolute h-48 w-48 rounded-full border border-white/15 animate-[spin_24s_linear_infinite_reverse]"
          >
            <span className="absolute top-1/2 -left-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_10px_rgba(234,72,132,0.9)]" />
            <span className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_10px_rgba(87,219,150,0.9)]" />
          </div>

          {/* Inner dotted ring */}
          <div
            style={{ transform: "translateZ(70px)" }}
            className="pointer-events-none absolute h-36 w-36 rounded-full border border-dotted border-white/25 animate-[spin_16s_linear_infinite]"
          />

          {/* Foreground Radar Chart elevated in 3D */}
          <div
            style={{ transform: "translateZ(90px)", transformStyle: "preserve-3d" }}
            className="relative z-10 w-full"
          >
            <RadarChart />
          </div>
        </div>

        {/* Progress Bars Grid - 3D elevated */}
        <div
          style={{ transform: "translateZ(50px)" }}
          className="relative mt-4 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-white/10 pt-4 sm:grid-cols-2"
        >
          {/* Left Column */}
          <div className="space-y-4">
            {[RATING_METRICS[0], RATING_METRICS[2], RATING_METRICS[4]].map(
              (item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white/90">
                      {item.name}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {item.level}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-royal shadow-[0_0_8px_rgba(51,194,204,0.6)]"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[RATING_METRICS[1], RATING_METRICS[3], RATING_METRICS[5]].map(
              (item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white/90">
                      {item.name}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {item.level}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-royal shadow-[0_0_8px_rgba(51,194,204,0.6)]"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Vignette & Corner Highlights */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.45),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      </motion.div>
    </div>
  );
};

export const TechStack: FC = () => {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Categorized Skill Cards with 3D Tilt */}
        <div className="space-y-4 lg:col-span-7">
          {TECH_GROUPS.map((group, groupIndex) => (
            <TechCategoryCard
              key={group.title}
              group={group}
              groupIndex={groupIndex}
            />
          ))}
        </div>

        {/* Right Column: Tech Stack Rating Card with 3D Tilt & Orbital Rings */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <TechRatingCard />
        </div>
      </div>
    </div>
  );
};
