import type { Project } from "@/types";

// Number of tags to show on project cards (homepage)
export const PROJECT_CARD_TAG_LIMIT = 4;

// CV visibility flags (per project): `showInAtsCv: false` hides a project from the
// generated ATS PDF (CvPdfDocument.tsx). `showInStyledCv: false` is honored only
// once the styled CV becomes data-driven — CvContent.tsx is currently hardcoded
// and ignores it. Omitting a flag means the project is shown.

// [PLACEHOLDER] Replace all project entries with your real projects
export const projects: Project[] = [
  {
    slug: "aesth-ai",
    title: "Aesth-ai",
    shortDescription:
      "A proof-of-concept AI chatbot for an aesthetic-clinic site that answers product questions via dual retrieval — deterministic DB queries and semantic RAG search.",
    fullDescription:
      'Aesth-ai is a proof-of-concept AI chatbot built to validate a retrieval approach before porting it into a production codebase, running on Payload 3 and MongoDB over a beauty-product dataset.\n\nThe model chooses between two tools per question: a DB-filter tool for deterministic queries (e.g. "list face creams with a rating over 4") that grounds answers directly in database rows, and a RAG tool that embeds the query and runs nearest-neighbour search over a MongoDB Atlas vector store for semantic questions (e.g. "what can I use for dry skin?").\n\nI designed two seams to make the engine easy to evaluate and re-target: an A/B retrieval switch (db / rag / both) implemented purely through the tool registry with no orchestrator branching, and provider-agnostic chat/embedding models swappable via a one-line env change with no vendor SDK imported in business code. The model also self-selects a typed answer shape (plain, timeline, product-list, comparison), always degrading gracefully to plain text on failure.\n\nBuilt with Next.js 16 (App Router), Payload 3.85 with MongoDB, the Vercel AI SDK, Gemini Flash for chat, and gemini-embedding-001 for embeddings, with vectors stored in a dedicated collection behind a swappable VectorStore interface.',
    tags: [
      "Next.js",
      "Payload CMS",
      "MongoDB",
      "Vercel AI SDK",
      "RAG",
      "Vector Search",
      "Gemini API",
      "TypeScript",
    ],
    year: "2026",
    liveUrl: "https://aesth-ai-hazel.vercel.app",
    repoUrl: "https://github.com/AmzalFoumi/aesth-ai",
    featured: true,
  },

  {
    slug: "distributed-health",
    title: "Distributed Health",
    shortDescription:
      "A cloud-native healthcare platform with AI symptom checking, telemedicine, appointments, and prescription & reports management.",
    fullDescription:
      "Distributed Health is a cloud-native healthcare platform built with a microservices architecture.\n\nIt includes AI-powered preliminary symptom checking, doctors' appointments, telemedicine services, and prescription/report management.\n\nI orchestrated the containerized services with Kubernetes on AWS EKS (provisioned using Terraform) and implemented a GitOps CD pipeline using GitHub Actions and ArgoCD for automated deployments.\n\nKey technologies include Next.js with Tailwind CSS and ShadCN, Node.js, Nest.js, MongoDB, Agora API for telemedicine, and the Gemini API.",
    tags: [
      "Microservices",
      "Gemini API",
      "Nest.js",
      "Kubernetes",
      "Docker",
      "AWS EKS",
      "Terraform",
      "Agora API",
      "MongoDB",
      "Next.js",
      "Tailwind CSS",
      "ShadCN",
    ],
    year: "2026",
    repoUrl: "https://github.com/Distributed-Health-System",
    links: [
      {
        label: "System Design Writeup",
        url: "https://medium.com/@mohamedamzal6/system-design-from-minikube-to-eks-with-terraform-e024a54f4a5a",
      },
    ],
    featured: true,
    tagLimit: 7,
  },
  {
    slug: "asl-finance-hub",
    title: "ASL Finance Hub",
    shortDescription:
      "A financial intelligence dashboard for AIESEC Sri Lanka tracking KPIs, budgets, and audit scores across 11 Local Committees.",
    fullDescription:
      "ASL Finance Hub is a financial intelligence dashboard for AIESEC in Sri Lanka that tracks KPIs, budgets, audit scores, and monthly reviews across all 11 Local Committees.\n\nAs the team lead on the National Development Team, I directed the architecture and delivery — designing a role-based access control model (LC, MC, and EFB roles) enforced end-to-end with Supabase Row-Level Security.\n\nI built an automated financial data pipeline that syncs Google Sheets into Supabase through Google AppScript webhooks and Supabase Edge Functions, authenticating via a Google Service Account and consolidating data per entity and month.\n\nThe app is deployed as a Dockerized SPA behind Nginx on an Azure VM, with a GitHub Actions CI/CD pipeline that performs blue-green deployments with health-check rollback.\n\nBuilt with React 19 and TypeScript on TanStack Start, Supabase (PostgreSQL, Auth, Edge Functions), Radix UI with shadcn/ui, Recharts for visualizations, and TailwindCSS v4.",
    tags: [
      "ETL Pipeline",
      "React",
      "TypeScript",
      "TanStack Start",
      "Supabase",
      "PostgreSQL",
      "Google Sheets API",
      "Google AppScript",
      "Recharts",
      "Tailwind CSS",
      "ShadCN",
      "Docker",
      "Azure",
      "GitHub Actions",
    ],
    year: "2026",
    featured: false,
    tagLimit: 8,
    liveUrl: "https://finance.aiesec.lk",
    repoUrl: "https://github.com/AIESEC-LK/asl-finance-hub.git ",
  },

  {
    slug: "kidsfeed",
    title: "KidsFeed",
    shortDescription:
      "School meals program management with planning, distribution, attendance tracking, and FIFO inventory.",
    fullDescription:
      "KidsFeed is a platform for school meals program management with meal/menu planning, distribution and attendance tracking, and inventory management using FIFO batches ordered by expiry dates.\n\nA robust RBAC and user administration system combines Clerk with a custom backend module. The codebase follows a domain-driven, layered architecture to keep it clean and maintainable.\n\nBuilt with a back-to-basics stack: React with Tailwind CSS and ShadCN on the client, Express on the server, MongoDB for storage, and OpenFoodFacts API integration.",
    tags: [
      "React",
      "Tailwind CSS",
      "ShadCN",
      "Express",
      "Clerk",
      "MongoDB",
      "OpenFoodFacts API",
    ],
    year: "2026",
    liveUrl: "https://kidsfeed.vercel.app/",
    repoUrl: "https://github.com/lakindu62/kidsfeed",
    featured: false,
  },
  {
    slug: "itinerary-ai",
    title: "Itinerary.ai",
    shortDescription:
      "AI-powered travel planner for generating itineraries, sharing posts, and booking hotels/events.",
    fullDescription:
      "Itinerary.ai is a web app for tourists to generate custom travel itineraries using AI.\n\nUsers can share itineraries and travel media as rich social posts, and book hotels and events directly from the generated plans.\n\nBuilt with Next.js and Tailwind CSS on the frontend, and a Node.js/Nest.js backend with MongoDB, MinIO object storage, and Gemini API integration.",
    tags: [
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Nest.js",
      "MongoDB",
      "MinIO",
      "Gemini API",
    ],
    year: "2025",
    repoUrl: "https://github.com/lakindu62/itinerary_ai",
    featured: true,
  },
  {
    slug: "aiesec-lk",
    title: "aiesec.lk",
    shortDescription:
      "Revamped the national AIESEC Sri Lanka website for a smoother, more colorful, fully responsive experience.",
    fullDescription:
      "As part of the National Development Team of AIESEC in Sri Lanka, I contributed to revamping aiesec.lk.\n\nThe goal was a site that felt more vibrant, smoother to use, and easier to navigate, while remaining fast and fully responsive.\n\nWe delivered the new platform at a rapid pace using a modern stack centered on Next.js and TypeScript, and the hands-on experience with the team and tooling was invaluable.",
    tags: ["Next.js", "TypeScript", "React", "ReactBits"],
    year: "2025",
    liveUrl: "https://www.aiesec.lk/",
    featured: false,
    showInAtsCv: false,
    showInStyledCv: false,
  },
  // {
  //   slug: "datasync-api",
  //   title: "DataSync API",
  //   shortDescription:
  //     "A high-performance REST API for real-time data synchronisation across distributed systems with conflict resolution.",
  //   fullDescription:
  //     "DataSync API is a production-grade REST API built to handle real-time data synchronisation across distributed systems.\n\nThe core challenge was implementing a robust conflict-resolution algorithm that merges divergent data states without data loss. The solution uses vector clocks and a CRDT-inspired merge strategy.\n\nThe API is fully documented with OpenAPI spec, supports webhook subscriptions for push notifications, and is deployed on AWS Lambda behind API Gateway for zero-cold-start performance.\n\nKey outcomes: 99.97% uptime, sub-50ms p95 latency, processing over 2M sync events per day.",
  //   tags: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "AWS Lambda"],
  //   year: "2024",
  //   liveUrl: "https://example.com",
  //   repoUrl: "https://github.com/yourusername/datasync-api",
  //   featured: true,
  // },
  // {
  //   slug: "opencart-dashboard",
  //   title: "OpenCart Dashboard",
  //   shortDescription:
  //     "A modern analytics dashboard for OpenCart stores with real-time sales tracking, inventory alerts, and revenue forecasting.",
  //   fullDescription:
  //     "OpenCart Dashboard replaces the stock admin interface with a data-rich, real-time analytics layer built entirely on top of the existing OpenCart database.\n\nThe dashboard streams live sales events via Server-Sent Events and renders charts using a lightweight custom D3.js wrapper. Inventory alerts are rule-based and configurable per SKU.\n\nRevenue forecasting uses a simple ARIMA model trained on historical order data, surfaced through a Python FastAPI microservice.\n\nBuilt for a client managing 3 stores with ~10k SKUs. Reduced their daily reporting overhead from 2 hours to under 10 minutes.",
  //   tags: ["Next.js", "TypeScript", "D3.js", "Python", "FastAPI", "MySQL"],
  //   year: "2024",
  //   repoUrl: "https://github.com/yourusername/opencart-dashboard",
  //   featured: true,
  // },
  // {
  //   slug: "devnotes-app",
  //   title: "DevNotes App",
  //   shortDescription:
  //     "A developer-native note-taking app with Markdown support, code blocks with syntax highlighting, and tag-based search.",
  //   fullDescription:
  //     "DevNotes is a minimalist note-taking application purpose-built for developers.\n\nNotes are written in Markdown and rendered with full GFM support including tables, task lists, and fenced code blocks with syntax highlighting via Shiki.\n\nThe app runs fully offline using IndexedDB for storage, with optional cloud sync via a self-hosted CouchDB instance. Notes are searchable by title, content, and tags with sub-100ms query response.\n\nBuilt as a Progressive Web App — installable on desktop and mobile, works offline.",
  //   tags: ["React", "TypeScript", "IndexedDB", "Shiki", "PWA", "CouchDB"],
  //   year: "2023",
  //   repoUrl: "https://github.com/yourusername/devnotes-app",
  // },
  // {
  //   slug: "infra-monitor",
  //   title: "InfraMonitor",
  //   shortDescription:
  //     "A self-hosted infrastructure monitoring tool that tracks server health, uptime, and sends alerts via Slack and email.",
  //   fullDescription:
  //     "InfraMonitor is a lightweight, self-hosted alternative to expensive monitoring SaaS products.\n\nIt runs as a single Docker container and polls configured endpoints on a schedule, storing time-series metrics in a local SQLite database. The dashboard visualises uptime history, response time trends, and alert history.\n\nAlerts are dispatched via Slack webhooks and SMTP email. Alert rules are configurable via a YAML file — thresholds for response time, status codes, and certificate expiry.\n\nCurrently monitoring 40+ services across 3 clients. Docker image is under 80MB.",
  //   tags: ["Go", "SQLite", "Docker", "Prometheus", "Grafana"],
  //   year: "2023",
  //   repoUrl: "https://github.com/yourusername/infra-monitor",
  // },
  // {
  //   slug: "formflow",
  //   title: "FormFlow",
  //   shortDescription:
  //     "A drag-and-drop form builder with conditional logic, multi-step flows, and webhook integrations for submission delivery.",
  //   fullDescription:
  //     "FormFlow lets non-technical users build complex multi-step forms with conditional logic without writing code.\n\nThe form builder is built with @dnd-kit and supports drag-and-drop field reordering, branching logic (show/hide fields based on previous answers), and custom validation rules.\n\nForms are rendered as static JSON schemas, making them portable and easy to embed. Submissions are stored in Postgres and optionally forwarded to configured webhook endpoints.\n\nInternally used by a 50-person team to replace 4 different form tools they had been stitching together.",
  //   tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "dnd-kit"],
  //   year: "2023",
  //   liveUrl: "https://example.com",
  //   repoUrl: "https://github.com/yourusername/formflow",
  // },
  // {
  //   slug: "clibuddy",
  //   title: "CLIBuddy",
  //   shortDescription:
  //     "A terminal companion app that provides contextual documentation and command suggestions based on your shell history.",
  //   fullDescription:
  //     "CLIBuddy watches your shell history in real-time and provides a side-panel with contextual documentation, common flags, and usage examples for whatever command you just ran.\n\nIt uses a local fuzzy search index built from man pages, tldr pages, and community-curated command snippets. No data ever leaves your machine.\n\nThe UI is a small Electron window that docks to the side of your terminal. Supports macOS and Linux. Vim keybindings throughout.\n\nBuilt because I was tired of switching to a browser to look up flags mid-command.",
  //   tags: ["Electron", "TypeScript", "React", "SQLite", "Shell"],
  //   year: "2022",
  //   repoUrl: "https://github.com/yourusername/clibuddy",
  // },
];
