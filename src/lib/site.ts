/**
 * Brand constants, navigation configuration and SEO defaults.
 *
 * Presentational configuration only — every `to` below points at a route that
 * already exists in src/routes. Nothing here creates, gates or redirects
 * anything; consumers render these as ordinary links.
 */

export const site = {
  name: "CareerBoost AI",
  tagline: "From resume gaps to job-ready proof",
  description:
    "Analyze your resume against a target role with a transparent, evidence-based rubric, then follow a personalized path of verified courses, projects and interview practice.",
  email: "support@careerboost.ai",
  locale: "en_US",
} as const;

/** Product surfaces, all of which are existing routes. */
export const productNav = [
  {
    to: "/analyze",
    label: "ResumeIQ",
    description: "Explainable resume and role-fit analysis",
  },
  {
    to: "/roadmap",
    label: "Career Roadmap",
    description: "A week-by-week plan built from your gaps",
  },
  {
    to: "/skillpath",
    label: "SkillPath",
    description: "Sequenced BrihatLabs courses for your role",
  },
  {
    to: "/mentor",
    label: "AI Mentor",
    description: "Diagnostic coaching across eight modes",
  },
  {
    to: "/projectlab",
    label: "ProjectLab",
    description: "Turn learning into portfolio evidence",
  },
  {
    to: "/interviewiq",
    label: "InterviewIQ",
    description: "Practice questions with instant evaluation",
  },
  {
    to: "/jobmatch",
    label: "JobMatch",
    description: "Roles aligned to demonstrated skills",
  },
] as const;

/** Supporting material, all of which are existing routes. */
export const resourcesNav = [
  {
    to: "/programs",
    label: "Course catalog",
    description: "The full BrihatLabs library",
  },
  {
    to: "/sample-report",
    label: "Sample report",
    description: "See a complete analysis before signing up",
  },
  {
    to: "/privacy",
    label: "Privacy",
    description: "How your resume data is handled",
  },
  {
    to: "/terms",
    label: "Terms",
    description: "Terms of service",
  },
] as const;

/** Landing-page section anchors used by the header. */
export const landingSections = {
  features: "features",
  howItWorks: "how-it-works",
  preview: "product-preview",
  faq: "faq",
} as const;

/** Footer link groups. Every destination is an existing route. */
export const footerNav = [
  {
    heading: "Platform",
    links: [
      { to: "/analyze", label: "ResumeIQ" },
      { to: "/roadmap", label: "Career Roadmap" },
      { to: "/skillpath", label: "SkillPath" },
      { to: "/mentor", label: "AI Mentor" },
    ],
  },
  {
    heading: "Practice",
    links: [
      { to: "/interviewiq", label: "InterviewIQ" },
      { to: "/projectlab", label: "ProjectLab" },
      { to: "/jobmatch", label: "JobMatch" },
      { to: "/programs", label: "Course catalog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/sample-report", label: "Sample report" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

/**
 * Verifiable product facts used by the landing page in place of invented
 * user counts. Each value is derived at render time from the real engine
 * data rather than hard-coded here — see the trust section.
 */
export const trustNotice =
  "Figures below describe the product itself, not user outcomes. CareerBoost AI does not publish learner statistics it cannot verify.";
