import type { ContentBlock, Course } from "../types/course.ts";

/**
 * Content for the two lesson kinds that are not concept lessons.
 *
 * Quiz and project lessons previously ran through the same concept template as
 * everything else, which produced pages headed "Understanding Module Quiz"
 * with a definition, an analogy, and interview questions. Both now get a body
 * written for what they actually are: an assessment, and a build brief.
 */

const subjectEvidence: Record<Course["subject"], string> = {
  analytics: "the query or workbook, the cleaned data, the chart, and the recommendation it supports",
  science: "the notebook, the train/test split, the evaluation metric, and the limits of the result",
  ml: "the pipeline, the held-out score, the confusion matrix or error plot, and one failure case",
  agents: "the transcript of tool calls, the guardrails that held, the cost, and one refused action",
  fullstack: "the running application, the API responses, the tests, and the deployment configuration",
  mern: "the running application, the API responses, the auth flow, and the deployment configuration",
  testing: "the test plan, the executed cases, the defect reports, and the sign-off note",
};

/** Project briefs keyed by the exact project lesson title. */
export const projectBriefs: Record<string, string> = {
  "End-to-End Business Data Analytics Project": "Take one business question from raw export to recommendation: clean the data, document every transformation, build the analysis, visualise the finding, and present a recommendation a manager could act on tomorrow.",
  "End-to-End Data Science Project": "Frame a real problem, prepare and split the data, train and tune a model inside a pipeline, evaluate it honestly on held-out data, and write up the result including what it cannot do.",
  "Build Your Own Machine Learning Project": "Choose a dataset with a genuine prediction task, build the full pipeline from preprocessing to evaluation, and report the metric that matches the real cost of a wrong prediction.",
  "Build an AI Research Agent": "Build an agent that answers a research question using a search tool and a summarise tool, cites every source, respects a step and cost budget, and logs each tool call for review.",
  "Deploy the Agent": "Put the agent behind a service with authentication, per-tool permission checks, structured logging, a step limit, and a monitored cost budget.",
  "Production-Ready Full Stack Application": "Ship a complete application: authenticated API, validated inputs, a database with real constraints, automated tests, containerised deployment, and monitoring.",
  "E-Commerce Application": "Build a catalogue, cart, checkout, and order history with authentication, server-side validation, pagination, and tests covering the money-handling paths.",
  "MERN Task Manager": "Build a task manager across the full MERN stack: React UI with all four loading states, Express API with validation, Mongoose models, and JWT authentication.",
  "Authentication Application": "Build registration, login, refresh, logout, and role-based protected routes, with hashed passwords, secure cookies, and tests for every unauthorised path.",
  "Production MERN Application": "Take a MERN application to production: environment configuration, a production build, containers, CI, monitoring, and a documented rollback plan.",
  Capstone: "Combine everything from the course into one application you would be willing to show an employer, with a README covering the decisions and their trade-offs.",
  "Capstone Introduction": "Choose your capstone problem and write the brief before writing any code: the user, the decision or task, the data or requirements, the success measure, and what is out of scope.",
  "E-Commerce Manual Testing": "Test a complete e-commerce flow by hand: write the plan, design cases covering boundaries and negatives, execute with evidence, and file well-formed defect reports.",
  "Final Capstone": "Run a full QA cycle on one application: requirement analysis, test plan, designed cases, execution evidence, defect management, regression, and a sign-off report.",
  "SQL Analytics Project": "Answer a set of business questions from a multi-table schema, and validate each number with a second, independently written query.",
};

/** Assessment body used for every quiz and assessment lesson. */
export function assessmentBlocks(moduleTitle: string, isFinal: boolean): ContentBlock[] {
  const scope = isFinal ? "every module in this course" : moduleTitle;
  return [
    { type: "heading", text: "What this assessment covers" },
    {
      type: "paragraph",
      text: `This is a skills check on ${scope}. The questions test whether you can choose the right approach and recognise the common failure, not whether you memorised a definition. Each answer comes with an explanation, so a wrong answer is still useful.`,
    },
    {
      type: "callout",
      title: "Passing score",
      text: "You need more than 75% to unlock the next module. You can retry as many times as you need — the explanations are there to be read between attempts.",
      tone: "info",
    },
    { type: "heading", text: "How to get the most from it" },
    {
      type: "diagram",
      variant: "steps",
      items: [
        "Answer from memory before looking anything up",
        "Submit and read every explanation, including the ones you got right",
        "Return to the lessons behind the questions you missed",
        "Retry until the reasoning feels obvious rather than remembered",
      ],
    },
    {
      type: "callout",
      title: "If you score below the threshold",
      text: "That is information, not a verdict. It usually points at one or two specific lessons rather than the whole module. Revisit those, then come back.",
      tone: "warning",
    },
  ];
}

/** Project body used for every project and capstone lesson. */
export function projectBlocks(
  title: string,
  moduleTitle: string,
  subject: Course["subject"],
  brief?: string,
): ContentBlock[] {
  const statement =
    brief ??
    projectBriefs[title] ??
    `Build one working piece of ${moduleTitle.toLowerCase()} end to end. Keep the scope small enough to finish and explain, and large enough to prove you can apply what the module taught.`;
  return [
    { type: "heading", text: "Problem statement" },
    { type: "paragraph", text: statement },
    {
      type: "callout",
      title: "Before you write anything",
      text: "Write down the user, the outcome, the success measure, and what is explicitly out of scope. A project without these becomes an unfinishable one.",
      tone: "warning",
    },
    { type: "heading", text: "How to work through it" },
    {
      type: "diagram",
      variant: "pipeline",
      items: [
        "Write the brief",
        "Build the smallest working version",
        "Test the normal path",
        "Test an invalid and an edge case",
        "Document the decisions",
        "Publish and demo",
      ],
    },
    { type: "heading", text: "What to submit" },
    {
      type: "table",
      headers: ["Deliverable", "What it must show"],
      rows: [
        ["Working artefact", `A running result, plus ${subjectEvidence[subject]}.`],
        ["README", "The problem, how to run it, the key decisions, and one honest limitation."],
        ["Evidence", "Proof that you checked the result rather than assuming it — output, screenshots, or test runs."],
        ["Reflection", "What you would do differently with more time, and what you would build next."],
      ],
    },
    { type: "heading", text: "How this is assessed" },
    {
      type: "list",
      items: [
        "The problem is stated clearly enough that a stranger could judge whether you solved it.",
        "The solution actually runs from the instructions you wrote.",
        "Failure cases are handled deliberately rather than ignored.",
        "The decisions and their trade-offs are written down, not only in your head.",
        "You can defend every choice in a follow-up conversation.",
      ],
    },
    {
      type: "callout",
      title: "Make it portfolio-ready",
      text: "Put it in a public repository with a README, a short demo, and a one-line summary you can put on a CV and defend in an interview. An unexplained project counts for very little.",
      tone: "success",
    },
  ];
}
