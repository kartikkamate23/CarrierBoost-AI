export type InterviewTrack = "Technical" | "HR" | "Coding";
export type InterviewDifficulty = "Easy" | "Medium" | "Hard";

export type InterviewQuestion = {
  id: string;
  track: InterviewTrack;
  difficulty: InterviewDifficulty;
  role: string;
  technology: string;
  prompt: string;
  signals: string[];
  guidance: string;
};

export const interviewRoles = [
  "Data Engineer",
  "Data Analyst",
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "DevOps Engineer",
  "AI/ML Engineer",
] as const;

const technologiesByRole: Record<(typeof interviewRoles)[number], string[]> = {
  "Data Engineer": ["SQL", "Python", "Apache Spark", "Data Modeling", "AWS", "Azure", "Kafka"],
  "Data Analyst": ["SQL", "Python", "Power BI", "Excel", "Statistics", "Data Storytelling"],
  "Software Engineer": ["Java", "Python", "JavaScript", "System Design", "Git", "Databases"],
  "Backend Developer": ["Java", "Spring Boot", "Python", "REST APIs", "SQL", "Microservices"],
  "Frontend Developer": ["JavaScript", "TypeScript", "React", "CSS", "Web Performance", "Testing"],
  "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
  "AI/ML Engineer": ["Python", "Machine Learning", "LLMs", "RAG", "Vector Databases", "MLOps"],
};

export function resolveInterviewRole(role: string): (typeof interviewRoles)[number] {
  const normalized = role.toLowerCase();
  if (normalized.includes("analyst")) return "Data Analyst";
  if (normalized.includes("front")) return "Frontend Developer";
  if (normalized.includes("back")) return "Backend Developer";
  if (normalized.includes("devops") || normalized.includes("cloud")) return "DevOps Engineer";
  if (normalized.includes("machine") || normalized.includes("ml") || normalized.includes("ai")) {
    return "AI/ML Engineer";
  }
  if (normalized.includes("software")) return "Software Engineer";
  return "Data Engineer";
}

export function getTechnologiesForRole(role: string) {
  return technologiesByRole[resolveInterviewRole(role)];
}

export function interviewTrackRequiresTechnology(track: InterviewTrack) {
  return track !== "HR";
}

const scenarios = [
  "a customer-facing production system",
  "a rapidly growing startup platform",
  "a regulated enterprise workload",
  "a system experiencing intermittent failures",
  "a service that must support ten times its current traffic",
];

const constraints = [
  "reliability and safe recovery",
  "cost, latency, and maintainability",
  "security, observability, and scalability",
  "backward compatibility and zero downtime",
  "data quality and operational ownership",
];

const workloadScales = [
  "10,000 records per day",
  "one million records per hour",
  "5,000 concurrent users",
  "a 99.9% availability target",
  "a two-minute processing SLA",
  "three years of retained history",
  "traffic that changes by ten times during peak periods",
];

type TechnologyProfile = {
  concepts: string[];
  tasks: string[];
  failures: string[];
};

const technologyProfiles: Record<string, TechnologyProfile> = {
  SQL: {
    concepts: ["window functions", "indexes and query plans", "transactions and isolation levels"],
    tasks: [
      "return the latest valid order per customer from orders(customer_id, order_id, status, updated_at)",
      "calculate a seven-day rolling revenue total without double-counting late-arriving orders",
      "deduplicate events by business key while preserving the newest record",
    ],
    failures: [
      "a full table scan after data volume doubles",
      "deadlocks between concurrent updates",
      "duplicate rows introduced by a many-to-many join",
    ],
  },
  Python: {
    concepts: [
      "generators and lazy evaluation",
      "mutability and object references",
      "concurrency versus parallelism",
    ],
    tasks: [
      "stream a file that is larger than memory and aggregate valid records by key",
      "merge two event streams while removing duplicates and preserving event-time order",
      "build a retryable API client with exponential backoff and bounded concurrency",
    ],
    failures: [
      "memory growth in a long-running worker",
      "silent data loss during exception handling",
      "race conditions in concurrent processing",
    ],
  },
  "Apache Spark": {
    concepts: [
      "narrow versus wide transformations",
      "partitioning and shuffle",
      "lazy evaluation and lineage",
    ],
    tasks: [
      "deduplicate late events by business key and event timestamp in a DataFrame",
      "join a multi-terabyte fact table with a small dimension while controlling shuffle",
      "calculate session windows from clickstream events with late-arrival handling",
    ],
    failures: [
      "one task running far longer because of skew",
      "driver out-of-memory failures",
      "millions of tiny output files",
    ],
  },
  "Data Modeling": {
    concepts: [
      "grain and business keys",
      "slowly changing dimensions",
      "normalization versus dimensional modeling",
    ],
    tasks: [
      "model orders, payments, refunds, and shipments at an explicit analytical grain",
      "implement a type-two customer dimension with effective dates and current-row flags",
      "design facts and dimensions for subscription revenue and churn reporting",
    ],
    failures: [
      "double-counted measures caused by mixed grain",
      "history overwritten during dimension updates",
      "ambiguous ownership of shared dimensions",
    ],
  },
  Kafka: {
    concepts: ["partitions and consumer groups", "delivery semantics", "offsets and replay"],
    tasks: [
      "build an idempotent consumer that safely handles redelivery",
      "preserve per-customer ordering while scaling consumers",
      "route malformed events to a dead-letter topic with replay support",
    ],
    failures: [
      "consumer lag increasing continuously",
      "a hot partition limiting throughput",
      "duplicate processing after a rebalance",
    ],
  },
  AWS: {
    concepts: [
      "IAM least privilege",
      "availability zones and fault isolation",
      "managed versus self-managed services",
    ],
    tasks: [
      "design an event-driven ingestion flow using S3, Lambda, and a durable queue",
      "process encrypted data across accounts without long-lived credentials",
      "create a resilient batch pipeline with retries, alarms, and backfill support",
    ],
    failures: [
      "unexpected cloud cost growth",
      "throttling under burst traffic",
      "a regional dependency causing an outage",
    ],
  },
  Azure: {
    concepts: ["managed identities", "data lake zones", "orchestration and dependency management"],
    tasks: [
      "orchestrate an incremental load into a lakehouse with restart-safe checkpoints",
      "secure cross-service access without embedded secrets",
      "design a monitored backfill that does not disrupt daily processing",
    ],
    failures: [
      "pipeline retries producing duplicate output",
      "credential expiry breaking workloads",
      "small files degrading analytical performance",
    ],
  },
  Java: {
    concepts: ["collections and equality contracts", "thread safety", "JVM memory management"],
    tasks: [
      "implement an LRU cache with constant-time get and put operations",
      "process records concurrently while preserving output order",
      "design an immutable domain model with validation and clear error handling",
    ],
    failures: [
      "a memory leak caused by retained references",
      "contention around shared state",
      "incorrect behavior from inconsistent equals and hashCode",
    ],
  },
  JavaScript: {
    concepts: ["the event loop", "closures and scope", "promises and async error handling"],
    tasks: [
      "implement a concurrency-limited promise queue",
      "group and transform nested API results without mutating the input",
      "build a debounced search function that cancels stale requests",
    ],
    failures: [
      "the main thread blocked by CPU-heavy work",
      "an unhandled promise rejection",
      "stale asynchronous responses overwriting new state",
    ],
  },
  TypeScript: {
    concepts: ["generics and constraints", "discriminated unions", "structural typing"],
    tasks: [
      "model a type-safe API result with exhaustive success and failure handling",
      "write a generic grouping utility that preserves key and value types",
      "validate unknown input before narrowing it to a domain type",
    ],
    failures: [
      "unsafe assertions hiding invalid runtime data",
      "a union case not handled after an API change",
      "overly broad types removing compiler protection",
    ],
  },
  React: {
    concepts: [
      "rendering and reconciliation",
      "state ownership",
      "effects and dependency management",
    ],
    tasks: [
      "build a searchable list that avoids stale responses and unnecessary renders",
      "implement an accessible controlled form with validation",
      "create a reusable data-fetching hook with loading, error, and cancellation states",
    ],
    failures: [
      "an effect causing an infinite request loop",
      "stale state inside an asynchronous callback",
      "a large list re-rendering on every keystroke",
    ],
  },
  Docker: {
    concepts: ["layers and build cache", "container isolation", "multi-stage builds"],
    tasks: [
      "write a secure multi-stage image for a production service",
      "add a health check and graceful shutdown behavior",
      "reduce image size while keeping builds reproducible",
    ],
    failures: [
      "secrets copied into an image layer",
      "a container repeatedly restarting",
      "different builds producing inconsistent artifacts",
    ],
  },
  Kubernetes: {
    concepts: ["requests and limits", "deployments and probes", "service discovery"],
    tasks: [
      "define a deployment with safe rolling updates and health probes",
      "autoscale a stateless service using meaningful signals",
      "run a one-time database migration without concurrent execution",
    ],
    failures: [
      "pods stuck in a crash loop",
      "traffic reaching unready instances",
      "resource limits causing repeated eviction",
    ],
  },
  "Machine Learning": {
    concepts: ["bias and variance", "feature leakage", "evaluation metrics and thresholds"],
    tasks: [
      "build an evaluation pipeline for an imbalanced classification problem",
      "create leakage-safe train, validation, and test splits",
      "monitor prediction quality when labels arrive weeks later",
    ],
    failures: [
      "offline metrics improving while business outcomes decline",
      "training-serving feature skew",
      "performance degrading after a distribution shift",
    ],
  },
  LLMs: {
    concepts: [
      "tokenization and context windows",
      "sampling controls",
      "grounding and hallucination",
    ],
    tasks: [
      "build a structured-output workflow with validation and retry handling",
      "evaluate answer quality using a reproducible test set and explicit rubric",
      "control prompt size while preserving the most relevant conversation context",
    ],
    failures: [
      "valid-looking but unsupported answers",
      "prompt injection changing system behavior",
      "latency and cost increasing with conversation length",
    ],
  },
  RAG: {
    concepts: ["chunking and retrieval", "hybrid search", "reranking and grounded generation"],
    tasks: [
      "retrieve evidence for a question and return answers with verifiable citations",
      "evaluate retrieval recall separately from generation quality",
      "apply metadata filtering without eliminating relevant documents",
    ],
    failures: [
      "relevant evidence never reaching the model",
      "stale documents remaining searchable",
      "retrieved text containing malicious instructions",
    ],
  },
};

const fallbackTechnologyProfile: TechnologyProfile = {
  concepts: ["core abstractions", "execution model", "production trade-offs"],
  tasks: [
    "validate and transform a realistic input into a deterministic output",
    "design a retry-safe workflow with clear error reporting",
    "process a large input efficiently while preserving correctness",
  ],
  failures: [
    "incorrect output under edge cases",
    "performance degradation at scale",
    "partial failure leaving inconsistent state",
  ],
};

type PromptContext = {
  role: string;
  tech: string;
  context: string;
  constraint: string;
  concept: string;
  relatedConcept: string;
  task: string;
  failure: string;
  scale: string;
};

const technicalPrompts: Record<InterviewDifficulty, Array<(input: PromptContext) => string>> = {
  Easy: [
    ({ tech, concept }) =>
      `Explain ${concept} in ${tech}. When would you use it, and what is one common mistake?`,
    ({ tech, concept, relatedConcept }) =>
      `In ${tech}, how does ${concept} differ from ${relatedConcept}? Give one situation where the distinction matters.`,
    ({ role, tech, concept }) =>
      `As a ${role}, how would you explain ${concept} in ${tech} to a teammate who is new to it?`,
    ({ tech, failure }) =>
      `What could cause ${failure} in ${tech}, and what would you inspect first?`,
  ],
  Medium: [
    ({ role, tech, context, failure, scale }) =>
      `You are the ${role} responsible for ${context} operating at ${scale}. In ${tech}, users report ${failure}. Walk me through your diagnosis and remediation plan.`,
    ({ tech, concept, relatedConcept, constraint, scale }) =>
      `Choose between ${concept} and ${relatedConcept} in ${tech} at ${scale}, where ${constraint} matters. What evidence would drive your decision?`,
    ({ tech, task, constraint, scale }) =>
      `How would you design ${task} in ${tech} at ${scale}? Discuss correctness, ${constraint}, and the operational checks you would add.`,
    ({ role, tech, context, scale }) =>
      `Design the ${tech} portion of ${context} at ${scale} as a ${role}. Clarify requirements, interfaces, failure handling, and measurable success criteria.`,
  ],
  Hard: [
    ({ role, tech, context, failure, constraint }) =>
      `You own ${context} as the senior ${role}. The ${tech} layer is experiencing ${failure}. Defend a recovery and redesign plan that addresses ${constraint} without a risky big-bang migration.`,
    ({ tech, concept, relatedConcept, context }) =>
      `Challenge this design: ${context} relies heavily on ${concept} in ${tech}. Under what conditions does that choice break down, and when would ${relatedConcept} be better?`,
    ({ tech, task, failure }) =>
      `Design ${task} in ${tech} for ten times today's load. How will you prevent, detect, and recover from ${failure}?`,
    ({ role, tech, context, constraint }) =>
      `Run a production design review for the ${tech} architecture behind ${context}. Identify the hardest trade-off involving ${constraint}, quantify the risk, and propose an incremental validation plan.`,
  ],
};

const codingPrompts: Record<InterviewDifficulty, Array<(input: PromptContext) => string>> = {
  Easy: [
    ({ tech, task }) =>
      `Using ${tech}, implement a solution to ${task}. State the input and output, then cover two edge cases.`,
    ({ tech, task }) =>
      `Write code or precise pseudocode in ${tech} to ${task}. Explain the main steps and the time and space complexity.`,
    ({ tech, concept, task }) =>
      `Solve this ${tech} exercise: ${task}. Use ${concept} where appropriate and provide one focused test case.`,
    ({ tech, task }) =>
      `Complete a working ${tech} solution for this requirement: ${task}. What validation would you perform before returning the result?`,
  ],
  Medium: [
    ({ tech, task, failure, scale }) =>
      `Implement ${task} in ${tech} for ${scale}. Your solution must handle invalid input, duplicates, and ${failure}. Include representative tests.`,
    ({ tech, task, constraint, scale }) =>
      `Write a production-quality ${tech} solution to ${task} at ${scale}. Optimize for ${constraint} and explain the trade-off in your implementation.`,
    ({ tech, task, concept, scale }) =>
      `Implement ${task} using ${tech} for ${scale}. Show how ${concept} affects the design, and analyze complexity and failure behavior.`,
    ({ tech, task, scale }) =>
      `Pair-program this ${tech} problem with me for a workload of ${scale}: ${task}. Start with a correct baseline, test it, then identify one meaningful optimization.`,
  ],
  Hard: [
    ({ role, tech, task, failure }) =>
      `As a ${role}, implement and defend a production-grade ${tech} solution to ${task}. It must remain correct during ${failure}, and include tests and complexity analysis.`,
    ({ tech, task, constraint }) =>
      `Build ${task} in ${tech} under the constraint of ${constraint}. Show error handling, observability points, and how you would benchmark it.`,
    ({ tech, task, concept, failure }) =>
      `Implement ${task} in ${tech}, incorporating ${concept}. Then modify the design to recover safely from ${failure} without duplicate effects.`,
    ({ tech, task, constraint }) =>
      `Write the core ${tech} implementation for ${task}. After the code, conduct your own review for correctness, security, ${constraint}, and operability at scale.`,
  ],
};

const hrPrompts: Record<
  InterviewDifficulty,
  (role: string, tech: string, context: string) => string
> = {
  Easy: (role, _tech, context) =>
    `Why are you interested in the ${role} role, and which experience best prepares you to contribute to ${context}?`,
  Medium: (role, _tech, context) =>
    `Tell me about a time you had to learn an unfamiliar skill quickly while working on ${context}. What did you do, what changed as a result, and how does it prepare you for a ${role} role?`,
  Hard: (role, _tech, context) =>
    `As a ${role}, describe a difficult decision you owned in ${context}. How did you handle disagreement, quantify the outcome, and what would you do differently now?`,
};

const signalMap: Record<InterviewTrack, Record<InterviewDifficulty, string[]>> = {
  Technical: {
    Easy: ["concept", "example", "benefit", "limitation"],
    Medium: ["requirement", "design", "trade-off", "failure"],
    Hard: ["scale", "failure", "observability", "security", "alternative"],
  },
  HR: {
    Easy: ["motivation", "experience", "role", "impact"],
    Medium: ["situation", "action", "result", "learning"],
    Hard: ["decision", "conflict", "outcome", "reflection"],
  },
  Coding: {
    Easy: ["input", "output", "edge case", "complexity"],
    Medium: ["validation", "duplicate", "test", "complexity"],
    Hard: ["error", "test", "complexity", "trade-off", "optimize"],
  },
};

export function generateInterviewQuestion(input: {
  role: string;
  technologies: string[];
  track: InterviewTrack;
  difficulty: InterviewDifficulty;
  sequence: number;
}): InterviewQuestion {
  const role = resolveInterviewRole(input.role);
  const available = input.technologies.length ? input.technologies : getTechnologiesForRole(role);
  const technology = available[(Math.max(1, input.sequence) - 1) % available.length];
  const context = scenarios[(input.sequence - 1 + available.length) % scenarios.length];
  const constraint = constraints[(input.sequence - 1) % constraints.length];
  const profile = technologyProfiles[technology] ?? fallbackTechnologyProfile;
  const concept = profile.concepts[(input.sequence - 1) % profile.concepts.length];
  const relatedConcept = profile.concepts[input.sequence % profile.concepts.length];
  const task = profile.tasks[(input.sequence - 1) % profile.tasks.length];
  const failure = profile.failures[(input.sequence - 1) % profile.failures.length];
  const scale = workloadScales[(input.sequence - 1) % workloadScales.length];
  const promptContext = {
    role,
    tech: technology,
    context,
    constraint,
    concept,
    relatedConcept,
    task,
    failure,
    scale,
  };
  const technicalBank = technicalPrompts[input.difficulty];
  const codingBank = codingPrompts[input.difficulty];
  const prompt =
    input.track === "Technical"
      ? technicalBank[(input.sequence - 1) % technicalBank.length](promptContext)
      : input.track === "Coding"
        ? codingBank[(input.sequence - 1) % codingBank.length](promptContext)
        : hrPrompts[input.difficulty](role, technology, context);

  return {
    id: `${input.track}-${input.difficulty}-${input.sequence}-${technology}`,
    track: input.track,
    difficulty: input.difficulty,
    role,
    technology,
    prompt,
    signals: signalMap[input.track][input.difficulty],
    guidance:
      input.track === "Coding"
        ? "State assumptions, write or outline the solution, test edge cases, and analyze complexity."
        : input.track === "HR"
          ? "Use a concise situation, action, measurable result, and reflection structure."
          : "Clarify requirements, explain the design, and defend trade-offs with production evidence.",
  };
}

export function evaluateInterviewAnswer(question: InterviewQuestion, answer: string) {
  const normalized = answer.toLowerCase();
  const matchedSignals = question.signals.filter((signal) => normalized.includes(signal));
  const missedSignals = question.signals.filter((signal) => !normalized.includes(signal));
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const targetWords =
    question.difficulty === "Easy" ? 55 : question.difficulty === "Medium" ? 90 : 130;
  const coverage = matchedSignals.length / question.signals.length;
  const depth = Math.min(1, wordCount / targetWords);
  const probe =
    missedSignals[0] ??
    question.signals[(wordCount + question.id.length) % question.signals.length];
  const followUpPrompt =
    question.track === "Coding"
      ? `Now modify your solution to demonstrate ${probe}. What changes in the implementation and tests?`
      : question.track === "HR"
        ? `Give me one specific example that demonstrates ${probe}. What did you personally do, and what measurable result followed?`
        : `Let's go one level deeper on ${probe}. How would your answer change under a production failure or ten-times scale?`;
  return {
    score: Math.round((coverage * 0.65 + depth * 0.35) * 100),
    matchedSignals,
    missedSignals,
    wordCount,
    followUpPrompt,
  };
}
