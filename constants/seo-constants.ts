import { HERO_LOCATION, HERO_NAME, HERO_ROLE } from "./hero-constants";
import { CONTACT_EMAIL, MY_SOCIALS } from "./social-constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rahul0814.github.io"
).replace(/\/$/, "");

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = `${HERO_NAME} | ${HERO_ROLE}`;

export const SITE_TITLE = "Rahul R | Senior DevOps Engineer | AWS, Azure & Cloud Automation";

export const SITE_DESCRIPTION =
  "Rahul R is a Senior DevOps Engineer based in Chennai, India, specializing in AWS, Azure, Kubernetes, Terraform, CI/CD automation, Databricks, and secure cloud infrastructure.";

export const SITE_TAGLINE =
  "Designing, deploying, and operating secure, scalable, and cost-efficient cloud platforms across AWS and Azure.";

export const OG_IMAGE = "/og.jpg";
export const OG_IMAGE_ALT = `${HERO_NAME}, ${HERO_ROLE} portfolio`;
export const OG_LOCALE = "en_US";

export const OG_IMAGES = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: OG_IMAGE_ALT,
  },
];

export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const SITE_KEYWORDS = [
  "Senior DevOps Engineer Chennai",
  "AWS DevOps Engineer",
  "Azure DevOps Engineer",
  "Kubernetes",
  "Amazon EKS",
  "Terraform",
  "Jenkins",
  "GitHub Actions",
  "Databricks",
  "Cloud Infrastructure",
  "CI/CD Automation",
  "Cloud Cost Optimization",
  HERO_NAME,
  HERO_ROLE,
  HERO_LOCATION,
];

export const HOME_TITLE = SITE_TITLE;

export const HOME_DESCRIPTION = SITE_DESCRIPTION;

export const ADMIN_TITLE = "Contact submissions";

export const ADMIN_DESCRIPTION =
  "Private dashboard for contact form submissions. Not part of the public site.";

export const ADMIN_LOGIN_TITLE = "Sign in";

export const ADMIN_LOGIN_DESCRIPTION =
  "Sign in to the private contact submissions dashboard.";

export const SITE_SECTIONS = [
  {
    name: "Home",
    hash: "#home",
    description: `${HERO_NAME}, ${HERO_ROLE} building and engineering reliable cloud platforms.`,
  },
  {
    name: "About",
    hash: "#about",
    description: `Background, stack and technical expertise of ${HERO_NAME}, a ${HERO_ROLE} based in ${HERO_LOCATION}.`,
  },
  {
    name: "Services",
    hash: "#services",
    description:
      "CI/CD release pipelines, Terraform infrastructure as code, Kubernetes on Amazon EKS, and cloud cost optimization.",
  },
  {
    name: "Work",
    hash: "#work",
    description:
      "Platforms built and automated across Databricks, FinOps, Serverless AWS, and Multi-Cloud Terraform.",
  },
  {
    name: "Experience",
    hash: "#experience",
    description: `Career timeline and track record of ${HERO_NAME} at Agilisium, IDC Technologies Solutions, and Accenture.`,
  },
  {
    name: "Contact",
    hash: "#contact",
    description: `Get in touch with ${HERO_NAME} for DevOps, cloud infrastructure, and platform engineering opportunities.`,
  },
] as const;

export const SOCIAL_PROFILES = MY_SOCIALS.map((social) => social.href);

export const CONTACT_POINT_EMAIL = CONTACT_EMAIL;
