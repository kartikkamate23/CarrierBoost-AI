// Skill ontology for semantic keyword matching.
//
// The rubric scores a competency as "missing" when its literal name is absent
// from the resume, which produced false negatives that understated the score:
// "orchestrated K8s jobs" did not demonstrate `kubernetes`, "tuned PostgreSQL"
// did not demonstrate `sql`, and "built dashboards" did not demonstrate
// `dashboard` because the plural broke the word boundary.
//
// This module resolves a rubric key to the surface forms that genuinely
// evidence it. It is deliberately dependency-free and deterministic so it runs
// in the browser for guest analysis, where resume text must never leave the
// device.
//
// EXTENSION POINT: `matchSkill` returns the `kind` of match it made. An
// embedding tier (in-browser MiniLM via transformers.js) can add
// `kind: "semantic"` for evidence that no surface form catches, without any
// caller needing to change.

export type SkillMatchKind = "exact" | "alias";

export type SkillMatch = {
  /** The rubric key that was satisfied. */
  key: string;
  /** The surface form actually found in the text. */
  form: string;
  kind: SkillMatchKind;
};

/**
 * Surface forms that count as evidence of a rubric key.
 *
 * Entries are conservative on purpose. A false positive inflates a score and
 * tells someone their resume is ready when it is not, which is worse than the
 * false negative it replaces — so a term is listed only when its presence
 * genuinely implies the competency. Ambiguous abbreviations are excluded:
 * "TS" is Top Secret clearance at least as often as TypeScript.
 */
const aliases: Record<string, string[]> = {
  // --- Languages and querying ---------------------------------------------
  python: ["python3", "cpython"],
  sql: [
    "postgresql",
    "postgres",
    "mysql",
    "mariadb",
    "sql server",
    "mssql",
    "t-sql",
    "tsql",
    "pl/sql",
    "plsql",
    "sqlite",
    "ansi sql",
  ],
  java: ["java 8", "java 11", "java 17", "core java", "j2ee", "java ee", "jvm"],
  javascript: ["js", "es6", "es2015", "ecmascript", "vanilla js"],
  typescript: ["type-script"],
  node: ["nodejs", "node.js", "node js", "express", "express.js", "nestjs", "nest.js"],

  // --- Data engineering ----------------------------------------------------
  spark: ["apache spark", "pyspark", "spark sql", "spark streaming"],
  airflow: ["apache airflow", "airflow dag", "airflow dags", "mwaa", "cloud composer"],
  etl: ["elt", "extract transform load", "extract, transform, load", "extract and load"],
  "data pipeline": [
    "data pipelines",
    "etl pipeline",
    "elt pipeline",
    "ingestion pipeline",
    "streaming pipeline",
    "batch pipeline",
    "data workflow",
  ],
  kafka: ["apache kafka", "kafka streams", "confluent kafka", "amazon msk"],
  warehouse: [
    "data warehouse",
    "data warehousing",
    "snowflake",
    "redshift",
    "bigquery",
    "synapse",
    "star schema",
    "dimensional model",
  ],

  // --- Cloud and platform --------------------------------------------------
  aws: ["amazon web services", "aws lambda", "amazon s3", "amazon ec2", "s3", "ec2", "redshift"],
  cloud: [
    "aws",
    "azure",
    "gcp",
    "google cloud",
    "amazon web services",
    "cloud native",
    "serverless",
    "terraform",
    "kubernetes",
    "k8s",
  ],
  kubernetes: ["k8s", "kubectl", "helm", "eks", "gke", "aks"],
  docker: [
    "dockerfile",
    "docker compose",
    "containerized",
    "containerised",
    "containerization",
    "containerisation",
    "container",
    "podman",
  ],

  // --- Analytics -----------------------------------------------------------
  excel: ["microsoft excel", "ms excel", "spreadsheet", "pivot table", "vlookup", "power query"],
  "power bi": ["powerbi", "power-bi", "microsoft power bi", "dax"],
  tableau: ["tableau desktop", "tableau server"],
  statistics: [
    "statistical",
    "statistical analysis",
    "hypothesis testing",
    "regression",
    "a/b testing",
    "descriptive statistics",
    "inferential statistics",
  ],
  dashboard: ["dashboarding", "bi dashboard", "reporting dashboard"],
  "data visualization": [
    "data visualisation",
    "data viz",
    "dataviz",
    "visualization",
    "visualisation",
    "charting",
  ],
  stakeholder: ["cross-functional", "business users", "product owners", "client-facing"],
  insights: ["actionable insight", "business insight", "data-driven decision"],

  // --- AI / agentic --------------------------------------------------------
  llm: [
    "large language model",
    "language model",
    "gpt",
    "gpt-4",
    "claude",
    "gemini",
    "llama",
    "foundation model",
  ],
  rag: [
    "retrieval augmented generation",
    "retrieval-augmented generation",
    "retrieval augmented",
    "semantic search",
    "vector retrieval",
  ],
  agents: [
    "agentic",
    "ai agent",
    "multi-agent",
    "autonomous agent",
    "tool calling",
    "function calling",
  ],
  langchain: [
    "lang chain",
    "langgraph",
    "llamaindex",
    "llama index",
    "semantic kernel",
    "haystack",
  ],
  "vector database": [
    "vector db",
    "vector store",
    "vector index",
    "embedding store",
    "pinecone",
    "weaviate",
    "qdrant",
    "chroma",
    "chromadb",
    "faiss",
    "milvus",
    "pgvector",
  ],
  evaluation: ["eval", "evals", "model evaluation", "benchmarking", "offline evaluation", "ragas"],
  "prompt engineering": [
    "prompting",
    "prompt design",
    "few-shot",
    "few shot",
    "chain of thought",
    "chain-of-thought",
    "system prompt",
    "prompt template",
  ],

  // --- Web and engineering practice ---------------------------------------
  react: ["reactjs", "react.js", "react js", "react native", "next.js", "nextjs", "jsx", "redux"],
  css: ["css3", "sass", "scss", "tailwind", "tailwind css", "styled-components", "bootstrap"],
  html: ["html5", "semantic html", "semantic markup"],
  api: ["rest api", "restful", "graphql", "grpc", "endpoint", "openapi", "swagger", "web service"],
  microservices: ["microservice", "micro-services", "micro services", "service mesh", "soa"],
  testing: [
    "unit test",
    "unit testing",
    "integration testing",
    "end-to-end test",
    "e2e test",
    "tdd",
    "test-driven",
    "jest",
    "vitest",
    "pytest",
    "cypress",
    "playwright",
    "junit",
    "selenium",
    "testing library",
  ],
  accessibility: ["a11y", "wcag", "aria", "screen reader", "accessible design", "section 508"],
  git: ["github", "gitlab", "bitbucket", "version control", "pull request", "code review"],
  performance: [
    "performance optimization",
    "performance optimisation",
    "latency",
    "lighthouse",
    "core web vitals",
    "caching",
    "profiling",
  ],
  security: [
    "secure coding",
    "authentication",
    "authorization",
    "oauth",
    "jwt",
    "encryption",
    "owasp",
    "vulnerability",
    "rbac",
    "penetration testing",
  ],

  // --- Fallback competencies (used when no role map matches) ---------------
  communication: [
    "communicate",
    "communicated",
    "presentation",
    "presented",
    "written communication",
    "verbal communication",
    "documentation",
  ],
  "problem solving": [
    "problem-solving",
    "troubleshooting",
    "troubleshot",
    "debugging",
    "debugged",
    "root cause",
    "diagnosed",
  ],
  teamwork: [
    "collaborated",
    "collaboration",
    "cross-functional",
    "pair programming",
    "agile",
    "scrum",
  ],
  project: ["project management", "delivered", "shipped", "launched"],
  results: ["outcome", "impact", "achieved", "improved", "increased", "reduced"],
  leadership: ["led", "leading", "mentored", "mentoring", "managed", "team lead", "supervised"],
};

/**
 * Plural and singular variants of the last word of a term.
 *
 * The rubric's word-boundary matching treats "dashboards" as a non-match for
 * "dashboard", so a resume that reads naturally scores worse than one that
 * copies the rubric's exact wording. Only number is varied — tense variants
 * such as "-ed" and "-ing" change meaning too often to infer safely.
 */
function morphologicalVariants(term: string): string[] {
  const words = term.split(" ");
  const last = words[words.length - 1];
  const rest = words.slice(0, -1);
  const rebuild = (word: string) => [...rest, word].join(" ");
  const variants: string[] = [];

  if (last.endsWith("ies") && last.length > 4) {
    variants.push(rebuild(`${last.slice(0, -3)}y`));
  } else if (last.endsWith("ses") || last.endsWith("xes") || last.endsWith("ches")) {
    variants.push(rebuild(last.slice(0, -2)));
  } else if (last.endsWith("s") && !last.endsWith("ss") && last.length > 3) {
    variants.push(rebuild(last.slice(0, -1)));
  } else if (last.endsWith("y") && last.length > 2) {
    variants.push(rebuild(`${last.slice(0, -1)}ies`));
  } else if (last.endsWith("s") || last.endsWith("x") || last.endsWith("ch")) {
    variants.push(rebuild(`${last}es`));
  } else if (last.length > 2) {
    variants.push(rebuild(`${last}s`));
  }

  return variants;
}

const surfaceFormCache = new Map<string, string[]>();

/**
 * Every surface form that counts as evidence of `key`, longest first so the
 * most specific match wins and the quoted evidence stays readable.
 */
export function surfaceFormsFor(key: string): string[] {
  const cached = surfaceFormCache.get(key);
  if (cached) return cached;

  const base = [key, ...(aliases[key] ?? [])];
  const withMorphology = base.flatMap((term) => [term, ...morphologicalVariants(term)]);
  const unique = Array.from(new Set(withMorphology.map((term) => term.toLowerCase())));
  unique.sort((a, b) => b.length - a.length);

  surfaceFormCache.set(key, unique);
  return unique;
}

/** Word-boundary containment; `[^a-z0-9]` keeps "nosql" from matching "sql". */
export function containsForm(value: string, form: string): boolean {
  return new RegExp(
    `(?:^|[^a-z0-9])${form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|[^a-z0-9])`,
    "i",
  ).test(value);
}

/**
 * Resolves whether `value` evidences `key`, reporting which surface form
 * matched so callers can quote the right span of text.
 */
export function matchSkill(value: string, key: string): SkillMatch | null {
  for (const form of surfaceFormsFor(key)) {
    if (!containsForm(value, form)) continue;
    return { key, form, kind: form === key.toLowerCase() ? "exact" : "alias" };
  }
  return null;
}

/** True when `value` evidences `key` by any recognised surface form. */
export function evidencesSkill(value: string, key: string): boolean {
  return matchSkill(value, key) !== null;
}
