import { brihatlabsCoursePath, recommendBrihatLabsCourses } from "./brihatlabs-courses.ts";

export const RUBRIC_VERSION = "careerboost-2026.2";

export type ScoreKey =
  | "ats"
  | "roleMatch"
  | "keywords"
  | "completeness"
  | "impact"
  | "readability"
  | "formatting"
  | "projects"
  | "experience"
  | "readiness";
export type KeywordStatus = "demonstrated" | "weak" | "missing" | "insufficient";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type ScoreDetail = {
  key: ScoreKey;
  label: string;
  score: number;
  status: string;
  definition: string;
  detected: string;
  evidence: string[];
  issues: string[];
  missing: string;
  calculation: string;
  weight: number;
  effect: string;
  action: string;
  expectedGain: number;
};
export type KeywordEvidence = {
  key: string;
  name: string;
  status: KeywordStatus;
  evidence: string[];
  why: string;
  missing: string;
  action: string;
  related: string;
};
export type AchievementElement = {
  label: string;
  status: "met" | "partial" | "missing";
  evidence: string;
};
export type AchievementAnalysis = {
  definition: string;
  measurableBullets: number;
  totalBullets: number;
  elements: AchievementElement[];
  strongBullets: string[];
  weakBullets: string[];
  framework: string;
};
export type ProofType = { type: string; required: boolean };
export type SkillGap = {
  skill: string;
  key: string;
  importance: "High" | "Medium";
  evidence: string;
  requiredLevel: ExperienceLevel;
  action: string;
  lesson: string;
  proof: string;
  proofTypes: ProofType[];
  deliverables: string[];
  hours: number;
};
export type CareerAnalysis = {
  rubricVersion: string;
  role: string;
  scores: ScoreDetail[];
  overall: number;
  topProblems: ScoreDetail[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywords: KeywordEvidence[];
  achievement: AchievementAnalysis;
  gaps: SkillGap[];
};
export type RoadmapPreview = {
  level: ExperienceLevel;
  skill: string;
  changes: string[];
  lessonsAdded: string[];
  lessonsSkipped: string[];
  difficulty: string;
  estimatedHours: number;
  projectType: string;
  proof: string;
  expectedLevel: string;
};
export type ProofRoadmap = Record<string, ExperienceLevel>;

const roleMaps: Record<string, string[]> = {
  "data engineer": [
    "python",
    "sql",
    "spark",
    "airflow",
    "etl",
    "data pipeline",
    "aws",
    "docker",
    "kafka",
    "warehouse",
  ],
  "data analyst": [
    "sql",
    "excel",
    "python",
    "power bi",
    "tableau",
    "statistics",
    "dashboard",
    "data visualization",
    "stakeholder",
    "insights",
  ],
  "agentic ai engineer": [
    "python",
    "llm",
    "rag",
    "agents",
    "langchain",
    "vector database",
    "evaluation",
    "prompt engineering",
    "api",
    "docker",
  ],
  "frontend engineer": [
    "javascript",
    "typescript",
    "react",
    "css",
    "html",
    "testing",
    "accessibility",
    "api",
    "git",
    "performance",
  ],
  "backend engineer": [
    "java",
    "python",
    "node",
    "sql",
    "api",
    "microservices",
    "docker",
    "cloud",
    "testing",
    "security",
  ],
};
const displayNames: Record<string, string> = {
  spark: "Apache Spark",
  airflow: "Apache Airflow",
  etl: "ETL",
  aws: "AWS",
  "data pipeline": "Data Pipelines",
  sql: "SQL",
  api: "API",
  rag: "RAG",
  llm: "LLM",
  kafka: "Apache Kafka",
  docker: "Docker",
  "power bi": "Power BI",
};
const definitions: Record<Exclude<ScoreKey, "readiness">, string> = {
  ats: "How reliably the resume can be parsed and understood by applicant-tracking systems.",
  roleMatch: "How strongly verified resume evidence aligns with the selected role competency map.",
  keywords:
    "The percentage of unique priority role keywords demonstrated in meaningful resume context.",
  completeness:
    "Whether the resume includes useful summary, skills, experience, education, and project evidence.",
  impact:
    "How effectively bullets show a clear action, technical or business scope, individual contribution, and measurable result.",
  readability: "How quickly a recruiter can understand sentences, bullets, and evidence.",
  formatting:
    "How consistently the text uses ATS-safe structure, section hierarchy, and a sensible length.",
  projects: "How well projects demonstrate skills and deliverables relevant to the target role.",
  experience: "How clearly experience demonstrates relevant ownership, tools, scope, and outcomes.",
};
const labels: Record<ScoreKey, string> = {
  ats: "ATS compatibility",
  roleMatch: "Target-role match",
  keywords: "Keyword coverage",
  completeness: "Resume completeness",
  impact: "Achievement impact",
  readability: "Readability",
  formatting: "Formatting",
  projects: "Project relevance",
  experience: "Experience relevance",
  readiness: "Overall job readiness",
};
export const SCORE_WEIGHTS: Record<Exclude<ScoreKey, "readiness">, number> = {
  ats: 15,
  roleMatch: 15,
  keywords: 12,
  completeness: 10,
  impact: 15,
  readability: 8,
  formatting: 8,
  projects: 9,
  experience: 8,
};
const actionWords = [
  "built",
  "led",
  "created",
  "improved",
  "reduced",
  "increased",
  "designed",
  "delivered",
  "implemented",
  "automated",
  "optimized",
  "developed",
  "owned",
];
const scopeWords = [
  "pipeline",
  "system",
  "platform",
  "service",
  "dashboard",
  "workflow",
  "model",
  "process",
  "application",
  "customer",
  "business",
  "data",
];
const metricPattern =
  /\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?[kKmMbB+]\b|\b\d+\s*(?:users|clients|hours|days|records|projects|seconds|minutes|requests|rows|gb|tb)\b/i;
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const includesTerm = (value: string, term: string) =>
  new RegExp(
    `(?:^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|[^a-z0-9])`,
    "i",
  ).test(value);

const skillsInventoryPattern =
  /^(?:technical\s+)?(?:skills|technologies|tools|tech(?:nology)? stack|programming languages)\b/i;

function isSkillsInventory(value: string) {
  const separators = value.match(/[,|;/]/g)?.length ?? 0;
  return skillsInventoryPattern.test(value) || separators >= 7;
}

function compactKeywordEvidence(value: string, key: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 180) return normalized;

  const index = normalized.toLocaleLowerCase().indexOf(key.toLocaleLowerCase());
  if (index < 0) return `${normalized.slice(0, 177).trimEnd()}…`;

  const start = Math.max(0, index - 70);
  const end = Math.min(normalized.length, index + key.length + 95);
  return `${start > 0 ? "…" : ""}${normalized
    .slice(start, end)
    .trim()}${end < normalized.length ? "…" : ""}`;
}
export function scoreStatus(score: number) {
  return score < 40
    ? "Needs attention"
    : score < 60
      ? "Developing"
      : score < 75
        ? "Good"
        : score < 90
          ? "Strong"
          : "Excellent";
}

function evidenceForKeyword(raw: string, key: string): KeywordEvidence {
  const sentences = raw
    .split(/\n+|(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const found = sentences.filter((sentence) => includesTerm(sentence, key));
  const meaningful = found.filter((sentence) => {
    const keywordIndex = sentence.toLocaleLowerCase().indexOf(key.toLocaleLowerCase());
    const localContext =
      keywordIndex < 0
        ? sentence
        : sentence.slice(Math.max(0, keywordIndex - 90), keywordIndex + key.length + 90);
    const hasAction = actionWords.some((word) => includesTerm(sentence, word));
    const hasMetric = metricPattern.test(sentence);
    const hasNearbyScope = scopeWords.some((word) => includesTerm(localContext, word));

    // A skills inventory proves that a term was mentioned, not that it was applied.
    return hasAction || hasMetric || (!isSkillsInventory(sentence) && hasNearbyScope);
  });
  const status: KeywordStatus = meaningful.length
    ? "demonstrated"
    : found.length
      ? "weak"
      : "missing";
  const name = displayNames[key] ?? key.replace(/\b\w/g, (char) => char.toUpperCase());
  return {
    key,
    name,
    status,
    evidence: (meaningful.length ? meaningful : found)
      .map((sentence) => compactKeywordEvidence(sentence, key))
      .filter((sentence, index, all) => all.indexOf(sentence) === index)
      .slice(0, 2),
    why: `${name} is a priority competency for the selected role.`,
    missing:
      status === "demonstrated"
        ? "No critical evidence gap detected."
        : status === "weak"
          ? "The term is present, but no action, scope, project, or result supports it."
          : `No ${name} evidence was found in experience, projects, achievements, certifications, or supported technical work.`,
    action:
      status === "demonstrated"
        ? "Keep the strongest evidence concise and measurable."
        : `Demonstrate ${name} through a guided lab or role-specific project.`,
    related: `${name} fundamentals and applied proof lab`,
  };
}

function achievementAnalysis(raw: string): AchievementAnalysis {
  const candidates = raw
    .split(/\n+|[•●▪]|(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 18 && actionWords.some((word) => includesTerm(value, word)));
  const measurable = candidates.filter((value) => metricPattern.test(value));
  const all = candidates.length
    ? candidates
    : raw
        .split(/(?<=[.!?])\s+/)
        .map((value) => value.trim())
        .filter((value) => value.length > 25)
        .slice(0, 8);
  const count = (test: (value: string) => boolean) => all.filter(test).length;
  const total = Math.max(all.length, 1);
  const element = (label: string, value: number, evidence: string): AchievementElement => ({
    label,
    status: value / total >= 0.6 ? "met" : value > 0 ? "partial" : "missing",
    evidence,
  });
  const metrics = count((value) => metricPattern.test(value));
  const actions = count((value) => actionWords.some((word) => includesTerm(value, word)));
  const scopes = count((value) => scopeWords.some((word) => includesTerm(value, word)));
  const contribution = count((value) =>
    /\b(i|my|owned|led|implemented|built|designed|developed)\b/i.test(value),
  );
  const business = count((value) =>
    /\b(revenue|cost|quality|customer|conversion|risk|reliability|efficiency|time|performance)\b/i.test(
      value,
    ),
  );
  return {
    definition: definitions.impact,
    measurableBullets: measurable.length,
    totalBullets: all.length,
    elements: [
      element("Action verb", actions, `${actions} of ${total} bullets`),
      element("Technical scope", scopes, `${scopes} of ${total} bullets`),
      element("Individual contribution", contribution, `${contribution} of ${total} bullets`),
      element("Measurable result", metrics, `${metrics} of ${total} bullets`),
      element("Business outcome", business, `${business} of ${total} bullets`),
    ],
    strongBullets: measurable.slice(0, 3),
    weakBullets: all.filter((value) => !metricPattern.test(value)).slice(0, 3),
    framework: "Action + technical scope + verified scale + measurable result",
  };
}

const proofCatalog: Record<
  string,
  { lesson: string; proof: string; types: string[]; deliverables: string[]; hours: number }
> = {
  spark: {
    lesson: "Spark fundamentals and guided PySpark transformation lab",
    proof: "PySpark batch-processing pipeline",
    types: ["GitHub repository", "Code submission", "Project report"],
    deliverables: [
      "Working PySpark pipeline",
      "Sample input and output",
      "README with architecture explanation",
      "Execution screenshot or automated test result",
    ],
    hours: 6,
  },
  airflow: {
    lesson: "Airflow DAG design, dependencies, retries, and observability lab",
    proof: "Scheduled production-style Airflow DAG",
    types: ["GitHub repository", "Code submission", "Architecture diagram"],
    deliverables: [
      "DAG with dependencies",
      "Retries and logging",
      "Local execution instructions",
      "Successful run evidence",
    ],
    hours: 6,
  },
  etl: {
    lesson: "Validated ETL workflow lab",
    proof: "Extract-transform-load workflow with validation",
    types: ["GitHub repository", "Code submission", "Project report"],
    deliverables: [
      "Source connector",
      "Documented transformations",
      "Data validation checks",
      "Output reconciliation report",
    ],
    hours: 5,
  },
  "data pipeline": {
    lesson: "End-to-end data pipeline architecture lab",
    proof: "Implemented pipeline from ingestion to serving",
    types: ["GitHub repository", "Architecture diagram", "Demo link"],
    deliverables: [
      "Pipeline code",
      "Architecture diagram",
      "Failure and retry strategy",
      "Working demo or execution evidence",
    ],
    hours: 7,
  },
  aws: {
    lesson: "AWS data workflow deployment lab",
    proof: "Deployed or fully documented cloud data workflow",
    types: ["GitHub repository", "Architecture diagram", "Certificate"],
    deliverables: [
      "Infrastructure definition or deployment guide",
      "IAM and security notes",
      "Cost assumptions",
      "Execution evidence",
    ],
    hours: 7,
  },
};
function gapFor(key: string, index: number): SkillGap {
  const item = proofCatalog[key] ?? {
    lesson: `${displayNames[key] ?? key} applied fundamentals lab`,
    proof: `Role-specific ${displayNames[key] ?? key} implementation`,
    types: ["GitHub repository", "Assessment"],
    deliverables: ["Working implementation", "README with decisions", "Test or assessment result"],
    hours: 4,
  };
  const skill = displayNames[key] ?? key.replace(/\b\w/g, (char) => char.toUpperCase());
  return {
    skill,
    key,
    importance: index < 3 ? "High" : "Medium",
    evidence: "No supporting evidence found in your resume",
    requiredLevel: index < 3 ? "Intermediate" : "Beginner",
    action: `Complete ${item.lesson}.`,
    lesson: item.lesson,
    proof: item.proof,
    proofTypes: item.types.map((type) => ({ type, required: true })),
    deliverables: item.deliverables,
    hours: item.hours,
  };
}

function detail(
  key: Exclude<ScoreKey, "readiness">,
  score: number,
  detected: string,
  evidence: string[],
  issues: string[],
  calculation: string,
  action: string,
  gain: number,
): ScoreDetail {
  return {
    key,
    label: labels[key],
    score: clamp(score),
    status: scoreStatus(score),
    definition: definitions[key],
    detected,
    evidence,
    issues,
    missing: issues.join(", ") || "No critical issue detected",
    calculation,
    weight: SCORE_WEIGHTS[key],
    effect: `Contributes ${SCORE_WEIGHTS[key]}% of overall job readiness.`,
    action,
    expectedGain: gain,
  };
}

export function analyzeCareerReadiness(
  resumeText: string,
  targetRole: string,
  jobDescription = "",
): CareerAnalysis {
  const raw = resumeText.replace(/\r/g, "").trim();
  const text = raw.toLowerCase();
  const role = targetRole.trim() || "Target role";
  const mapKey = Object.keys(roleMaps).find((key) => role.toLowerCase().includes(key));
  const jdTerms = Array.from(
    new Set(jobDescription.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) ?? []),
  )
    .filter((term) => term.length > 2)
    .slice(0, 12);
  const keys = Array.from(
    new Set(
      mapKey
        ? roleMaps[mapKey]
        : jdTerms.length
          ? jdTerms
          : ["communication", "problem solving", "teamwork", "project", "results", "leadership"],
    ),
  );
  const keywords = keys.map((key) => evidenceForKeyword(raw, key));
  const demonstrated = keywords.filter((item) => item.status === "demonstrated");
  const weak = keywords.filter((item) => item.status === "weak");
  const missing = keywords.filter((item) => item.status === "missing");
  const sections = ["experience", "education", "skills", "project", "summary"].filter((section) =>
    includesTerm(text, section),
  );
  const achievement = achievementAnalysis(raw);
  const words = raw.split(/\s+/).filter(Boolean);
  const sentences = raw.split(/[.!?]+/).filter((value) => value.trim());
  const averageSentence = sentences.length ? words.length / sentences.length : words.length;
  const keywordScore = keys.length ? (demonstrated.length / keys.length) * 100 : 0;
  const completenessScore = (sections.length / 5) * 100;
  const elementPoints = achievement.elements.reduce(
    (sum, item) => sum + (item.status === "met" ? 1 : item.status === "partial" ? 0.45 : 0),
    0,
  );
  const impactScore = (elementPoints / achievement.elements.length) * 100;
  const readabilityScore = averageSentence <= 24 ? 88 : averageSentence <= 34 ? 70 : 48;
  const formattingSignals = [
    sections.length >= 4,
    words.length >= 180 && words.length <= 1000,
    raw.length > 0,
    /\b(experience|education|skills|projects?)\b/i.test(raw),
    sentences.length >= 3,
  ];
  const formattingScore =
    (formattingSignals.filter(Boolean).length / formattingSignals.length) * 95;
  const projectScore = clamp(
    (includesTerm(text, "project") ? 38 : 8) +
      demonstrated.length * 7 +
      (achievement.strongBullets.length ? 12 : 0),
  );
  const actionCount = actionWords.filter((word) => includesTerm(text, word)).length;
  const experienceScore = clamp(
    (includesTerm(text, "experience") ? 38 : 10) +
      actionCount * 6 +
      achievement.measurableBullets * 8,
  );
  const atsScore = clamp(
    keywordScore * 0.3 + completenessScore * 0.3 + formattingScore * 0.25 + readabilityScore * 0.15,
  );
  const roleScore = clamp(keywordScore * 0.6 + projectScore * 0.22 + experienceScore * 0.18);
  const components = [
    detail(
      "ats",
      atsScore,
      `${sections.length}/5 standard sections and ${demonstrated.length}/${keys.length} evidenced role terms`,
      sections,
      [
        ...(sections.length < 4 ? ["Incomplete standard section structure"] : []),
        ...(demonstrated.length < keys.length / 2 ? ["Weak role-specific evidence"] : []),
      ],
      "30% keyword evidence + 30% completeness + 25% formatting + 15% readability",
      "Use standard headings, consistent dates, and evidence-backed role terminology.",
      8,
    ),
    detail(
      "roleMatch",
      roleScore,
      `${demonstrated.length} verified role competencies`,
      demonstrated.map((item) => item.name),
      missing.slice(0, 4).map((item) => `${item.name} is not demonstrated`),
      "60% verified keywords + 22% project relevance + 18% experience relevance",
      "Prove the highest-priority missing competency in a role-specific project.",
      12,
    ),
    detail(
      "keywords",
      keywordScore,
      `${demonstrated.length} of ${keys.length} unique priority keywords demonstrated`,
      demonstrated.flatMap((item) => item.evidence).slice(0, 4),
      [
        ...weak.map((item) => `${item.name} is mentioned without supporting context`),
        ...missing.map((item) => `${item.name} is missing`),
      ].slice(0, 5),
      "Unique demonstrated priority keywords ÷ total unique priority keywords × 100",
      "Add truthful skill evidence inside experience, projects, achievements, or certifications.",
      10,
    ),
    detail(
      "completeness",
      completenessScore,
      `${sections.length}/5 standard sections detected`,
      sections,
      ["summary", "skills", "experience", "education", "project"]
        .filter((section) => !sections.includes(section))
        .map((section) => `Missing ${section} evidence`),
      "20% for each useful standard section detected",
      "Add only relevant missing sections with evidence-backed content.",
      8,
    ),
    detail(
      "impact",
      impactScore,
      `${achievement.measurableBullets} of ${achievement.totalBullets} experience or project bullets contain measurable outcomes`,
      achievement.strongBullets,
      achievement.elements
        .filter((item) => item.status !== "met")
        .map((item) => `${item.label} is ${item.status}`),
      "Equal evidence checks for action, technical scope, individual contribution, measurable result, and business outcome",
      "Rewrite weak bullets using action + scope + user-verified metric + result.",
      14,
    ),
    detail(
      "readability",
      readabilityScore,
      `Average sentence length is ${Math.round(averageSentence)} words`,
      achievement.strongBullets.slice(0, 2),
      averageSentence > 24 ? ["Some sentences are difficult to scan"] : [],
      "Sentence-length bands: 24 or fewer strong, 25–34 developing, above 34 needs attention",
      "Split long bullets and keep one primary result per bullet.",
      6,
    ),
    detail(
      "formatting",
      formattingScore,
      `${formattingSignals.filter(Boolean).length}/${formattingSignals.length} ATS-safe text signals detected`,
      sections,
      formattingSignals
        .filter((value) => !value)
        .map((_, index) => `Formatting signal ${index + 1} was not supported`),
      "Five text-verifiable formatting signals, capped below 100 because visual layout cannot be fully verified from extracted text",
      "Use one column, standard headings, consistent dates, and export a selectable-text PDF.",
      7,
    ),
    detail(
      "projects",
      projectScore,
      includesTerm(text, "project")
        ? "Project section and related evidence detected"
        : "No project section detected",
      demonstrated
        .flatMap((item) => item.evidence)
        .filter((value) => includesTerm(value, "project"))
        .slice(0, 3),
      includesTerm(text, "project")
        ? missing.slice(0, 3).map((item) => `${item.name} project evidence is missing`)
        : ["No role-relevant project evidence found"],
      "Project section + demonstrated priority skills + measurable outcomes",
      "Add one scoped project with architecture, tests, deliverables, and verified results.",
      14,
    ),
    detail(
      "experience",
      experienceScore,
      `${actionCount} distinct action verbs and ${achievement.measurableBullets} measurable bullets`,
      achievement.strongBullets,
      [
        ...(includesTerm(text, "experience") ? [] : ["Experience section not detected"]),
        ...(achievement.measurableBullets === 0 ? ["No measurable experience outcomes"] : []),
      ],
      "Experience section + action evidence + measurable outcomes",
      "Connect each experience bullet to role competency, ownership, and result.",
      10,
    ),
  ];
  const overall = clamp(
    components.reduce((sum, item) => sum + (item.score * item.weight) / 100, 0),
  );
  const readiness: ScoreDetail = {
    key: "readiness",
    label: labels.readiness,
    score: overall,
    status: scoreStatus(overall),
    definition:
      "A weighted estimate of current job-readiness evidence across nine transparent dimensions.",
    detected: "Weighted evidence across all component scores",
    evidence: demonstrated.map((item) => item.name).slice(0, 4),
    issues: missing.slice(0, 3).map((item) => `${item.name} evidence is missing`),
    missing:
      missing
        .slice(0, 3)
        .map((item) => item.name)
        .join(", ") || "No critical competency gap detected",
    calculation: Object.entries(SCORE_WEIGHTS)
      .map(([key, weight]) => `${labels[key as ScoreKey]} ${weight}%`)
      .join(" + "),
    weight: 100,
    effect: "This is the final weighted score; it is not averaged again.",
    action: "Complete verified roadmap work, then recalculate from new evidence.",
    expectedGain: 15,
  };
  const scores = [...components, readiness];
  return {
    rubricVersion: RUBRIC_VERSION,
    role,
    scores,
    overall,
    topProblems: components
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 3),
    matchedKeywords: demonstrated.map((item) => item.key),
    missingKeywords: missing.map((item) => item.key),
    keywords,
    achievement,
    gaps: missing.slice(0, 5).map((item, index) => gapFor(item.key, index)),
  };
}

export function getRoadmapPreview(gap: SkillGap, level: ExperienceLevel): RoadmapPreview {
  const configurations = {
    Beginner: {
      changes: [
        "Foundational concepts added",
        "Guided setup added",
        "Beginner lab added",
        "Starter project selected",
      ],
      added: ["Concept foundations", "Environment setup", "Guided practice"],
      skipped: [],
      difficulty: "Guided beginner",
      factor: 1.5,
      project: "Starter implementation",
      expected: "Foundational",
    },
    Intermediate: {
      changes: [
        "Fundamentals condensed",
        "Practical lab added",
        "Debugging exercise added",
        "Role-specific project added",
      ],
      added: ["Prerequisite review", "Applied lab", "Performance debugging"],
      skipped: ["Extended beginner setup"],
      difficulty: "Applied intermediate",
      factor: 1,
      project: gap.proof,
      expected: "Intermediate",
    },
    Advanced: {
      changes: [
        "Fundamentals skipped",
        "Production patterns added",
        "Optimization added",
        "Architecture decisions added",
      ],
      added: ["Production patterns", "Performance optimization", "Architecture review"],
      skipped: ["Foundations", "Guided setup"],
      difficulty: "Advanced and open-ended",
      factor: 0.8,
      project: `Production-grade ${gap.proof}`,
      expected: "Advanced",
    },
  }[level];
  return {
    level,
    skill: gap.skill,
    changes: configurations.changes,
    lessonsAdded: configurations.added,
    lessonsSkipped: configurations.skipped,
    difficulty: configurations.difficulty,
    estimatedHours: Math.max(2, Math.round(gap.hours * configurations.factor)),
    projectType: configurations.project,
    proof: `${gap.proofTypes.map((item) => item.type).join(" + ")} + execution result`,
    expectedLevel: configurations.expected,
  };
}
export function addProofRoadmapItem(current: ProofRoadmap, key: string, level: ExperienceLevel) {
  if (current[key]) return { next: current, added: false };
  return { next: { ...current, [key]: level }, added: true };
}

export type RoadmapPreferences = {
  role: string;
  weeks: number;
  hoursPerWeek: number;
  level: string;
  style: string;
};
export function createRoadmap(analysis: CareerAnalysis, preferences: RoadmapPreferences) {
  const weeks = Math.max(2, Math.min(24, preferences.weeks));
  const courses = recommendBrihatLabsCourses(
    analysis.gaps.map((gap) => gap.key),
    Math.min(weeks, 8),
    preferences.role,
  );
  return Array.from({ length: weeks }, (_, index) => {
    const gap = analysis.gaps[index % Math.max(analysis.gaps.length, 1)];
    const skill = gap?.skill ?? "role-specific foundations";
    const course = courses[index % courses.length];
    return {
      week: index + 1,
      focus: course.title,
      hours: preferences.hoursPerWeek,
      course: {
        id: course.id,
        title: course.title,
        url: brihatlabsCoursePath(course.id),
        duration: course.duration,
      },
      items: [
        `${preferences.style} study: ${course.summary}`,
        `Complete the BrihatLabs course work (${course.duration})`,
        index === weeks - 1
          ? "Re-run ResumeIQ and verify which evidence gaps remain"
          : `Connect the course work to your ${skill} evidence gap`,
        index % 2 === 0
          ? "Capture code, notes, or screenshots as learning evidence"
          : "Practise one role-specific interview explanation",
      ],
    };
  });
}
