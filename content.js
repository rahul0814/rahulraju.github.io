/* =========================================================================
   YOUR PORTFOLIO CONTENT
   -------------------------------------------------------------------------
   This is the only file you need to edit. Save it, redeploy, done.

   Quick rules
   - Text in "quotes". Keep the commas between items.
   - Dates are "YYYY-MM" (for example "2025-06"). Leave end as "" for Present.
   - Wrap words in **double stars** to make them bold.
   - These tokens fill in automatically anywhere in text:
       {years}  your years of experience (profile.experienceYears, or worked
                out from your first job if you leave that empty)
       {roles}  number of jobs in experience
       {certs}  number of certifications
       {companies}  number of different companies
   - icon / logo can be a known name (aws, docker, kubernetes, terraform,
     jenkins, gitlab, github, grafana, prometheus, python, bash, linux, git,
     ansible, helm, argocd, azure, gcp, nginx, vault, go, java, nodejs, mysql,
     postgresql, redis, mongodb, elasticsearch, vscode, jira, sonarqube,
     kafka, apache, ubuntu, redhat, powershell, windows, yaml, githubactions,
     and AWS services: aws-lambda, aws-api-gateway, aws-s3, aws-ec2, aws-rds,
     aws-vpc, aws-cloudfront, aws-cloudformation, aws-codepipeline,
     aws-cloudwatch, aws-sns, aws-config),
     an image path like "assets/img/projects/my-shot.png", or a full URL.
     Official logos for those names are already in assets/img/icons/.
     For a new logo, save it as assets/img/icons/your-name.svg and use
     icon: "your-name". No logo file? A neat text badge appears instead.
   - Missing images never break the page: a generated badge is shown.

   See HOW-TO-UPDATE.md for copy-paste examples.
   ========================================================================= */

window.PORTFOLIO = {

  /* ---------- the basics ---------- */
  profile: {
    name: "Rahul R",
    logoText: "rahul.r",
    role: "Senior DevOps Engineer",
    company: "Agilisium",
    location: "Chennai, Tamil Nadu",
    email: "rahulraju0814@gmail.com",
    phone: "+91 90808 97961",
    avatar: "assets/img/profile.jpg",   // small round photo next to your name in the top bar; click it to see it full size ("" shows the R logo)
    photo: "",   // e.g. "assets/img/profile.jpg" to show your photo in the hero; "" shows the glowing sphere
    experienceYears: "6.4",     // shown wherever {years} appears; leave "" to calculate automatically
    resume: "https://drive.google.com/file/d/1TKfBpgg4ZDDX4ho0O-zGJo1x6QhKlb8h/view",    // your resume on Google Drive (or "assets/resume/Rahul_R_Resume.pdf" for the copy inside the site)
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/rahul-raju-6856a423a/", icon: "linkedin", handle: "rahul-raju" },
      { label: "GitHub",   url: "https://github.com/rahul0814", icon: "github", handle: "rahul0814" }
      // { label: "Medium", url: "https://medium.com/@you", icon: "link", handle: "@you" },
    ]
  },

  /* ---------- order of sections on the page (and in the menu) ----------
     Remove an id to hide a section. Add the id of a custom section
     (see customSections at the bottom) to show it.                        */
  sections: ["about", "experience", "projects", "skills", "certifications", "education", "contact"],

  /* ---------- top of the page ---------- */
  hero: {
    status: "**Senior DevOps Engineer** at Agilisium, Chennai",
    headline: "I turn commits into reliable cloud releases.",
    intro: "I’m **Rahul R**, a DevOps engineer with {years} years of hands-on experience building secure, scalable and cost-efficient platforms on **AWS** and **Azure**: CI/CD pipelines, Terraform infrastructure, Kubernetes on Amazon EKS and Databricks workspaces for pharmaceutical and enterprise teams.",
    typedCommands: [
      "databricks bundle deploy -t prod",
      "terraform apply -auto-approve",
      "kubectl rollout status deploy/api -n prod",
      "gh workflow run deploy.yml -f env=uat",
      "aws compute-optimizer get-ec2-instance-recommendations"
    ],
    buttons: [
      { label: "See my experience", href: "#experience", style: "primary" },
      { label: "Download resume", href: "resume", style: "ghost", icon: "download" }   // "resume" uses profile.resume
    ],
    orbit: ["aws", "azure", "kubernetes", "docker", "terraform", "jenkins", "githubactions", "databricks"],   // 3 to 8 logos work best

    // optional DevOps infinity loop in the middle of the orb (set show: true to turn it on)
    loop: {
      show: false,
      left: "DEV",
      right: "OPS",
      phases: ["plan", "code", "build", "test", "release", "deploy", "operate", "monitor"]   // exactly 8
    }
  },

  pipeline: {
    show: true,
    stages: ["Commit", "Build", "Test", "Scan", "Deploy", "Monitor"]
  },

  marquee: ["AWS", "Azure", "Terraform", "Kubernetes", "Amazon EKS", "Docker", "Jenkins", "GitHub Actions", "Azure DevOps", "Databricks", "Lambda", "Prometheus", "Grafana", "Splunk", "CloudWatch"],

  /* ---------- about ---------- */
  about: {
    title: "Automation first, reliability always.",
    paragraphs: [
      "I design, deploy and run cloud infrastructure on AWS and Azure that stays secure, scales with demand and doesn’t waste money. Most of my work is CI/CD automation with Jenkins, GitHub Actions, Azure DevOps and AWS CodePipeline, Infrastructure as Code with Terraform, and containers on Docker, Kubernetes and Amazon EKS.",
      "Today I administer 15 Databricks workspaces, build serverless, event-driven systems with Lambda, API Gateway and EventBridge, and keep a close eye on cost and reliability. I enjoy working with cross-functional teams to deliver dependable cloud solutions for pharmaceutical and enterprise applications."
    ],
    stats: [
      { value: "{years}", label: "years of hands-on experience" },
      { value: "15",       label: "Databricks workspaces administered" },
      { value: "~20%",     label: "monthly cloud cost cut through optimisation" },
      { value: "{certs}",  label: "professional certifications" }
    ],
    interestsTitle: "What I like working on",
    interests: ["DevSecOps", "CI/CD automation", "Cloud security", "Cloud cost optimisation", "Containers and orchestration", "Infrastructure as Code", "Data platforms and Databricks", "Monitoring and observability"]
  },

  /* ---------- experience (newest first) ---------- */
  experience: {
    title: "Building and running cloud platforms at scale.",
    subtitle: "{years} years of hands-on experience designing, automating and operating secure AWS and Azure infrastructure for enterprise teams.",
    items: [
      {
        role: "Senior DevOps Engineer",
        company: "Agilisium",
        url: "https://www.agilisium.com",
        location: "Chennai",
        start: "2025-07",
        end: "",
        points: [
          "Administer 15 Databricks workspaces across environments, covering availability, user onboarding, permission clean-ups and role-based access control across catalogs and schemas.",
          "Design and maintain CI/CD pipelines in Jenkins, GitHub Actions and Azure DevOps that build, validate, provision infrastructure and deploy across Dev, Test, UAT and Production.",
          "Build and optimise Dockerfiles and images, deploy to Kubernetes and Amazon EKS, and troubleshoot cluster health and workloads.",
          "Provision AWS and Azure infrastructure with Terraform: VPC, EC2, S3, RDS, CloudFront, API Gateway, Lambda, Azure App Service and Key Vault.",
          "Design serverless, event-driven architectures with AWS Lambda, API Gateway, S3 and EventBridge.",
          "Apply AWS security best practices: least-privilege IAM, Security Groups, NACLs, AWS WAF and CloudTrail.",
          "Set up centralised monitoring, logging and alerting with Amazon CloudWatch and Splunk for faster incident detection.",
          "Cut monthly cloud costs by about **20%** using AWS Cost Explorer and AWS Compute Optimizer.",
          "Automate Dell Boomi integration deployments and Databricks Model Serving endpoint integrations through CI/CD.",
          "Introduced Databricks Asset Bundles (DABs) with environment-specific safeguards that prevent unintended resource deletions."
        ],
        stack: ["Databricks", "DABs", "Jenkins", "GitHub Actions", "Azure DevOps", "Amazon EKS", "Terraform", "Azure", "Splunk", "AWS WAF"]
      },
      {
        role: "DevOps Engineer",
        company: "Agilisium",
        url: "https://www.agilisium.com",
        location: "Chennai",
        start: "2022-08",
        end: "2025-06",
        points: [
          "Managed AWS cloud infrastructure with a focus on high availability, security, scalability and performance.",
          "Built and maintained Docker images and deployed microservices to Kubernetes and Amazon EKS clusters.",
          "Developed reusable Terraform modules for automated provisioning of core AWS services.",
          "Configured automated backups, cross-region replication and S3 lifecycle management for business continuity and disaster recovery.",
          "Worked in Agile/Scrum cross-functional teams to deliver secure, reliable cloud solutions."
        ],
        stack: ["AWS", "Docker", "Kubernetes", "Amazon EKS", "Terraform", "S3", "Disaster recovery"]
      },
      {
        role: "Application Support Engineer",
        company: "IDC Technologies Solutions",
        url: "https://idctechnologies.com/",
        start: "2021-02",
        end: "2022-08",
        points: [
          "Monitored application performance and infrastructure health in Grafana, catching bottlenecks early and improving reliability.",
          "Investigated production incidents, ran root cause analysis (RCA) and carried out smoke and functional testing after deployments.",
          "Worked with development, QA and external vendors to resolve incidents within strict SLAs."
        ],
        stack: ["Grafana", "Incident management", "RCA", "SLA"]
      },
      {
        role: "Associate",
        company: "Accenture",
        url: "https://www.accenture.com/in-en",
        location: "Chennai",
        start: "2019-07",
        end: "2021-02",
        points: [
          "Managed Windows infrastructure for enterprise users, resolving operating system, hardware, software and network issues to keep teams productive.",
          "Administered Active Directory accounts, Group Policies, provisioning and onboarding/offboarding workflows.",
          "Supported Microsoft 365, Outlook and Teams, and handled routine system administration and patch management."
        ],
        stack: ["Windows", "Active Directory", "Microsoft 365", "Patch management"]
      }
    ]
  },

  /* ---------- projects / highlights ----------
     image (optional): a screenshot shown at the top of the card
     link  (optional): GitHub repo, blog post or demo                       */
  projects: {
    title: "Things I’ve built and automated.",
    subtitle: "Highlights from client work. Add your own side projects and GitHub repos here too.",
    items: [
      {
        title: "Databricks platform at scale",
        summary: "15 workspaces across environments kept available and secure, with clean onboarding and role-based access across catalogs and schemas.",
        icon: "databricks",
        tags: ["Databricks", "RBAC", "Governance"]
      },
      {
        title: "~20% cloud cost reduction",
        summary: "Rightsizing and clean-up driven by AWS Cost Explorer and Compute Optimizer, cutting the monthly bill by about a fifth.",
        icon: "aws-cost-explorer",
        tags: ["Cost Explorer", "Compute Optimizer", "FinOps"]
      },
      {
        title: "Event-driven serverless on AWS",
        summary: "Lambda, API Gateway, S3 and EventBridge wired together for scalable, event-driven applications with no servers to manage.",
        icon: "aws-lambda",
        tags: ["Lambda", "API Gateway", "EventBridge"]
      },
      {
        title: "Multi-cloud Terraform",
        summary: "Infrastructure as Code for AWS and Azure: VPC, EC2, RDS, CloudFront and Lambda alongside Azure App Service and Key Vault.",
        icon: "terraform",
        tags: ["Terraform", "AWS", "Azure"]
      },
      {
        title: "Boomi and Model Serving pipelines",
        summary: "Dell Boomi integrations and Databricks Model Serving endpoints promoted through the same CI/CD flow from Dev to Production.",
        icon: "boomi",
        tags: ["Dell Boomi", "Model Serving", "Jenkins"]
      }
      // ,{ title: "My new project", summary: "One or two lines about it.", icon: "github", link: "https://github.com/rahul0814/repo", tags: ["Go", "Kubernetes"] }
    ]
  },

  /* ---------- skills ---------- */
  skills: {
    title: "The toolbox I ship with.",
    subtitle: "Cloud, pipelines, containers, data platforms and the monitoring that tells you when something drifts.",
    groups: [
      { name: "Cloud", note: "AWS and Azure", items: [
        { name: "AWS", icon: "aws" }, { name: "EC2", icon: "aws-ec2" }, { name: "S3", icon: "aws-s3" }, { name: "VPC", icon: "aws-vpc" },
        { name: "RDS", icon: "aws-rds" }, { name: "CloudFront", icon: "aws-cloudfront" }, { name: "Lambda", icon: "aws-lambda" },
        { name: "API Gateway", icon: "aws-api-gateway" }, { name: "EventBridge", icon: "aws-eventbridge" }, { name: "IAM", icon: "aws-iam" },
        { name: "WAF", icon: "aws-waf" }, { name: "Azure App Service", icon: "azure" }, { name: "Azure Key Vault", icon: "azure" }
      ]},
      { name: "CI/CD", note: "pipelines", items: [
        { name: "Jenkins", icon: "jenkins" }, { name: "GitHub Actions", icon: "githubactions" }, { name: "Azure DevOps", icon: "azuredevops" },
        { name: "CodePipeline", icon: "aws-codepipeline" }, { name: "CodeBuild", icon: "aws-codebuild" },
        { name: "Git", icon: "git" }, { name: "Bitbucket", icon: "bitbucket" }
      ]},
      { name: "Containers and IaC", note: "platform", items: [
        { name: "Docker", icon: "docker" }, { name: "Kubernetes", icon: "kubernetes" }, { name: "Amazon EKS", icon: "aws-eks" }, { name: "Terraform", icon: "terraform" }
      ]},
      { name: "Data and integration", note: "platforms", items: [
        { name: "Databricks", icon: "databricks" }, { name: "Dell Boomi", icon: "boomi" }, { name: "Collibra", icon: "collibra", badge: "CO" }   // add assets/img/icons/collibra.svg to show the logo
      ]},
      { name: "Monitoring", note: "observability", items: [
        { name: "Prometheus", icon: "prometheus" }, { name: "Grafana", icon: "grafana" }, { name: "Splunk", icon: "splunk" },
        { name: "CloudWatch", icon: "aws-cloudwatch" }, { name: "CloudTrail", icon: "aws-cloudtrail" }
      ]},
      { name: "Scripting and tools", note: "everyday", items: [
        { name: "Python", icon: "python" }, { name: "Linux", icon: "linux" }, { name: "Jira", icon: "jira" }, { name: "ServiceNow", badge: "SN" }
      ]}
    ],
    // what sits beside the skill groups: "graph" (rating chart) or "terminal"
    side: "graph",
    graph: {
      title: "Tech stack rating",
      note: "Self-assessed, out of 100",
      items: [                                   // 3 to 8 items; change the numbers any time
        { name: "Cloud", level: 88 },
        { name: "CI/CD", level: 88 },
        { name: "Containers and IaC", level: 86 },
        { name: "Data and integration", level: 80 },
        { name: "Monitoring", level: 80 },
        { name: "Scripting and tools", level: 72 }
      ]
    },
    terminalTitle: "rahul@prod: ~/platform",
    terminal: [
      { cmd: "terraform plan -out=tfplan", out: ["Refreshing state… vpc, eks, rds, cloudfront"], result: "Plan: 12 to add, 0 to change, 0 to destroy." },
      { cmd: "databricks bundle validate -t prod", out: ["Name: data-platform", "Target: prod"], result: "Validation OK!" },
      { cmd: "databricks bundle deploy -t prod", out: ["Uploading bundle files…", "Deploying resources…"], result: "Deployment complete!" },
      { cmd: "kubectl rollout status deploy/api -n prod", out: ["Waiting for 3 of 3 replicas on EKS…"], result: "deployment \"api\" successfully rolled out" },
      { cmd: "aws ce get-cost-and-usage --granularity MONTHLY", out: ["Comparing against last quarter…"], result: "Monthly spend down ~20% ✓" }
    ]
  },

  /* ---------- certifications ----------
     Add one block per certificate. They sort newest first automatically.
     image:  the badge picture, e.g. "assets/img/certification/cka.png" (optional)
     logo:   the issuer's logo name from assets/img/icons/, used when there's no image
     issuerIcon: small issuer icon shown next to the issuer name (LinkedIn style)
     date: "YYYY-MM" (when it was issued)
     credentialId, link: optional.
     Filter buttons are created automatically from "issuer".                */
  certifications: {
    title: "Certified on the platforms I use daily.",
    items: [
      {
        title: "Academy Accreditation – Databricks Fundamentals",
        issuer: "Databricks",
        issuerIcon: "li-databricks",
        date: "2026-10",
        credentialId: "197587652",
        description: "Core concepts of the Databricks Data Intelligence Platform and lakehouse architecture.",
        logo: "databricks",
        link: "",
        linkLabel: "Show credential"
      },
      {
        title: "Boomi Associate Administrator Certification",
        issuer: "Boomi",
        issuerIcon: "li-boomi",
        date: "2025-07",
        credentialId: "d3ir4rpfbaeu",
        description: "Administering the Boomi integration platform: environments, deployments and runtime management.",
        logo: "boomi",
        link: "",
        linkLabel: "Show credential"
      },
      {
        title: "AWS Certified DevOps Engineer – Professional",
        issuer: "AWS",
        issuerIcon: "li-aws",
        date: "2024-12",
        description: "Automating delivery, monitoring and operations at scale on AWS.",
        image: "assets/img/certification/devops.png",
        logo: "aws",
        link: "https://www.credly.com/badges/d60456a4-94f0-40cc-803b-5b4cc5482b1a/public_url",
        linkLabel: "Verify on Credly"
      },
      {
        title: "GitLab CI Fundamentals",
        issuer: "GitLab",
        issuerIcon: "li-gitlab",
        date: "2024-10",
        description: "Building, testing and deploying with GitLab CI/CD pipelines.",
        image: "assets/img/certification/gitlab.jpg",
        logo: "gitlab",
        link: "https://ti-user-certificates.s3.amazonaws.com/72109ec1-52dd-4663-9df4-754a8a1d0bff/4fdea17c-75c9-49bf-b210-5ddde58d6fed-rahul-raju-e42548dc-4f28-42f7-95e3-f91b69934d75-certificate.pdf",
        linkLabel: "View certificate"
      },
      {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "AWS",
        issuerIcon: "li-aws",
        date: "2022-11",
        description: "Designing resilient, cost-aware architectures on AWS.",
        image: "assets/img/certification/associate.jpg",
        logo: "aws",
        link: "https://www.credly.com/badges/40127a00-64f4-4a73-b488-2c03bfdbc32f/public_url",
        linkLabel: "Verify on Credly"
      }
      // ,{
      //   title: "Certified Kubernetes Administrator (CKA)",
      //   issuer: "CNCF",
      //   date: "2026-03",
      //   credentialId: "LF-xxxxxxxx",
      //   description: "Running and troubleshooting production Kubernetes clusters.",
      //   image: "assets/img/certification/cka.png",
      //   logo: "kubernetes",
      //   link: "https://www.credly.com/badges/your-badge-id/public_url",
      //   linkLabel: "Verify on Credly"
      // }
    ]
  },

  /* ---------- education ---------- */
  education: {
    title: "Where it started.",
    items: [
      {
        degree: "Bachelor of Computer Science",
        school: "University of Madras",
        start: "2016-06",
        end: "2019-06",
        description: "Coursework in web development and cloud computing, the foundation for everything that came after.",
        image: "assets/img/education/TNC.jpeg",
        tags: ["Web Development", "Cloud Computing"]
      }
    ]
  },

  /* ---------- contact ---------- */
  contact: {
    title: "Let’s automate something.",
    text: "Have a DevOps role, a pipeline to fix or a cloud migration to plan? Send a message and I’ll get back to you.",
    form: true,
    // how the form sends messages:
    //   "mailto"   opens the visitor's email app with the message filled in (works everywhere, no setup)
    //   "netlify"  saves messages in your Netlify dashboard (only when hosted on Netlify)
    //   a Formspree URL like "https://formspree.io/f/abcdwxyz" emails you directly (free account at formspree.io)
    formMode: "mailto"
  },

  footer: "Built and deployed with a pipeline, naturally.",

  /* =======================================================================
     CUSTOM SECTIONS: add brand-new sections without touching any code.
     1. Add a block below with a unique id.
     2. Add that id to the "sections" list at the top, where you want it.
     layout: "cards" (grid of cards), "list" (rows with dates), "text" (paragraphs)
     ======================================================================= */
  customSections: [
    // {
    //   id: "talks",
    //   nav: "Talks",
    //   title: "Talks and articles.",
    //   subtitle: "Where I share what I’ve learned.",
    //   layout: "list",
    //   items: [
    //     { title: "Zero-downtime deploys on EKS", text: "AWS Community Day Chennai", date: "2026-08", icon: "kubernetes", link: "https://..." }
    //   ]
    // },
    // {
    //   id: "achievements",
    //   nav: "Awards",
    //   title: "Recognition.",
    //   layout: "cards",
    //   items: [
    //     { title: "Star Performer 2025", text: "Agilisium, for automating Boomi releases.", icon: "aws", tags: ["Award"] }
    //   ]
    // }
  ]
};
