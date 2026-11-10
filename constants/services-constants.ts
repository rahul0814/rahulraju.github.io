import { type Service } from "@/types/portfolio-types";

export const SERVICES_HEADING = "What I can do for your team.";

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "CI/CD Automation",
    description:
      "Enterprise-grade release automation with end-to-end testing, governance gates, and multi-environment orchestration.",
    icon: "/assets/icons/jenkins.svg",
    bullets: [
      "Multi-environment release pipelines.",
      "Automated validation and approvals.",
      "Boomi and Databricks deployments.",
    ],
  },
  {
    id: 2,
    title: "Cloud Infrastructure as Code",
    description:
      "Scalable, resilient multi-cloud architecture provisioned declaratively with reusable, versioned Terraform modules.",
    icon: "/assets/icons/terraform.svg",
    bullets: [
      "VPC, EC2, RDS, S3, and CloudFront.",
      "Azure App Service and Key Vault.",
      "Reusable, versioned infrastructure modules.",
    ],
  },
  {
    id: 3,
    title: "Containers & Kubernetes",
    description:
      "Production container workloads engineered for high availability, zero-downtime rollouts, and optimized resource footprint.",
    icon: "/assets/icons/kubernetes.svg",
    bullets: [
      "Dockerfile and container image optimization.",
      "Amazon EKS deployments.",
      "Cluster health monitoring and troubleshooting.",
    ],
  },
  {
    id: 4,
    title: "Security, Monitoring & Cost",
    description:
      "Full-stack observability, cloud posture compliance, and FinOps practices that reduce recurring cloud expenditure.",
    icon: "/assets/icons/aws-cloudwatch.svg",
    bullets: [
      "IAM, WAF, NACLs, and CloudTrail.",
      "CloudWatch, Splunk, and Grafana alerts.",
      "Cost Explorer and Compute Optimizer.",
    ],
  },
];
