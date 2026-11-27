/**
 * Public personal details and all portfolio content, taken from the CV
 * (VuTranQuangMinh_FullstackDeveloper_CV.pdf). Everything here is public: it is in the repo and on
 * the portfolio. Private card data lives in the CARD_DATA environment variable (lib/private-card.ts).
 */

export const profile = {
  name: "Vũ Trần Quang Minh",
  nameAscii: "Vu Tran Quang Minh",
  nickname: "William",
  title: "Full-Stack Software Engineer",
  location: "Ho Chi Minh City, Vietnam",
  // Shown on the public card instead of the (private) birthday.
  careerStart: "04/2025",
  email: "vutranquangminh.dev@gmail.com",
  phone: "+84 866 191 104",
  phoneHref: "tel:+84866191104",
  phoneCard: "0866 191 104",
  linkedin: "https://www.linkedin.com/in/vutranquangminh/",
  github: "https://github.com/vutranquangminh",
  site: "https://vutranquangminh.vercel.app",
  resume: "/VuTranQuangMinh_CV.pdf",
  intro:
    "A full-stack engineer with ~1.5 years shipping production systems in smart-retail IoT, AI healthcare and enterprise commerce: Go, Python/Django and Node.js services, React/Next.js web apps, and React Native/Kotlin mobile.",
  summary:
    "Full-stack Software Engineer with ~1.5 years of hands-on experience shipping production systems in smart-retail IoT, AI healthcare and enterprise commerce. I work across the stack: backend services (Go, Python/Django, Node.js, PostgreSQL, Redis), web apps (React, Next.js, TypeScript) and mobile (React Native, Kotlin).",
};

export const stats = [
  { value: "~1.5 yrs", label: "Shipping production systems" },
  { value: "4", label: "Engineering teams" },
  { value: "<150ms", label: "p95 API latency on a NestJS platform" },
  { value: "IJCA", label: "Published research" },
];

export const focusAreas = [
  {
    title: "Smart-retail IoT",
    body: "Edge devices, real-time device–server messaging and payments for unattended retail.",
    tags: ["Go", "gRPC", "MQTT", "Kotlin"],
  },
  {
    title: "AI healthcare",
    body: "Multi-LLM clinical chat with RAG, biosignal processing and PHI-stripped data pipelines.",
    tags: ["LangChain", "Qdrant", "Django", "Celery"],
  },
  {
    title: "Enterprise commerce",
    body: "Loyalty ecosystems, merchant CMS and modular platforms built to stay fast as they grow.",
    tags: ["NestJS", "Node.js", "React Native", "PostgreSQL"],
  },
  {
    title: "Learning & accessibility",
    body: "Sign-language e-learning in the browser and research on learning tools for dyslexic children.",
    tags: ["React", "Three.js", "WebRTC", "RL"],
  },
];

export type Role = {
  company: string;
  companyNote?: string;
  url?: string;
  role: string;
  period: string;
  current?: boolean;
  summary: string;
};

export const experience: Role[] = [
  {
    company: "NewEra Inc",
    companyNote: "Masan Group ecosystem",
    url: "https://newera.inc",
    role: "Junior Software Engineer",
    period: "Oct 2026 — Present",
    current: true,
    summary: "Backend, payments and dashboards for AI-powered Smart Coolers and Vending Machines across Masan Group's retail network.",
  },
  {
    company: "Ravid",
    url: "https://ravid.cloud/",
    role: "Full Stack Engineer",
    period: "Jan 2026 — Sep 2026",
    summary: "AI healthcare platform: multi-LLM clinical chat, medical document analysis, wearables and secure B2B data exchange.",
  },
  {
    company: "TMA Solutions",
    url: "https://www.linkedin.com/company/tma-solutions/",
    role: "Frontend Developer Intern",
    period: "Oct 2025 — Dec 2025",
    summary: "Teledeaf: an AI-powered sign-language translation and e-learning platform.",
  },
  {
    company: "Plogg Vietnam",
    role: "Full Stack Engineer Intern",
    period: "Jul 2025 — Sep 2025",
    summary: "Connect Verse: an enterprise loyalty and business-networking ecosystem with AI audio tools.",
  },
];

export type Project = {
  name: string;
  context: string;
  period: string;
  url?: string;
  headline: string;
  metric?: { value: string; label: string };
  points: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "Smart Cooler & Vending",
    context: "NewEra Inc · Masan Group",
    period: "2026 — now",
    url: "https://newera.inc",
    headline: "An AI-powered smart retail ecosystem with a “scan-face, grab-and-go” shopping experience.",
    metric: { value: "FacePay", label: "biometric checkout + dynamic QR" },
    points: [
      "Backend services and real-time device–server communication that process edge-AI facial-recognition events for smart-lock release and item-grab tracking.",
      "FacePay biometric checkout and dynamic QR payments with the WinMoney e-wallet and Techcombank, with idempotent transactions and automated reconciliation.",
      "Fleet-management dashboards for device telemetry, inventory and payments, plus on-device touch apps for embedded Android boards.",
    ],
    stack: ["Go", "gRPC", "REST", "MQTT", "Redis", "PostgreSQL", "Next.js", "TypeScript", "Kotlin"],
  },
  {
    name: "Ravid",
    context: "AI healthcare platform",
    period: "2026",
    url: "https://ravid.cloud/",
    headline: "Multi-LLM clinical chat, medical document analysis, wearable integrations and secure B2B partner data exchange.",
    metric: { value: "RAG", label: "streaming multi-provider LLMs" },
    points: [
      "Multi-provider LLM orchestration with streaming and RAG for clinical chat, plus biosignal feature extraction (MNE, NeuroKit2) with PHI stripping.",
      "Asynchronous processing for wearable sync and heavy medical computations, with real-time WebSocket messaging.",
      "Secure authentication (WebAuthn / TOTP MFA, custom RBAC), B2B partner APIs and a Stripe billing system managing an AI token/credit ledger.",
    ],
    stack: ["Python", "Django", "LangChain", "Qdrant", "Celery", "PostgreSQL", "Redis", "Channels", "Stripe"],
  },
  {
    name: "Modular Application Platform",
    context: "Sonami Solution",
    period: "Jan — Aug 2026",
    headline: "A modular-monolith TypeScript platform designed to stay fast as modules are added.",
    metric: { value: "<150ms", label: "p95 API response time" },
    points: [
      "Modular-monolith architecture in a Turborepo, with PostgreSQL/TypeORM persistence and Redis/BullMQ background jobs.",
      "MinIO object storage, Docker Compose environments and end-to-end tests with Playwright.",
    ],
    stack: ["NestJS", "Turborepo", "PostgreSQL", "TypeORM", "Redis", "BullMQ", "MinIO", "Docker", "Playwright"],
  },
  {
    name: "Teledeaf",
    context: "TMA Solutions",
    period: "2025",
    url: "https://teledeaf.tmainnovation.vn/",
    headline: "AI-powered sign-language translation and communication, with interactive e-learning.",
    metric: { value: "60fps", label: "stable 3D rendering" },
    points: [
      "Interactive e-learning module with real-time camera access and debounced video recording that sends sign-language gestures to an AI validation API.",
      "Responsive UIs and optimised 3D component rendering to hold a stable 60fps.",
    ],
    stack: ["React", "Vite", "PeerJS", "MediaDevices API", "SCSS", "Three.js"],
  },
  {
    name: "Connect Verse",
    context: "Plogg Vietnam",
    period: "2025",
    headline: "An all-in-one enterprise loyalty and business-networking ecosystem with AI audio transcription.",
    points: [
      "Backend services and cross-platform mobile apps for shop catalogs, loyalty vouchers and real-time audio recording with automated AI meeting summaries.",
      "Merchant CMS for product lifecycle management, Dify AI chatbot integration and Cloudflare R2 for media streaming and assets.",
    ],
    stack: ["Node.js", "Express.js", "React Native", "Dify", "Cloudflare R2"],
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "Go", "Python", "Kotlin"] },
  { group: "Backend", items: ["Express.js", "NestJS", "Django"] },
  { group: "Frontend & mobile", items: ["React", "Next.js", "React Native", "Three.js"] },
  { group: "Data", items: ["PostgreSQL", "Redis", "Qdrant", "MongoDB"] },
  { group: "AI & messaging", items: ["RAG", "LangChain", "MQTT", "gRPC", "WebSockets"] },
  { group: "DevOps", items: ["Docker", "GitHub Actions", "PM2"] },
];

export const education = [
  {
    school: "Ho Chi Minh City University of Technology",
    degree: "Master of Science in Computer Science",
    period: "Aug 2026 — Jun 2028 (expected)",
    notes: ["Vietnamese Government Master's Scholarship (Decree No. 179)"],
  },
  {
    school: "University of Greenwich",
    degree: "Bachelor of Science with Honours in Computing",
    period: "Aug 2022 — Feb 2026",
    grade: "GPA 3.6",
    notes: ["Top Student in Semester Academic Honours, received twice"],
  },
];

export const publication = {
  title: "VALF: A CLA-based Reinforcement Learning Framework for Vietnamese Language Learning in Dyslexic Children",
  venue: "International Journal of Computer Applications (IJCA)",
  date: "Aug 20, 2025",
  url: "https://www.ijcaonline.org/archives/volume187/number29/valf-a-cla-based-reinforcement-learning-framework-for-vietnamese-language-learning-in-dyslexic-children/",
};

export const activities = [
  { text: "Core member of", link: { label: "HelloGIT, UoG's IT Club", url: "https://www.facebook.com/HelloGIT" } },
  { text: "Head of Media of", link: { label: "Greenwich Football Club", url: "https://www.facebook.com/profile.php?id=61564038209927" } },
  { text: "Taught Scratch programming with", link: { label: "Robotics & IoT HCMUS", url: "https://www.facebook.com/RoboticsHCMUS" }, after: { label: "the U.S. Consulate General", url: "https://vn.usembassy.gov/vi/ho-chi-minh/" } },
];

/**
 * `url` is the issuer's own verification page (shown with an arrow), `pdf` our copy of the certificate in
 * public/certificates (moved here from the old vutranquangminh/certificates repo).
 */
export const certifications: { issuer: string; name: string; url?: string; pdf?: string }[] = [
  { issuer: "NVIDIA", name: "Applications of AI for Predictive Maintenance", url: "https://learn.nvidia.com/certificates?id=Ja2lXYWdTwOxx3yOpa8gCg", pdf: "/certificates/nvidia-ai-predictive-maintenance.pdf" },
  { issuer: "Scrimba", name: "The AI Engineer Path", pdf: "/certificates/scrimba-ai-engineer-path.pdf" },
  { issuer: "Scrimba", name: "The Frontend Developer Career Path", url: "https://scrimba.com/certificate-cert2uNjfKA1wzC5vMhXwTNUv82WkFooUCNJBx4", pdf: "/certificates/scrimba-frontend-developer-career-path.pdf" },
  { issuer: "Scrimba", name: "The Fullstack Developer Path", url: "https://scrimba.com/certificate-cert2ffemzs7ogVG88UA72dkkSJY6RLsxVtBAxgp8kmTXuG6Xa", pdf: "/certificates/scrimba-fullstack-developer-path.pdf" },
  { issuer: "HarvardX", name: "CS50's Introduction to Computer Science", url: "https://certificates.cs50.io/3de313c8-69b9-4c5b-af59-1949006626d1.png?size=letter", pdf: "/certificates/cs50x-computer-science.pdf" },
  { issuer: "HarvardX", name: "CS50's Introduction to Programming with Python", url: "https://certificates.cs50.io/e97c9ca6-07a1-4739-aea0-6ebadcb7edea.png?size=letter", pdf: "/certificates/cs50-python.pdf" },
  { issuer: "HarvardX", name: "CS50's Introduction to Programming with Scratch", pdf: "/certificates/cs50-scratch.pdf" },
  { issuer: "English", name: "Professional working proficiency · VSTEP B2 (6.0)" },
];
