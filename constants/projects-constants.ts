import { type Transition } from "motion/react";
import { type Project } from "@/types/portfolio-types";

export const PROJECTS_HEADING = "Platforms I've built & automated.";

export const MY_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Databricks Platform at Scale",
    category: "Data Platform",
    description:
      "Enterprise Databricks platform administration and automation across multiple workspaces, supporting secure data operations, access governance, and production deployment workflows.",
    subDescription: [
      "Managed 15 Databricks workspaces across multiple environments and business platforms.",
      "Implemented automated deployment pipelines using Azure DevOps.",
      "Established service principal authentication, RBAC, and workspace access governance.",
      "Automated Genie and Lakebase deployment workflows across Dev, Test, UAT, and Production.",
    ],
    href: "",
    logo: "/assets/icons/databricks.svg",
    image: "",
    accent: "from-coral/40 to-royal/10",
    tags: [
      { id: 1, name: "Databricks", path: "/assets/icons/databricks.svg" },
      { id: 2, name: "Azure DevOps", path: "/assets/icons/azuredevops.svg" },
      { id: 3, name: "RBAC", path: "/assets/icons/azure.svg" },
      { id: 4, name: "Python", path: "/assets/icons/python.svg" },
    ],
  },
  {
    id: 2,
    title: "~20% Cloud Cost Reduction",
    category: "FinOps",
    description:
      "Optimized cloud infrastructure and managed compute resources to reduce recurring cloud expenditure while maintaining application reliability and performance.",
    subDescription: [
      "Analyzed cloud usage and resource consumption.",
      "Used AWS Cost Explorer and Compute Optimizer to identify optimization opportunities.",
      "Improved compute resource utilization and infrastructure efficiency.",
      "Achieved approximately 20% monthly cloud cost reduction.",
    ],
    href: "",
    logo: "/assets/icons/aws-cost-explorer.svg",
    image: "",
    accent: "from-aqua/40 to-royal/10",
    tags: [
      { id: 1, name: "AWS Cost Explorer", path: "/assets/icons/aws-cost-explorer.svg" },
      { id: 2, name: "Compute Optimizer", path: "/assets/icons/aws-compute-optimizer.svg" },
      { id: 3, name: "EC2 & S3", path: "/assets/icons/aws-ec2.svg" },
      { id: 4, name: "FinOps", path: "/assets/icons/aws.svg" },
    ],
  },
  {
    id: 3,
    title: "Event-Driven Serverless on AWS",
    category: "Serverless",
    description:
      "Designed and implemented scalable, event-driven AWS infrastructure using managed and serverless services to support modern application workloads.",
    subDescription: [
      "Implemented AWS Lambda for serverless application processing.",
      "Integrated API Gateway for application endpoints.",
      "Used Amazon S3 for object storage and event-driven workflows.",
      "Implemented EventBridge for event-based automation and integration.",
    ],
    href: "",
    logo: "/assets/icons/aws-lambda.svg",
    image: "",
    accent: "from-fuchsia/40 to-royal/10",
    tags: [
      { id: 1, name: "AWS Lambda", path: "/assets/icons/aws-lambda.svg" },
      { id: 2, name: "API Gateway", path: "/assets/icons/aws-api-gateway.svg" },
      { id: 3, name: "Amazon S3", path: "/assets/icons/aws-s3.svg" },
      { id: 4, name: "EventBridge", path: "/assets/icons/aws-eventbridge.svg" },
    ],
  },
  {
    id: 4,
    title: "Multi-Cloud Terraform",
    category: "Infrastructure as Code",
    description:
      "Built reusable infrastructure provisioning workflows across AWS and Azure using Terraform to improve consistency, scalability, and deployment reliability.",
    subDescription: [
      "Provisioned AWS infrastructure including VPC, EC2, RDS, S3, and CloudFront.",
      "Automated Azure App Service and Key Vault infrastructure.",
      "Developed reusable and version-controlled Terraform modules.",
      "Standardized infrastructure provisioning across environments.",
    ],
    href: "",
    logo: "/assets/icons/terraform.svg",
    image: "",
    accent: "from-lavender/40 to-royal/10",
    tags: [
      { id: 1, name: "Terraform", path: "/assets/icons/terraform.svg" },
      { id: 2, name: "AWS", path: "/assets/icons/aws.svg" },
      { id: 3, name: "Azure", path: "/assets/icons/azure.svg" },
      { id: 4, name: "Modules", path: "/assets/icons/git.svg" },
    ],
  },
  {
    id: 5,
    title: "Boomi & Model Serving Pipelines",
    category: "Integration CI/CD",
    description:
      "Automated enterprise integration and AI model-serving deployment workflows using modern CI/CD practices and secure infrastructure integrations.",
    subDescription: [
      "Supported Boomi deployment automation.",
      "Implemented Databricks Model Serving deployment workflows.",
      "Configured secure service principal authentication.",
      "Improved deployment consistency through automated validation and environment-based pipelines.",
    ],
    href: "",
    logo: "/assets/icons/boomi.svg",
    image: "",
    accent: "from-sand/40 to-coral/10",
    tags: [
      { id: 1, name: "Dell Boomi", path: "/assets/icons/boomi.svg" },
      { id: 2, name: "Model Serving", path: "/assets/icons/databricks.svg" },
      { id: 3, name: "CI/CD", path: "/assets/icons/azuredevops.svg" },
      { id: 4, name: "Security", path: "/assets/icons/aws-iam.svg" },
    ],
  },
];

export const TILT_SPRING: Transition = { stiffness: 200, damping: 18 };

export const TILT_RANGE: { x: [number, number]; y: [number, number] } = {
  x: [10, -10],
  y: [-14, 14],
};

export const TRACK_SPRING: Transition = { stiffness: 60, damping: 20 };

export const PREVIEW_WINDOW = 1;
