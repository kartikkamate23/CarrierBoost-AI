export type LessonType = "lesson" | "quiz" | "project";
export type CodeLanguage = "python" | "sql" | "excel" | "java" | "javascript" | "typescript" | "json" | "bash" | "html" | "css";
export type CourseSubject = "analytics" | "science" | "ml" | "agents" | "fullstack" | "mern" | "testing";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string; tone?: "info" | "success" | "warning" }
  | { type: "code"; language: CodeLanguage; code: string }
  | { type: "image"; src: string; alt: string; caption?: string; width?: number; height?: number }
  | { type: "diagram"; items: string[]; variant?: "flow" | "concept" | "pipeline" | "architecture" | "steps" | "timeline" | "decision-tree" }
  | { type: "formula"; expression: string; explanation: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "resource"; title: string; url: string; description: string }
  | { type: "video"; title: string; url?: string };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  description: string;
  content: ContentBlock[];
  questions?: QuizQuestion[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  level: string;
  duration: string;
  lessonCountLabel: string;
  tags: string[];
  subject: CourseSubject;
  focus: string;
  curriculumHeadline: string;
  outcomes: string[];
  audience: string[];
  prerequisites: string[];
  builds: string[];
  assessment: string;
  certificateCriteria: string;
  careerPath: "Data & AI" | "Development" | "Quality";
  jobs: string[];
  portfolioChecklist: string[];
  nextCourseSlug?: string;
  nextCourseText: string;
  units: Unit[];
};
