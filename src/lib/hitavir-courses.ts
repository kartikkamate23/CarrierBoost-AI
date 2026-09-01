/** Adapter from the BrihatLabs source catalog to CareerBoost's existing course UI model. */
import { allCourses, findCourseExact } from "./brihatlabs-source/course-data.ts";
import type { Course } from "./types/course.ts";

export type HitavirCourse = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  categories: string[];
  skills: string[];
  url: string;
  source: "BrihatLabs Courses";
  level?: string;
  estimatedHours?: string;
  modules?: number;
  lessons?: number;
  labels?: string[];
  featured?: boolean;
  brihatlabs: Course;
};

const categoryLabels: Record<Course["subject"], string> = {
  analytics: "Analytics", science: "Data Science", ml: "Machine Learning", agents: "AI Agents",
  fullstack: "Full Stack", mern: "MERN", testing: "Software Testing",
};

const toCareerCourse = (course: Course, index: number): HitavirCourse => {
  const lessonCount = course.units.reduce((total, unit) => total + unit.lessons.length, 0);
  return {
    id: course.slug, title: course.title, summary: course.shortDescription, duration: course.duration,
    categories: [categoryLabels[course.subject], course.careerPath],
    skills: [...course.tags, ...course.outcomes], url: `/courses/${course.slug}`,
    source: "BrihatLabs Courses", level: course.level, estimatedHours: course.duration,
    modules: course.units.length, lessons: lessonCount, labels: course.tags, featured: index < 7,
    brihatlabs: course,
  };
};

/** Complete catalog in the exact order exported by BrihatLabs. */
export const hitavirCourses: HitavirCourse[] = allCourses.map(toCareerCourse);
export const brihatlabsCourses = hitavirCourses;
export const featuredHitavirCourses = hitavirCourses.filter((course) => course.featured);
export const featuredBrihatLabsCourses = featuredHitavirCourses;
export const hitavirCoursePath = (id: string) => `/courses/${id}`;
export const brihatlabsCoursePath = hitavirCoursePath;

export function findHitavirCourse(courseId: string) {
  const source = findCourseExact(courseId);
  return source ? hitavirCourses.find((course) => course.id === source.slug) : undefined;
}
export const findBrihatLabsCourse = findHitavirCourse;

const roleTerms: Record<string, string[]> = {
  analytics: ["analytics", "sql", "excel", "power bi", "tableau"], science: ["data science", "python", "statistics", "machine learning"],
  ml: ["machine learning", "deep learning", "nlp", "model"], agents: ["ai", "agent", "generative", "rag", "mcp"],
  fullstack: ["full stack", "react", "node", "javascript", "web"], mern: ["mern", "react", "node", "mongodb"],
  testing: ["testing", "qa", "playwright", "quality"],
};

export function getCoursesForTargetRole(targetRole: string, limit = 6): HitavirCourse[] {
  const role = targetRole.toLowerCase();
  return hitavirCourses
    .map((course, index) => {
      const terms = [...(roleTerms[course.brihatlabs.subject] ?? []), course.brihatlabs.careerPath.toLowerCase()];
      const roleBias = role.includes("devops") && ["fullstack", "testing"].includes(course.brihatlabs.subject) ? 4 : 0;
      return { course, index, score: roleBias + terms.reduce((total, term) => total + (role.includes(term) ? 3 : 0), 0) };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(1, Math.min(limit, hitavirCourses.length)))
    .map(({ course }) => course);
}

export function recommendHitavirCourses(skillKeys: string[], limit = 6, targetRole = "") {
  const wanted = skillKeys.map((key) => key.toLowerCase());
  const pool = targetRole ? getCoursesForTargetRole(targetRole, hitavirCourses.length) : hitavirCourses;
  return pool
    .map((course, index) => ({ course, index, score: course.skills.reduce((total, skill) => total + (wanted.some((key) => skill.toLowerCase().includes(key) || key.includes(skill.toLowerCase())) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score || a.index - b.index).slice(0, Math.max(1, limit)).map(({ course }) => course);
}
export const recommendBrihatLabsCourses = recommendHitavirCourses;

/** Existing detail UI outline, derived from every BrihatLabs unit and lesson. */
export const hitavirCourseOutlines: Record<string, string[]> = Object.fromEntries(
  hitavirCourses.map((course) => [course.id, course.brihatlabs.units.flatMap((unit) => [unit.title, ...unit.lessons.map((lesson) => lesson.title)])]),
);
export const brihatlabsCourseOutlines = hitavirCourseOutlines;
