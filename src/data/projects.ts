import type { Project } from "@/types";

// [PLACEHOLDER] Replace all project entries with your real projects
export const projects: Project[] = [
  {
    slug: "datasync-api",
    title: "DataSync API",
    shortDescription:
      "A high-performance REST API for real-time data synchronisation across distributed systems with conflict resolution.",
    fullDescription:
      "DataSync API is a production-grade REST API built to handle real-time data synchronisation across distributed systems.\n\nThe core challenge was implementing a robust conflict-resolution algorithm that merges divergent data states without data loss. The solution uses vector clocks and a CRDT-inspired merge strategy.\n\nThe API is fully documented with OpenAPI spec, supports webhook subscriptions for push notifications, and is deployed on AWS Lambda behind API Gateway for zero-cold-start performance.\n\nKey outcomes: 99.97% uptime, sub-50ms p95 latency, processing over 2M sync events per day.",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "AWS Lambda"],
    year: "2024",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/datasync-api",
    featured: true,
  },
  {
    slug: "opencart-dashboard",
    title: "OpenCart Dashboard",
    shortDescription:
      "A modern analytics dashboard for OpenCart stores with real-time sales tracking, inventory alerts, and revenue forecasting.",
    fullDescription:
      "OpenCart Dashboard replaces the stock admin interface with a data-rich, real-time analytics layer built entirely on top of the existing OpenCart database.\n\nThe dashboard streams live sales events via Server-Sent Events and renders charts using a lightweight custom D3.js wrapper. Inventory alerts are rule-based and configurable per SKU.\n\nRevenue forecasting uses a simple ARIMA model trained on historical order data, surfaced through a Python FastAPI microservice.\n\nBuilt for a client managing 3 stores with ~10k SKUs. Reduced their daily reporting overhead from 2 hours to under 10 minutes.",
    tags: ["Next.js", "TypeScript", "D3.js", "Python", "FastAPI", "MySQL"],
    year: "2024",
    repoUrl: "https://github.com/yourusername/opencart-dashboard",
    featured: true,
  },
  {
    slug: "devnotes-app",
    title: "DevNotes App",
    shortDescription:
      "A developer-native note-taking app with Markdown support, code blocks with syntax highlighting, and tag-based search.",
    fullDescription:
      "DevNotes is a minimalist note-taking application purpose-built for developers.\n\nNotes are written in Markdown and rendered with full GFM support including tables, task lists, and fenced code blocks with syntax highlighting via Shiki.\n\nThe app runs fully offline using IndexedDB for storage, with optional cloud sync via a self-hosted CouchDB instance. Notes are searchable by title, content, and tags with sub-100ms query response.\n\nBuilt as a Progressive Web App — installable on desktop and mobile, works offline.",
    tags: ["React", "TypeScript", "IndexedDB", "Shiki", "PWA", "CouchDB"],
    year: "2023",
    repoUrl: "https://github.com/yourusername/devnotes-app",
  },
  {
    slug: "infra-monitor",
    title: "InfraMonitor",
    shortDescription:
      "A self-hosted infrastructure monitoring tool that tracks server health, uptime, and sends alerts via Slack and email.",
    fullDescription:
      "InfraMonitor is a lightweight, self-hosted alternative to expensive monitoring SaaS products.\n\nIt runs as a single Docker container and polls configured endpoints on a schedule, storing time-series metrics in a local SQLite database. The dashboard visualises uptime history, response time trends, and alert history.\n\nAlerts are dispatched via Slack webhooks and SMTP email. Alert rules are configurable via a YAML file — thresholds for response time, status codes, and certificate expiry.\n\nCurrently monitoring 40+ services across 3 clients. Docker image is under 80MB.",
    tags: ["Go", "SQLite", "Docker", "Prometheus", "Grafana"],
    year: "2023",
    repoUrl: "https://github.com/yourusername/infra-monitor",
  },
  {
    slug: "formflow",
    title: "FormFlow",
    shortDescription:
      "A drag-and-drop form builder with conditional logic, multi-step flows, and webhook integrations for submission delivery.",
    fullDescription:
      "FormFlow lets non-technical users build complex multi-step forms with conditional logic without writing code.\n\nThe form builder is built with @dnd-kit and supports drag-and-drop field reordering, branching logic (show/hide fields based on previous answers), and custom validation rules.\n\nForms are rendered as static JSON schemas, making them portable and easy to embed. Submissions are stored in Postgres and optionally forwarded to configured webhook endpoints.\n\nInternally used by a 50-person team to replace 4 different form tools they had been stitching together.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "dnd-kit"],
    year: "2023",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/formflow",
  },
  {
    slug: "clibuddy",
    title: "CLIBuddy",
    shortDescription:
      "A terminal companion app that provides contextual documentation and command suggestions based on your shell history.",
    fullDescription:
      "CLIBuddy watches your shell history in real-time and provides a side-panel with contextual documentation, common flags, and usage examples for whatever command you just ran.\n\nIt uses a local fuzzy search index built from man pages, tldr pages, and community-curated command snippets. No data ever leaves your machine.\n\nThe UI is a small Electron window that docks to the side of your terminal. Supports macOS and Linux. Vim keybindings throughout.\n\nBuilt because I was tired of switching to a browser to look up flags mid-command.",
    tags: ["Electron", "TypeScript", "React", "SQLite", "Shell"],
    year: "2022",
    repoUrl: "https://github.com/yourusername/clibuddy",
  },
];
