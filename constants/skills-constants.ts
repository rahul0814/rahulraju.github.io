export type SkillCategoryId =
  | "all"
  | "cloud"
  | "containers"
  | "cicd"
  | "serverless"
  | "observability";

export interface SkillCategoryOption {
  id: SkillCategoryId;
  label: string;
  count: number;
}

export interface SkillItem {
  name: string;
  icon: string;
  category: SkillCategoryId;
  tag: string;
  description: string;
  accent: string;
}

export const SKILL_CATEGORIES: SkillCategoryOption[] = [
  { id: "all", label: "All Skills", count: 23 },
  { id: "cloud", label: "Cloud & OS", count: 3 },
  { id: "containers", label: "IaC & Containers", count: 4 },
  { id: "cicd", label: "CI/CD & GitOps", count: 5 },
  { id: "serverless", label: "Serverless & Data", count: 5 },
  { id: "observability", label: "Observability & SRE", count: 6 },
];

export const SKILLS: SkillItem[] = [
  {
    name: "AWS",
    icon: "/assets/icons/aws.svg",
    category: "cloud",
    tag: "Primary Cloud",
    description: "VPC, IAM, EC2, S3, RDS, Transit Gateway, Cost Explorer",
    accent: "from-amber-500/25 to-orange-500/25",
  },
  {
    name: "Azure",
    icon: "/assets/icons/azure.svg",
    category: "cloud",
    tag: "Enterprise Cloud",
    description: "Virtual Networks, Entra ID, Resource Groups, Azure Monitor",
    accent: "from-blue-500/25 to-cyan-500/25",
  },
  {
    name: "Linux",
    icon: "/assets/icons/linux.svg",
    category: "cloud",
    tag: "Systems & Shell",
    description: "RHEL, Ubuntu, Kernel tuning, Shell scripting, Systemd",
    accent: "from-yellow-500/25 to-amber-500/25",
  },
  {
    name: "Terraform",
    icon: "/assets/icons/terraform.svg",
    category: "containers",
    tag: "Infrastructure as Code",
    description: "Multi-cloud modules, remote state locking, drift detection",
    accent: "from-purple-500/25 to-indigo-500/25",
  },
  {
    name: "Kubernetes",
    icon: "/assets/icons/kubernetes.svg",
    category: "containers",
    tag: "Container Orchestration",
    description: "Ingress, Helm charts, RBAC, HPA, Network Policies",
    accent: "from-blue-500/25 to-indigo-500/25",
  },
  {
    name: "Amazon EKS",
    icon: "/assets/icons/aws-eks.svg",
    category: "containers",
    tag: "Managed Kubernetes",
    description: "Managed node groups, IRSA, Cluster Autoscaler, CoreDNS",
    accent: "from-orange-500/25 to-amber-500/25",
  },
  {
    name: "Docker",
    icon: "/assets/icons/docker.svg",
    category: "containers",
    tag: "Container Runtime",
    description: "Multi-stage builds, rootless containers, registry security",
    accent: "from-sky-500/25 to-blue-500/25",
  },
  {
    name: "Jenkins",
    icon: "/assets/icons/jenkins.svg",
    category: "cicd",
    tag: "Pipeline Orchestration",
    description: "Shared libraries, declarative pipelines, distributed agents",
    accent: "from-red-500/25 to-amber-500/25",
  },
  {
    name: "GitHub Actions",
    icon: "/assets/icons/githubactions.svg",
    category: "cicd",
    tag: "Workflow Automation",
    description: "Custom composite actions, matrix builds, OIDC authentication",
    accent: "from-slate-500/25 to-neutral-500/25",
  },
  {
    name: "Azure DevOps",
    icon: "/assets/icons/azuredevops.svg",
    category: "cicd",
    tag: "Enterprise CI/CD",
    description: "YAML multi-stage pipelines, service connections, release gates",
    accent: "from-blue-500/25 to-sky-500/25",
  },
  {
    name: "AWS CodePipeline",
    icon: "/assets/icons/aws-codepipeline.svg",
    category: "cicd",
    tag: "AWS Native Delivery",
    description: "CodeBuild, CodeDeploy, automated canary rollouts",
    accent: "from-orange-500/25 to-rose-500/25",
  },
  {
    name: "Git",
    icon: "/assets/icons/git.svg",
    category: "cicd",
    tag: "Version Control & GitOps",
    description: "GitFlow, trunk-based development, signed commits, semantic tags",
    accent: "from-rose-500/25 to-red-500/25",
  },
  {
    name: "Lambda",
    icon: "/assets/icons/aws-lambda.svg",
    category: "serverless",
    tag: "Serverless Compute",
    description: "Event-driven microservices, Lambda layers, provisioned concurrency",
    accent: "from-amber-500/25 to-orange-500/25",
  },
  {
    name: "API Gateway",
    icon: "/assets/icons/aws-api-gateway.svg",
    category: "serverless",
    tag: "API Management",
    description: "REST & HTTP APIs, Cognito authorizers, throttling & rate limits",
    accent: "from-rose-500/25 to-pink-500/25",
  },
  {
    name: "EventBridge",
    icon: "/assets/icons/aws-eventbridge.svg",
    category: "serverless",
    tag: "Event-Driven Bus",
    description: "Cross-account routing, custom rules, schema registry, DLQs",
    accent: "from-purple-500/25 to-violet-500/25",
  },
  {
    name: "Dell Boomi",
    icon: "/assets/icons/boomi.svg",
    category: "serverless",
    tag: "Enterprise iPaaS",
    description: "AtomSphere runtime, API management, automated deployment pipelines",
    accent: "from-blue-500/25 to-teal-500/25",
  },
  {
    name: "Python",
    icon: "/assets/icons/python.svg",
    category: "serverless",
    tag: "Scripting & Automation",
    description: "Boto3, infrastructure automation, CLI utilities, REST integrations",
    accent: "from-yellow-500/25 to-blue-500/25",
  },
  {
    name: "Databricks",
    icon: "/assets/icons/databricks.svg",
    category: "observability",
    tag: "Data Platform",
    description: "15 workspaces managed, Unity Catalog governance, cluster policies",
    accent: "from-red-500/25 to-orange-500/25",
  },
  {
    name: "Collibra",
    icon: "/assets/icons/collibra.svg",
    category: "observability",
    tag: "Data Governance",
    description: "Enterprise data catalog, metadata ingestion, lineage tracking",
    accent: "from-emerald-500/25 to-teal-500/25",
  },
  {
    name: "Prometheus",
    icon: "/assets/icons/prometheus.svg",
    category: "observability",
    tag: "Time-Series Metrics",
    description: "PromQL queries, custom scrape targets, Alertmanager routing",
    accent: "from-orange-500/25 to-red-500/25",
  },
  {
    name: "Grafana",
    icon: "/assets/icons/grafana.svg",
    category: "observability",
    tag: "Telemetry Visualization",
    description: "SLO/SLA dashboards, alert thresholds, multi-datasource panels",
    accent: "from-amber-500/25 to-orange-500/25",
  },
  {
    name: "Splunk",
    icon: "/assets/icons/splunk.svg",
    category: "observability",
    tag: "Log Analytics & SIEM",
    description: "Universal forwarders, SPL searches, incident forensics & audits",
    accent: "from-emerald-500/25 to-lime-500/25",
  },
  {
    name: "CloudWatch",
    icon: "/assets/icons/aws-cloudwatch.svg",
    category: "observability",
    tag: "AWS Telemetry",
    description: "Metric filters, composite alarms, CloudWatch Logs Insights",
    accent: "from-pink-500/25 to-rose-500/25",
  },
];

export const SKILL_CHIPS: string[] = SKILLS.map((skill) => skill.name);
