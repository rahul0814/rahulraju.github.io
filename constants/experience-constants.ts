import { type Experience } from "@/types/portfolio-types";

export const EXPERIENCE_HEADING = "A track record of shipping & scaling.";

export const EXPERIENCES: Experience[] = [
  {
    title: "Senior DevOps Engineer",
    job: "Agilisium · Chennai, India",
    date: "July 2025 – Present",
    contents: [
      "Administered Databricks workspaces and managed RBAC and access governance.",
      "Developed and maintained Jenkins, GitHub Actions, and Azure DevOps pipelines across Dev, Test, UAT, and Production.",
      "Provisioned AWS and Azure infrastructure using Terraform.",
      "Managed Kubernetes and Amazon EKS deployments and operations.",
      "Implemented serverless architectures using Lambda, API Gateway, S3, and EventBridge.",
      "Managed infrastructure security using IAM, WAF, and CloudTrail.",
      "Reduced monthly cloud costs by approximately 20% using Cost Explorer and Compute Optimizer.",
      "Implemented Boomi and Databricks Model Serving CI/CD workflows.",
    ],
  },
  {
    title: "DevOps Engineer",
    job: "Agilisium · Chennai, India",
    date: "August 2022 – June 2025",
    contents: [
      "Designed and maintained highly available AWS infrastructure.",
      "Built optimized Docker images and deployed microservices on Amazon EKS.",
      "Developed reusable Terraform modules for infrastructure provisioning.",
      "Implemented infrastructure backup and disaster recovery strategies.",
      "Configured cross-region replication and S3 lifecycle management policies.",
    ],
  },
  {
    title: "Application Support Engineer",
    job: "IDC Technologies Solutions",
    date: "February 2021 – August 2022",
    contents: [
      "Implemented Grafana monitoring and application health visibility.",
      "Performed incident root cause analysis and application smoke testing.",
      "Managed SLA-driven incident resolution.",
      "Collaborated with development teams, QA teams, and external vendors.",
    ],
  },
  {
    title: "Associate",
    job: "Accenture · Chennai, India",
    date: "July 2019 – February 2021",
    contents: [
      "Managed Windows infrastructure for enterprise users.",
      "Administered Active Directory and Group Policy.",
      "Supported Microsoft 365 administration.",
      "Managed system patching and infrastructure maintenance.",
    ],
  },
];
