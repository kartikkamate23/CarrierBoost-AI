import type { Course } from "../types/course.ts";

/**
 * Tables for lesson content.
 *
 * The catalog previously contained 15 tables across 1,283 lessons, so almost
 * every comparison was written as prose. This module supplies two things:
 * hand-written comparison tables for the many "X vs Y" lessons, and a compact
 * reference table generated for every other lesson so each page has at least
 * one scannable summary.
 */

export type Table = { headers: string[]; rows: string[][] };

/** Comparison tables keyed by the exact lesson title. */
export const comparisonTables: Record<string, Table> = {
  "Data Analytics vs Data Analysis": {
    headers: ["Aspect", "Data Analytics", "Data Analysis"],
    rows: [
      ["Scope", "The whole discipline: collect, prepare, analyse, communicate", "The examination step inside that discipline"],
      ["Includes", "Tooling, pipelines, dashboards, governance", "Inspecting and interpreting a prepared dataset"],
      ["Typical output", "A repeatable reporting capability", "A finding about one dataset"],
      ["Everyday use", "Often used as the umbrella term", "Often used for the hands-on work"],
    ],
  },
  "Data Analytics vs Data Science": {
    headers: ["Aspect", "Data Analytics", "Data Science"],
    rows: [
      ["Core question", "What happened and why", "What will happen and what should we build"],
      ["Main methods", "SQL, spreadsheets, BI tools, descriptive statistics", "Statistics, machine learning, experimentation, engineering"],
      ["Typical output", "Dashboards, reports, recommendations", "Models, forecasts, data products"],
      ["Time horizon", "Mostly historical and current", "Mostly predictive and forward-looking"],
    ],
  },
  "Data Analyst vs Data Scientist": {
    headers: ["Aspect", "Data Analyst", "Data Scientist"],
    rows: [
      ["Focus", "Explaining what the business is seeing now", "Predicting and building data-driven solutions"],
      ["Core tools", "SQL, Excel, Power BI or Tableau, Python basics", "Python, statistics, scikit-learn, experimentation"],
      ["Statistics depth", "Descriptive and comparative", "Inferential, probabilistic, and model-based"],
      ["Deliverable", "Dashboard, report, recommendation", "Model, experiment result, deployed solution"],
    ],
  },
  "Data Analyst vs Data Engineer": {
    headers: ["Aspect", "Data Analyst", "Data Engineer"],
    rows: [
      ["Focus", "Getting meaning out of data", "Getting data reliably to where it is needed"],
      ["Core tools", "SQL, BI tools, spreadsheets, Python", "Pipelines, warehouses, Spark, Airflow, Kafka"],
      ["Owns", "Metrics, reports, insight quality", "Ingestion, transformation, reliability, schema"],
      ["Measured by", "Decisions improved", "Freshness, uptime, and data correctness"],
    ],
  },
  "Data Science vs Data Analytics": {
    headers: ["Aspect", "Data Science", "Data Analytics"],
    rows: [
      ["Primary aim", "Predict and build", "Explain and report"],
      ["Typical method", "Modelling and experimentation", "Querying, aggregation, visualisation"],
      ["Uncertainty", "Quantified explicitly", "Usually described qualitatively"],
      ["Output lifespan", "A model that must be monitored", "A report or dashboard that must be refreshed"],
    ],
  },
  "Data Science vs Machine Learning": {
    headers: ["Aspect", "Data Science", "Machine Learning"],
    rows: [
      ["Scope", "The full problem: question, data, analysis, decision", "The subset that learns patterns from data"],
      ["Includes", "Statistics, communication, experimentation, ML", "Algorithms, training, evaluation, tuning"],
      ["Success looks like", "A better decision", "A model that generalises to new data"],
      ["Relationship", "Machine learning is one of its tools", "One capability used inside data science"],
    ],
  },
  "Data Science vs AI": {
    headers: ["Aspect", "Data Science", "Artificial Intelligence"],
    rows: [
      ["Goal", "Extract insight and build data products", "Build systems that perform intelligent tasks"],
      ["Typical output", "Analysis, models, recommendations", "Agents, assistants, perception and language systems"],
      ["Overlap", "Uses ML, which is part of AI", "Uses data science methods to train and evaluate"],
      ["Emphasis", "Evidence and decisions", "Capability and autonomy"],
    ],
  },
  "Data Scientist vs Data Analyst": {
    headers: ["Aspect", "Data Scientist", "Data Analyst"],
    rows: [
      ["Question answered", "What will happen, and what should we build", "What happened, and why"],
      ["Programming depth", "Required", "Helpful, sometimes optional"],
      ["Statistics depth", "Inferential and probabilistic", "Descriptive and comparative"],
      ["Common first role", "Usually after analyst experience", "A common entry point into data"],
    ],
  },
  "Data Scientist vs ML Engineer": {
    headers: ["Aspect", "Data Scientist", "ML Engineer"],
    rows: [
      ["Focus", "Finding what works and proving it", "Making it run reliably in production"],
      ["Core skills", "Statistics, modelling, experimentation", "Software engineering, pipelines, deployment, MLOps"],
      ["Typical artefact", "A validated model and its evaluation", "A serving system with monitoring and rollback"],
      ["Measured by", "Model quality and business impact", "Latency, reliability, and cost in production"],
    ],
  },
  "AI vs ML vs Deep Learning": {
    headers: ["Aspect", "Artificial Intelligence", "Machine Learning", "Deep Learning"],
    rows: [
      ["Definition", "Systems performing intelligent tasks", "Systems learning patterns from data", "ML using many-layered neural networks"],
      ["Relationship", "The widest field", "A subset of AI", "A subset of ML"],
      ["Needs data", "Not necessarily", "Yes, labelled or unlabelled", "Yes, usually a great deal"],
      ["Best at", "Any intelligent task, including rule-based", "Structured and tabular problems", "Images, audio, and language"],
    ],
  },
  "AI vs Generative AI vs AI Agents": {
    headers: ["Aspect", "AI", "Generative AI", "AI Agents"],
    rows: [
      ["Purpose", "Perform an intelligent task", "Create new content", "Pursue a goal across several steps"],
      ["Output", "A decision or classification", "Text, image, audio, or code", "Actions plus a final answer"],
      ["Takes actions", "Depends on the system", "No, it produces content", "Yes, through approved tools"],
      ["Needs a loop", "No", "No", "Yes: think, act, observe, repeat"],
    ],
  },
  "LLM vs AI Agent": {
    headers: ["Aspect", "LLM", "AI Agent"],
    rows: [
      ["Unit of work", "One prompt, one response", "A goal pursued over many steps"],
      ["External access", "None by itself", "Tools, APIs, files, and data"],
      ["Memory", "Only the context window", "Working state plus stored memory"],
      ["Stopping", "When the response ends", "When the goal is met or a limit is reached"],
    ],
  },
  "Traditional RAG vs Agentic RAG": {
    headers: ["Aspect", "Traditional RAG", "Agentic RAG"],
    rows: [
      ["Retrieval", "Once, before generating", "Repeatedly, as the agent decides"],
      ["Query", "The user's question as written", "Reformulated and refined by the agent"],
      ["Sufficiency check", "None", "The agent judges whether it has enough"],
      ["Cost and latency", "Lower and predictable", "Higher, in exchange for better coverage"],
    ],
  },
  "Single Agent vs Multi-Agent": {
    headers: ["Aspect", "Single agent", "Multi-agent"],
    rows: [
      ["Complexity", "Low, easy to trace", "High, needs coordination"],
      ["Best for", "One coherent task with a few tools", "Subtasks needing different tools or permissions"],
      ["Debugging", "One transcript to read", "Several transcripts plus their messages"],
      ["Cost", "Lower", "Higher, often several times"],
    ],
  },
  "Traditional Programming vs ML": {
    headers: ["Aspect", "Traditional programming", "Machine learning"],
    rows: [
      ["Inputs", "Rules plus data", "Data plus known answers"],
      ["Output", "Answers", "Rules, held as a model"],
      ["Who writes the logic", "A developer, explicitly", "The training process, from examples"],
      ["Best when", "Rules are known and stable", "Rules are too many or too subtle to write"],
    ],
  },
  "ML vs Deep Learning": {
    headers: ["Aspect", "Classical ML", "Deep learning"],
    rows: [
      ["Data needed", "Works with modest datasets", "Usually needs a large dataset"],
      ["Features", "Engineered by a person", "Learned from raw input"],
      ["Best data type", "Structured and tabular", "Images, audio, text"],
      ["Interpretability", "Often explainable", "Usually opaque without extra tooling"],
    ],
  },
  "Bias vs Variance": {
    headers: ["Aspect", "High bias", "High variance"],
    rows: [
      ["Symptom", "Poor on training and on test data", "Excellent on training, poor on test data"],
      ["Cause", "The model is too simple", "The model is too sensitive to the training set"],
      ["Also called", "Underfitting", "Overfitting"],
      ["Fix", "More capacity, better features", "More data, regularisation, simpler model"],
    ],
  },
  "Population vs Sample": {
    headers: ["Aspect", "Population", "Sample"],
    rows: [
      ["Definition", "Every unit you want to describe", "The subset you actually measured"],
      ["Notation", "Parameters: μ, σ", "Statistics: x̄, s"],
      ["Usually", "Unknown and impractical to measure", "Known and affordable"],
      ["Risk", "None by definition", "Bias if the sample is not representative"],
    ],
  },
  "Internal vs External Data": {
    headers: ["Aspect", "Internal data", "External data"],
    rows: [
      ["Source", "Your own systems", "Vendors, public bodies, partners"],
      ["Definitions", "Known and controllable", "Must be read and verified"],
      ["Coverage", "Limited to your own activity", "Wider market or population context"],
      ["Main risk", "Blind spots outside your customers", "Fit, freshness, licensing, and bias"],
    ],
  },
  "SQL vs NoSQL": {
    headers: ["Aspect", "SQL (relational)", "NoSQL (document)"],
    rows: [
      ["Schema", "Defined up front and enforced", "Flexible per document"],
      ["Relationships", "Joins across normalised tables", "Usually embedded or resolved in code"],
      ["Transactions", "Mature and multi-table by default", "Supported, but often more limited"],
      ["Best fit", "Structured data with strong integrity rules", "Evolving shapes and nested records"],
    ],
  },
  "Frontend vs Backend": {
    headers: ["Aspect", "Frontend", "Backend"],
    rows: [
      ["Runs on", "The user's browser or device", "A server you control"],
      ["Responsible for", "Presentation, interaction, client state", "Business rules, data, authentication"],
      ["Can be trusted", "No — anything client-side can be changed", "Yes — it is the trust boundary"],
      ["Typical tools", "HTML, CSS, JavaScript, React", "Node.js, Express, databases, APIs"],
    ],
  },
  "Client vs Server": {
    headers: ["Aspect", "Client", "Server"],
    rows: [
      ["Initiates", "The request", "Nothing; it responds"],
      ["Holds", "Session token, UI state", "Data, rules, secrets"],
      ["Validation", "For fast feedback only", "Authoritative and mandatory"],
      ["Failure impact", "One user affected", "Every user affected"],
    ],
  },
  "Authentication vs Authorization": {
    headers: ["Aspect", "Authentication", "Authorization"],
    rows: [
      ["Question answered", "Who are you?", "What are you allowed to do?"],
      ["Happens", "First", "After identity is established"],
      ["Typical mechanism", "Password, token, passkey, SSO", "Roles, permissions, ownership checks"],
      ["Failure status", "401 Unauthorized", "403 Forbidden"],
    ],
  },
  "QA vs QC vs Testing": {
    headers: ["Aspect", "Quality Assurance", "Quality Control", "Testing"],
    rows: [
      ["Focus", "The process", "The product", "The evidence"],
      ["Aim", "Prevent defects", "Detect defects", "Produce findings about behaviour"],
      ["When", "Throughout delivery", "On a built product", "On a testable build"],
      ["Owner", "The whole team", "QA and review roles", "Testers and automated suites"],
    ],
  },
  "Manual vs Automation": {
    headers: ["Aspect", "Manual testing", "Automation testing"],
    rows: [
      ["Best for", "Exploration, usability, one-off checks", "Repetitive, stable regression checks"],
      ["Finds", "The unexpected", "Regressions in known behaviour"],
      ["Cost shape", "Cost per run", "Cost up front, cheap per run"],
      ["Fails when", "The suite grows too large to repeat", "The UI changes faster than the tests"],
    ],
  },
  "Defect vs Error vs Failure": {
    headers: ["Term", "Meaning", "Where it lives"],
    rows: [
      ["Error", "A mistake made by a person", "In the thinking or the specification"],
      ["Defect", "The resulting flaw in the product", "In the code, config, or data"],
      ["Failure", "The observable wrong behaviour", "At run time, when the defect executes"],
    ],
  },
  "UI vs Database Validation": {
    headers: ["Aspect", "UI validation", "Database validation"],
    rows: [
      ["Checks", "What the user sees", "What was actually stored"],
      ["Misses", "Silent write failures and wrong types", "Display and formatting defects"],
      ["Tooling", "Browser or manual inspection", "SQL queries against the tables"],
      ["Best practice", "Use both for every data-changing flow", "Compare the two after each write"],
    ],
  },
  "Dashboard vs Report": {
    headers: ["Aspect", "Dashboard", "Report"],
    rows: [
      ["Purpose", "Monitor what is happening now", "Explain a period in depth"],
      ["Cadence", "Continuous, always available", "Produced on a schedule"],
      ["Depth", "A few key measures", "Detailed tables and narrative"],
      ["Audience action", "Notice and investigate", "Read and decide"],
    ],
  },
  "Severity | Priority": {
    headers: ["Aspect", "Severity", "Priority"],
    rows: [
      ["Describes", "Technical impact on the system", "Business urgency of the fix"],
      ["Set by", "The tester", "The product owner"],
      ["Example of a mismatch", "A crash in a rarely used admin screen: high severity, low priority", "A company logo misspelt: low severity, high priority"],
    ],
  },
};

/** Alternate titles that describe the same comparison. */
const tableAliases: Record<string, string> = {
  Severity: "Severity | Priority",
  Priority: "Severity | Priority",
  "Types of Machine Learning": "AI vs ML vs Deep Learning",
};

const subjectApplication: Record<Course["subject"], string> = {
  analytics: "Analytics work",
  science: "Data science work",
  ml: "Machine learning work",
  agents: "Agent engineering",
  fullstack: "Full-stack development",
  mern: "MERN development",
  testing: "Software quality work",
};

/**
 * Compact reference table generated for lessons with no hand-written
 * comparison, so every lesson page carries at least one scannable summary.
 */
export function referenceTable(
  title: string,
  moduleTitle: string,
  subject: Course["subject"],
): Table {
  return {
    headers: ["Question", "Answer"],
    rows: [
      ["What is it", `The ${title.toLowerCase()} concept taught in ${moduleTitle}.`],
      ["Where it fits", `${subjectApplication[subject]}, as part of ${moduleTitle.toLowerCase()}.`],
      ["When to use it", `When the task in front of you needs ${title.toLowerCase()} rather than a simpler alternative.`],
      ["How to check it worked", "Compare the output against a small example whose correct answer you already know."],
      ["Common failure", "Applying it before the goal and the success measure are agreed."],
    ],
  };
}

export function comparisonTableFor(title: string): Table | undefined {
  return comparisonTables[title] ?? comparisonTables[tableAliases[title] ?? ""];
}

/** True when the title reads as a comparison, whether or not a table exists yet. */
export function isComparisonTitle(title: string) {
  return /\bvs\.?\b/i.test(title);
}
