import fs from "node:fs/promises";
import path from "node:path";
import { PROJECTS } from "@/data/projects";

export type KnowledgeChunk = {
  id: string;
  source: string;
  chunkIndex: number;
  text: string;
  score: number;
};

type RawChunk = Omit<KnowledgeChunk, "score">;

type GuideTopic = {
  id: string;
  source: string;
  title: string;
  aliases: string[];
  summary: string;
  bullets?: string[];
  page?: string;
};

let cachedChunks: RawChunk[] | null = null;
let cachedBase = "";
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "by",
  "do",
  "does",
  "for",
  "from",
  "get",
  "has",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "so",
  "that",
  "the",
  "tell",
  "to",
  "us",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "your"
]);

const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: "site-overview",
    source: "site/home",
    title: "Website overview",
    aliases: ["website", "site", "portfolio", "homepage", "home page", "what is this about", "about this site"],
    summary:
      "This is Venkatesh Naidu's portfolio website. It presents his business intelligence and data analytics work, project case studies, sports background, contact details, and a sports-snapshot themed homepage with a 3D avatar and ratings-style skill cards.",
    bullets: [
      "The main routes are Home, Projects, Experience, Sports, and Contact.",
      "The homepage focuses on trusted pipelines, clean dashboards, automation, and sports-tech ideas.",
      "The assistant is meant to answer from what is published on the website."
    ],
    page: "Home"
  },
  {
    id: "current-role",
    source: "site/experience",
    title: "NBCUniversal role",
    aliases: ["nbc", "nbcuniversal", "current role", "current job", "data analytics engineer", "broadcast reliability"],
    summary:
      "At NBCUniversal, Venky is a Data Analytics Engineer working on sports broadcast reliability and operational reporting.",
    bullets: [
      "Built the first end-to-end Power BI dashboard for sports broadcast reliability across 10,000+ hours of live broadcasts.",
      "Developed Python and Apache Airflow ETL pipelines processing about 2M records per day across ServiceNow, AWS, and Oracle reporting systems.",
      "Reduced issue-detection time from 20 hours to under 1 hour and helped increase broadcast reliability from 97.0% to 98.8%."
    ],
    page: "Experience"
  },
  {
    id: "experience",
    source: "site/experience",
    title: "Experience",
    aliases: ["experience", "resume", "background", "work history", "career", "roles"],
    summary:
      "Venky has 7+ years across data analytics, BI, analytics engineering, reporting automation, QA automation, and risk analysis.",
    bullets: [
      "Current role: Data Analytics Engineer at NBCUniversal.",
      "Prior Truckstop.com roles span BI Analyst III / II / I and SDET II/III.",
      "Earlier work includes Risk Analyst at Amazon and Graduate Research Assistant at Illinois Institute of Technology."
    ],
    page: "Experience"
  },
  {
    id: "truckstop",
    source: "content/resume.md",
    title: "Truckstop.com work",
    aliases: ["truckstop", "truckstop.com", "bi analyst", "domo", "revops", "finance reporting", "snowflake cost"],
    summary:
      "At Truckstop.com, Venky worked across BI and QA roles, with the strongest portfolio signal around BI governance, Snowflake/DBT pipelines, Domo administration, and executive reporting.",
    bullets: [
      "Automated RevOps and Finance reporting with DBT + Snowflake pipelines feeding Domo dashboards, eliminating 30+ ad-hoc spreadsheets and saving 20+ hours monthly.",
      "Consolidated 200+ dashboards into 14 Domo apps, increased dataset reuse 50%+, and cut row volume from 25B to 10B.",
      "Optimized Snowflake query costs by 22% and standardized KPIs across Product, Marketing, HR, Customer Success, Finance, and RevOps."
    ],
    page: "Experience"
  },
  {
    id: "projects",
    source: "site/projects",
    title: "Projects",
    aliases: ["projects", "featured work", "case studies", "portfolio projects", "project pages"],
    summary:
      "The project section focuses on practical BI, automation, sports analytics, and sports-tech concepts rather than generic screenshots.",
    bullets: [
      "Interactive Dashboards. Real Metrics: Tableau dashboards for GTM, experiments, and executive KPI reporting.",
      "Trucklexa: a voice-enabled load booking assistant using Alexa, Node.js, Python, and AWS Lambda.",
      "Cricket Performance Analytics Platform: Python and Streamlit app for ball-by-ball cricket analytics.",
      "Patent Pending - Smart Paddle Sensing: pickleball telemetry, analytics, and AI coaching/broadcast concept."
    ],
    page: "Projects"
  },
  {
    id: "tableau",
    source: "projects/tableau",
    title: "Interactive Dashboards. Real Metrics",
    aliases: ["tableau", "dashboards", "interactive dashboards", "real metrics", "executive kpi", "gtm cockpit"],
    summary:
      "The Tableau work is positioned as live dashboarding and reporting work across revenue/GTM, experiments, cohort health, and executive KPI decks.",
    bullets: [
      "Includes pipeline and bookings vs targets, win/loss breakdowns, and cohort health.",
      "Covers experiment and ops boards with uplift vs control, guardrail monitors, and rollout readiness checks.",
      "Frames dashboard work around actual decision support, not static screenshots."
    ],
    page: "Projects"
  },
  {
    id: "trucklexa",
    source: "projects/trucklexa",
    title: "Trucklexa",
    aliases: ["trucklexa", "alexa", "voice assistant", "load booking", "aws lambda", "broker assistant"],
    summary:
      "Trucklexa is a prototype Alexa skill for voice-based load booking. It compresses a multi-screen broker workflow into a spoken request and downstream operational handoff.",
    bullets: [
      "Built with Alexa Skills Kit, Node.js, Python, AWS Lambda, API Gateway, and Truckstop APIs.",
      "The flow covers voice intent, validation, search, confirmation, and telemetry.",
      "The point is workflow reduction and conversational BI, not just a voice demo."
    ],
    page: "Trucklexa project"
  },
  {
    id: "cricket",
    source: "projects/cricket-analyst-raiders",
    title: "Cricket Performance Analytics Platform",
    aliases: ["cricket", "cricket analytics", "cricket project", "performance analytics", "streamlit", "ball-by-ball", "match strategy"],
    summary:
      "The Cricket Performance Analytics Platform is a Python and Streamlit project that scrapes and structures ball-by-ball data into a custom dataset for real-time insights and broadcast-ready metrics.",
    bullets: [
      "Scraped and structured ball-by-ball cricket data into a custom dataset.",
      "Generated real-time insights and broadcast-ready metrics for match strategy.",
      "Supported match planning and a top-4 finish."
    ],
    page: "Cricket project"
  },
  {
    id: "patent",
    source: "projects/ai-analyst",
    title: "Smart Paddle Sensing patent",
    aliases: ["patent", "smart paddle", "paddle sensing", "pickleball sensor", "uspto", "63/934,339", "analytics ecosystem"],
    summary:
      "The smart paddle concept is tied to Venky's patent-pending sports analytics system: Smart Sensor System for Pickleball Paddles and Analytics Ecosystem, USPTO Application No. 63/934,339, filed 2025.",
    bullets: [
      "The concept uses external stickers, edge or handle clips, or embedded meshes to detect impact, spin cues, and sweet-spot accuracy.",
      "Signal processing and AI derive location, force, twist, shot class, and contact quality.",
      "The ecosystem can stream to phones, hubs, or cloud services and support coaching, broadcast, voice, and chat guidance."
    ],
    page: "Smart Paddle Sensing project"
  },
  {
    id: "skills",
    source: "content/resume.md",
    title: "Skills and stack",
    aliases: ["skills", "stack", "tools", "technology", "tech stack", "dbt", "snowflake", "power bi", "python", "tableau"],
    summary:
      "Venky's core stack sits across analytics engineering, BI, orchestration, cloud integrations, programming, and emerging AI workflows.",
    bullets: [
      "Data and modeling: SQL, Snowflake, Redshift, DBT, Matillion, Python, dimensional modeling, ETL/ELT.",
      "BI: Domo, Power BI, Tableau, dashboard design, KPI standardization, data governance, Salesforce reporting.",
      "AI and automation: LLMs, RAG, Google ADK, generative AI APIs, Text-to-SQL, Snowflake Cortex, GitHub Actions, GitLab CI/CD."
    ],
    page: "Experience"
  },
  {
    id: "sports",
    source: "site/sports",
    title: "Sports background",
    aliases: ["sports", "pickleball", "cricket", "soccer", "dupr", "ppa", "mars cricket", "media"],
    summary:
      "The sports page is a personal and media gallery across pickleball, cricket, and soccer. It balances the professional portfolio with competition, coaching, travel, community, and media work.",
    bullets: [
      "Pickleball includes DUPR coaching, PPA Milwaukee, and Minor League Nationals context.",
      "Cricket includes community, content, and Mars Cricket partnership.",
      "Soccer appears as early competitive and training context."
    ],
    page: "Sports"
  },
  {
    id: "contact",
    source: "site/contact",
    title: "Contact",
    aliases: ["contact", "email", "linkedin", "github", "instagram", "dupr", "reach", "message"],
    summary:
      "The Contact page lists direct ways to reach Venky for BI roles, analytics consulting, sports-tech ideas, or project conversations.",
    bullets: [
      "Email: venkateshkishan11@gmail.com.",
      "LinkedIn: linkedin.com/in/venkateshnaidu.",
      "GitHub: github.com/vchandrasekaran.",
      "Also listed: DUPR profile and Instagram @venky_6."
    ],
    page: "Contact"
  },
  {
    id: "education-certifications",
    source: "content/resume.md",
    title: "Education and certifications",
    aliases: ["education", "degree", "certifications", "certified", "illinois tech", "masters", "iit"],
    summary:
      "Venky has an M.S. in Information Technology & Management from Illinois Institute of Technology and a B.E. in Engineering from New Horizon College of Engineering.",
    bullets: [
      "Certifications include AI Agents Intensive Course from Google/Kaggle, Tableau Desktop Qualified Associate, and Microsoft Certified: Data Analyst Associate.",
      "Additional listed training includes Data Analyst with Python from Datacamp and Computer Science with Python from MITx."
    ],
    page: "Experience"
  }
];

function scoreProjectMatch(question: string, chunkId: string) {
  if (!chunkId.startsWith("project:")) return 0;

  const projectId = chunkId.replace("project:", "");
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return 0;

  const q = question.toLowerCase();
  const aliases = [
    project.id.toLowerCase(),
    project.id.toLowerCase().replace(/-/g, " "),
    project.title.toLowerCase(),
    project.title.toLowerCase().split(/[-(:]/)[0]?.trim()
  ].filter(Boolean);

  if (aliases.some((alias) => alias && q.includes(alias))) return 600;

  const titleWords = project.title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);
  const overlap = titleWords.filter((word) => q.includes(word)).length;
  return overlap >= 2 ? 700 : overlap === 1 ? 220 : 0;
}

function scoreGuideMatch(question: string, chunkId: string) {
  if (!chunkId.startsWith("guide:")) return 0;

  const topicId = chunkId.replace("guide:", "");
  const topic = GUIDE_TOPICS.find((item) => item.id === topicId);
  if (!topic) return 0;

  const q = question.toLowerCase();
  const exactAlias = topic.aliases.some((alias) => q.includes(alias.toLowerCase()));
  if (exactAlias) {
    if (topic.id === "site-overview") {
      const specificTerms = [
        "project",
        "sports",
        "contact",
        "github",
        "email",
        "linkedin",
        "experience",
        "resume",
        "truckstop",
        "nbc",
        "patent",
        "cricket",
        "skill",
        "stack"
      ];
      return specificTerms.some((term) => q.includes(term)) ? 120 : 950;
    }

    return 950;
  }

  const aliasTerms = topic.aliases
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9+./-]+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
  const overlap = aliasTerms.filter((word) => q.includes(word)).length;
  return overlap >= 2 ? 650 : overlap === 1 ? 260 : 0;
}

const SITE_GUIDE_DOCS: RawChunk[] = [
  {
    id: "site/home",
    source: "site/home",
    chunkIndex: 0,
    text:
      "This website is Venkatesh Naidu's portfolio. The home page presents him as a business intelligence and data analytics professional focused on trusted pipelines, clean dashboards, decision support, automation, and sports-tech ideas. It uses a sports snapshot theme with a 3D avatar, ratings-style skill cards, and sections for workflow, the website assistant, projects, experience, sports, and contact."
  },
  {
    id: "site/navigation",
    source: "site/navigation",
    chunkIndex: 0,
    text:
      "Main routes on the website are Home, Projects, Experience, Sports, and Contact. Public project links currently include Trucklexa, Cricket Performance Analytics Platform, Smart Paddle Sensing, and Tableau dashboards."
  },
  {
    id: "site/experience",
    source: "site/experience",
    chunkIndex: 0,
    text:
      "The experience page summarizes Venkatesh Naidu's current Data Analytics Engineer role at NBCUniversal, prior Truckstop.com roles across BI Analyst and SDET positions, earlier work at Amazon.com, education at Illinois Institute of Technology and New Horizon College of Engineering, plus sports and media milestones."
  },
  {
    id: "site/current-role",
    source: "site/experience",
    chunkIndex: 1,
    text:
      "At NBCUniversal, Venkatesh Naidu is a Data Analytics Engineer. He built the first end-to-end Power BI dashboard for sports broadcast reliability across 10,000+ hours of live broadcasts, developed Python and Apache Airflow ETL pipelines processing about 2M records per day across ServiceNow, AWS, and Oracle reporting systems, reduced issue-detection time from 20 hours to under 1 hour, and helped increase broadcast reliability from 97.0% to 98.8%."
  },
  {
    id: "site/patent",
    source: "site/projects",
    chunkIndex: 0,
    text:
      "The Smart Paddle Sensing project is tied to Venkatesh Naidu's patent-pending concept: Inventor on \"Smart Sensor System for Pickleball Paddles and Analytics Ecosystem,\" USPTO Application No. 63/934,339, filed 2025. The project describes a telemetry platform for pickleball paddles with sensing, analytics, multi-device fusion, and an LLM agent for coaching, broadcast, voice, and chat guidance."
  },
  {
    id: "site/sports",
    source: "site/sports",
    chunkIndex: 0,
    text:
      "The sports page is a visual gallery across pickleball, cricket, and soccer. It highlights competition, coaching, travel, community work, and media content."
  },
  {
    id: "site/contact",
    source: "site/contact",
    chunkIndex: 0,
    text:
      "The contact page lists direct ways to reach Venky and Venkatesh Naidu, including email at venkateshkishan11@gmail.com, LinkedIn at linkedin.com/in/venkateshnaidu, GitHub at github.com/vchandrasekaran, a DUPR profile, and Instagram at @venky_6. It invites outreach for BI roles, analytics consulting, sports-tech ideas, and project discussions."
  }
];

function scoreChunk(question: string, text: string) {
  const qWords = question
    .toLowerCase()
    .split(/[^a-z0-9+./-]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  if (!qWords.length) return 0;

  const qText = question.trim().toLowerCase();
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of qWords) if (t.includes(w)) hits += w.length >= 6 ? 2 : 1;

  const phraseBonus = qText.length >= 8 && t.includes(qText) ? 140 : 0;
  return hits * 90 + phraseBonus - Math.round(Math.min(text.length, 2200) / 320);
}

function chunk(md: string, size = 900) {
  const parts = md.split(/\n(?=# |\*\*|## |- |\d+\. )/);
  const chunks: string[] = [];
  let buf = "";
  for (const p of parts) {
    if ((buf + "\n" + p).length > size) {
      if (buf) chunks.push(buf.trim());
      buf = p;
    } else {
      buf += "\n" + p;
    }
  }
  if (buf) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function buildProjectDocs() {
  return PROJECTS.map((project, index) => ({
    id: `project:${project.id}`,
    source: `projects/${project.id}`,
    chunkIndex: index,
    text: `${project.title}. ${project.desc} Status: ${project.status}. Tag: ${project.tag}. Highlights: ${project.highlights.join(
      " "
    )}`
  }));
}

function buildGuideDocs() {
  return GUIDE_TOPICS.map((topic, index) => ({
    id: `guide:${topic.id}`,
    source: topic.source,
    chunkIndex: index,
    text: `${topic.title}. ${topic.summary} ${topic.bullets?.join(" ") ?? ""} ${topic.page ? `Page: ${topic.page}.` : ""}`
  }));
}

async function loadContentDocs(baseDir: string) {
  if (cachedChunks && cachedBase === baseDir) return cachedChunks;
  const contentDir = path.join(baseDir, "content");
  const mdFiles = (await walk(contentDir)).filter((f) => /\.(md|mdx|txt)$/i.test(f));
  const files = [...mdFiles];
  const docs: RawChunk[] = [];
  for (const file of files) {
    try {
      const text = await fs.readFile(file, "utf-8");
      const rel = path.relative(baseDir, file);
      const parts = chunk(text);
      parts.forEach((part, idx) => {
        docs.push({ id: `${rel}#${idx}`, source: rel, chunkIndex: idx, text: part });
      });
    } catch {
      // ignore missing files
    }
  }
  cachedChunks = [...buildGuideDocs(), ...SITE_GUIDE_DOCS, ...buildProjectDocs(), ...docs];
  cachedBase = baseDir;
  return cachedChunks;
}

export async function retrieveKnowledge(question: string, baseDir = process.cwd(), limit = 3) {
  const q = question.trim();
  if (!q) return { chunks: [] as KnowledgeChunk[], context: "", sources: [] as { source: string }[] };

  const docs = await loadContentDocs(baseDir);
  let candidates: KnowledgeChunk[] = docs.map((c) => ({
    ...c,
    score: scoreChunk(q, c.text) + scoreProjectMatch(q, c.id) + scoreGuideMatch(q, c.id)
  }));

  candidates = candidates.filter((candidate) => candidate.score > 0);
  candidates.sort((a, b) => b.score - a.score);
  const bestScore = candidates[0]?.score ?? 0;
  const minScore = Math.max(100, Math.round(bestScore * 0.7));
  const top = candidates.filter((candidate) => candidate.score >= minScore).slice(0, limit);
  const context = top.map((c) => `Source: ${c.source}\n${c.text}`).join("\n\n");
  const sources = top.map((c) => ({ source: c.source }));
  return { chunks: top, context, sources };
}

function questionTerms(question: string) {
  return question
    .toLowerCase()
    .split(/[^a-z0-9+./-]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function cleanText(text: string) {
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractUsefulLines(text: string, terms: string[]) {
  const lines = text
    .split(/\n+/)
    .map((line) => cleanText(line.replace(/^[-*]\s*/, "")))
    .filter(Boolean);

  const matching = lines.filter((line) => {
    const lower = line.toLowerCase();
    return terms.some((term) => lower.includes(term));
  });

  return (matching.length ? matching : lines).slice(0, 4);
}

function projectAnswer(chunks: KnowledgeChunk[]) {
  const projectChunk = chunks.find((chunk) => chunk.id.startsWith("project:"));
  if (!projectChunk) return null;

  const projectId = projectChunk.id.replace("project:", "");
  const project = PROJECTS.find((item) => item.id === projectId);
  if (!project) return null;

  return [
    `${project.title} is a ${project.status.toLowerCase()} project. ${project.desc}`,
    "",
    "The main points on the site are:",
    ...project.highlights.slice(0, 4).map((highlight) => `- ${highlight}`)
  ].join("\n");
}

function guideAnswer(chunks: KnowledgeChunk[]) {
  const guideChunk = chunks.find((chunk) => chunk.id.startsWith("guide:"));
  if (!guideChunk) return null;

  const topicId = guideChunk.id.replace("guide:", "");
  const topic = GUIDE_TOPICS.find((item) => item.id === topicId);
  if (!topic) return null;

  const parts = [topic.summary];
  if (topic.bullets?.length) {
    parts.push("");
    parts.push(...topic.bullets.slice(0, 4).map((bullet) => `- ${bullet}`));
  }
  if (topic.page) parts.push("", `You can find this on the ${topic.page} page.`);
  return parts.join("\n");
}

function directContactAnswer(question: string, chunks: KnowledgeChunk[]) {
  const q = question.toLowerCase();
  const hasContactContext = chunks.some((chunk) => chunk.source === "site/contact" || chunk.source.includes("resume"));
  if (!hasContactContext) return null;

  if (q.includes("contact") || q.includes("reach") || q.includes("message")) {
    return [
      "The best direct contact is email or LinkedIn.",
      "",
      "- Email: venkateshkishan11@gmail.com.",
      "- LinkedIn: linkedin.com/in/venkateshnaidu.",
      "- GitHub: github.com/vchandrasekaran.",
      "- The Contact page also lists his DUPR profile and Instagram @venky_6."
    ].join("\n");
  }

  if (q.includes("github")) {
    return "His GitHub is github.com/vchandrasekaran. The site lists it on the Contact page and in the resume content.";
  }

  if (q.includes("email")) {
    return "His email is venkateshkishan11@gmail.com. The Contact page presents email and LinkedIn as the cleanest ways to start a conversation.";
  }

  if (q.includes("linkedin")) {
    return "His LinkedIn is linkedin.com/in/venkateshnaidu. It is listed on the Contact page and resume content.";
  }

  return null;
}

function directHomeAnswer(question: string, chunks: KnowledgeChunk[]) {
  const q = question.toLowerCase();
  const homeChunk = chunks.find((chunk) => chunk.source === "site/home");
  if (!homeChunk || !(q.includes("website") || q.includes("site") || q.includes("portfolio"))) return null;

  return "This is Venkatesh Naidu's portfolio website. It presents his business intelligence and data analytics work, project case studies, sports background, contact details, and a sports-snapshot themed homepage with a 3D avatar and ratings-style skill cards.";
}

function directFactAnswer(question: string, chunks: KnowledgeChunk[]) {
  const q = question.toLowerCase();
  const hasSportsContext = chunks.some((chunk) => chunk.source === "site/sports" || chunk.id === "guide:sports");

  if (
    hasSportsContext &&
    (q.includes("which sports") || q.includes("what sports") || q.includes("sports did") || q.includes("sports has"))
  ) {
    return "Venky has played pickleball, cricket, and soccer.";
  }

  return null;
}

export function summarizeChunks(question: string, chunks: KnowledgeChunk[]) {
  if (!chunks.length) {
    return "I do not see that detail published on the website yet. I can answer from the portfolio pages about Venky's experience, projects, sports background, contact details, and the site structure.";
  }

  const fact = directFactAnswer(question, chunks);
  if (fact) return fact;

  const contact = directContactAnswer(question, chunks);
  if (contact) return contact;

  const home = directHomeAnswer(question, chunks);
  if (home) return home;

  const guide = guideAnswer(chunks);
  if (guide) return guide;

  const project = projectAnswer(chunks);
  if (project) return project;

  const terms = questionTerms(question);
  const usefulLines = chunks.flatMap((chunk) => extractUsefulLines(chunk.text, terms)).slice(0, 5);
  const first = usefulLines[0] ?? cleanText(chunks[0].text);
  const rest = usefulLines.slice(1, 4);

  if (!rest.length) return first;

  return [`From the site: ${first}`, ...rest.map((line) => `- ${line}`)].join("\n");
}

export function helpResponse() {
  return [
    "I can walk through what is published on this portfolio site.",
    "",
    "Good questions to ask:",
    "- What projects are featured on the site?",
    "- What does Venky do at NBCUniversal?",
    "- What was Venky's role at Truckstop.com?",
    "- Tell me about the smart paddle patent.",
    "- What is the cricket analytics project?",
    "- How can I contact Venky?",
    "- What sports are covered in the gallery?"
  ].join("\n");
}
