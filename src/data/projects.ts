import type { Project } from "@/types";

// Number of tags to show on project cards (homepage)
export const PROJECT_CARD_TAG_LIMIT = 4;

// CV visibility flags (per project): `showInAtsCv: false` hides a project from the
// generated ATS PDF (CvAtsDynamic.tsx). `showInStyledCv: false` is honored only
// once the styled CV becomes data-driven — CvStyledStatic.tsx is currently hardcoded
// and ignores it. Omitting a flag means the project is shown.
//
// `atsCvUrlPreference` / `styledCvUrlPreference` (per project): "live" | "repo" | "none",
// independently choosing which URL (if any) is shown next to the project on each CV.
// Defaults to "live" when omitted.

// [PLACEHOLDER] Replace all project entries with your real projects
export const projects: Project[] = [
  {
    slug: "agentic-erp",
    title: "Agentic ERP",
    shortDescription:
      "A supermarket inventory ERP where the business logic is written once and reused by three consumers — a FastAPI HTTP API, an MCP server, and a Pydantic AI agent that drives the system through those same tools.",
    fullDescription:
      "Agentic ERP is a supermarket inventory and purchasing system built around a single thesis: the business logic should be written exactly once and reused by every consumer that needs it. It is served through two independent front doors — a FastAPI HTTP API behind a Next.js inventory-manager UI, and an MCP server exposing the same operations as tools an AI agent can call.\n\nThe architecture holds because the boundary is mechanical rather than conventional. A service function is a plain Python function; FastAPI wraps it in a route and MCP wraps it in a tool, and neither framework owns the logic. `services/` may never import from `api/` or `mcp_server/` and never touches web concepts — no HTTPException, no status codes — with three import-linter contracts enforcing that across the codebase. Services raise plain exceptions from a shared vocabulary, and each adapter translates them into its own dialect: a NotFoundError becomes an HTTP 404 in the API and an error message in MCP.\n\nThe frontend gets the same treatment so it cannot drift. Two ESLint no-restricted-imports rules enforce that only the API module may call fetch, and that no Next.js route handlers may mirror FastAPI endpoints — a proxy layer would be a third adapter, the same category of mistake, forbidden for the same reason. Reads happen in Server Components and mutations go through Server Actions, so the API base URL never reaches the browser. The client itself is generated from the OpenAPI schema and committed, with a drift check that fails when the generated types no longer match the backend contract.\n\nThe agent itself is a Pydantic AI loop running as its own Python service, reached over HTTP rather than embedded in the web tier — the third consumer of the same service layer, calling it through the MCP tools instead of around them. Because those tools mutate real stock, the chat surface was specified as a full state machine before it was wired: idle, thinking, streaming a reply, tool-call-in-progress, success and refusal, so a user can always see whether the agent is answering a question or changing their inventory. Identity is a parameter obtained in exactly one place on each side, leaving a single seam for the OAuth token exchange that lets the agent act on a user's behalf without inheriting more privilege than that user has.\n\nBuilt with Python 3.12, FastAPI, SQLAlchemy and Alembic over Postgres on Supabase, Pydantic AI for the agent loop, and the MCP Python SDK; the client is Next.js 16 with React 19, Tailwind CSS v4 and shadcn/ui. 31 tests cover the service layer directly plus both adapters, including a real stdio MCP client. Products is taken end to end through every layer as the reference slice for the remaining entities.",
    tags: [
      "Python",
      "FastAPI",
      "MCP",
      "Pydantic AI",
      "AI Agents",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "Supabase",
      "Next.js",
      "TypeScript",
      "OpenAPI",
      "Tailwind CSS",
      "ShadCN",
    ],
    year: "2026",
    repoUrl: "https://github.com/AmzalFoumi/agentic-erp",
    featured: true,
    tagLimit: 7,
    atsCvUrlPreference: "repo",
    styledCvUrlPreference: "repo",
  },
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
    atsCvUrlPreference: "live",
    styledCvUrlPreference: "live",
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
    atsCvUrlPreference: "repo",
    styledCvUrlPreference: "repo",
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
    atsCvUrlPreference: "live",
    styledCvUrlPreference: "live",
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
    // Cut from the styled CV to make room for Agentic ERP on one A4 page.
    showInStyledCv: false,
    atsCvUrlPreference: "none",
    styledCvUrlPreference: "none",
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
    atsCvUrlPreference: "repo",
    styledCvUrlPreference: "repo",
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
    atsCvUrlPreference: "live",
    styledCvUrlPreference: "live",
  },
];
