import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import {
  findCourseExact,
  findLessonExact,
  lessonsForCourse,
} from "@/lib/brihatlabs-source/course-data";
import type { ContentBlock, QuizQuestion } from "@/lib/types/course";

export const Route = createFileRoute("/learn/$courseId/$unitId/$lessonId")({
  component: LessonPage,
});

function Content({ block, index }: { block: ContentBlock; index?: number }) {
  switch (block.type) {
    case "heading": return <h2 id={index === undefined ? undefined : `lesson-heading-${index}`} className="mt-8 font-display text-h3 text-foreground">{block.text}</h2>;
    case "paragraph": return <p className="mt-4 text-base leading-7 text-muted-foreground">{block.text}</p>;
    case "list": return <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case "callout": return <aside className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4"><p className="font-semibold text-foreground">{block.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{block.text}</p></aside>;
    case "code": return <pre className="mt-6 max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100"><code>{block.code}</code></pre>;
    case "formula": return <div className="mt-6 rounded-xl border bg-secondary/40 p-4"><p className="font-mono text-sm text-foreground">{block.expression}</p><p className="mt-2 text-sm text-muted-foreground">{block.explanation}</p></div>;
    case "table": return <div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="bg-secondary/50"><tr>{block.headers.map((header) => <th key={header} className="p-3 font-semibold">{header}</th>)}</tr></thead><tbody>{block.rows.map((row, index) => <tr key={index} className="border-t">{row.map((cell, cellIndex) => <td key={cellIndex} className="p-3 text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table></div>;
    case "diagram": return <ol className="mt-6 flex flex-wrap gap-2">{block.items.map((item, index) => <li key={item} className="rounded-lg border bg-card px-3 py-2 text-sm"><span className="mr-2 text-primary">{index + 1}.</span>{item}</li>)}</ol>;
    case "resource": return <a className="mt-5 block rounded-xl border p-4 text-primary hover:bg-secondary/40" href={block.url} target="_blank" rel="noreferrer"><p className="font-semibold">{block.title}</p><p className="mt-1 text-sm text-muted-foreground">{block.description}</p></a>;
    case "video": return <div className="mt-5 rounded-xl border p-4"><p className="font-semibold">{block.title}</p>{block.url ? <a className="mt-1 block text-sm text-primary" href={block.url} target="_blank" rel="noreferrer">Open video resource</a> : null}</div>;
    case "image": return <figure className="mt-6"><img src={block.src} alt={block.alt} className="max-w-full rounded-xl border" />{block.caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption> : null}</figure>;
  }
}

function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.filter((question) => answers[question.id] === question.answer).length;
  return <section className="mt-10 rounded-xl border bg-primary/5 p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Module quiz</p><h2 className="mt-2 font-display text-h3">Check your understanding</h2><p className="mt-2 text-sm text-muted-foreground">Answer each question, then submit to see explanations.</p></div><span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">{questions.length} questions</span></div><div className="mt-6 space-y-5">{questions.map((question, index) => <fieldset key={question.id} className="rounded-xl border bg-background p-4"><legend className="px-2 text-sm font-semibold text-foreground">{index + 1}. {question.prompt}</legend><div className="mt-2 space-y-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${submitted && optionIndex === question.answer ? "border-success bg-success/10" : submitted && answers[question.id] === optionIndex ? "border-destructive bg-destructive/5" : "hover:bg-secondary"}`}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => { setSubmitted(false); setAnswers((current) => ({ ...current, [question.id]: optionIndex })); }} />{option}</label>)}</div>{submitted ? <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {question.explanation}</p> : null}</fieldset>)}</div><div className="mt-6 flex flex-wrap items-center gap-3"><Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length}>Submit quiz</Button>{submitted ? <span className="text-sm font-semibold text-primary">Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)</span> : null}</div></section>;
}

function LessonPage() {
  const { courseId, unitId, lessonId } = useParams({ from: "/learn/$courseId/$unitId/$lessonId" });
  const course = findCourseExact(courseId);
  const current = findLessonExact(courseId, unitId, lessonId);
  const lessons = course ? lessonsForCourse(course.slug) : [];
  const progress = useCourseProgress(course?.slug ?? courseId, lessons.map(({ lesson }) => lesson.id));
  if (!course || !current) return <ProductPage eyebrow="BrihatLabs Courses" title="Lesson not found" description="This lesson is not in the current course catalog."><Button asChild variant="outline"><Link to="/programs">Back to courses</Link></Button></ProductPage>;
  const currentIndex = lessons.findIndex(({ lesson }) => lesson.id === current.lesson.id);
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;
  const currentModuleIndex = course.units.findIndex((unit) => unit.id === unitId);
  const currentModule = course.units[currentModuleIndex];
  const moduleLessonIds = currentModule?.lessons.map((lesson) => lesson.id) ?? [];
  const moduleCompleted = moduleLessonIds.filter((id) => progress.isCompleted(id)).length;
  const modulePercent = moduleLessonIds.length ? Math.round((moduleCompleted / moduleLessonIds.length) * 100) : 0;
  const headings = current.lesson.content.filter((block) => block.type === "heading");
  return <ProductPage eyebrow={`${course.shortTitle} · Lesson`} title={current.lesson.title} description={current.lesson.description} showIntro={false}>
    <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[240px_minmax(0,1fr)_240px]">
      <aside className="surface-card h-fit p-4 lg:sticky lg:top-20"><Link to="/courses/$courseId" params={{ courseId: course.slug }} className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 h-4 w-4" /> Back to course</Link><p className="mb-4 font-display text-lg font-semibold">{course.shortTitle}</p><nav aria-label="Course lessons" className="space-y-3">{course.units.map((unit, unitIndex) => <details key={unit.id} open={unit.id === unitId} className="group"><summary className="cursor-pointer list-none rounded-lg px-2 py-2 text-sm font-semibold text-foreground">{unitIndex + 1}. {unit.title}</summary><ol className="mt-1 space-y-1 border-l pl-3">{unit.lessons.map((lesson, lessonIndex) => <li key={lesson.id}><Link to="/learn/$courseId/$unitId/$lessonId" params={{ courseId: course.slug, unitId: unit.id, lessonId: lesson.id }} aria-current={lesson.id === lessonId ? "page" : undefined} className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs ${lesson.id === lessonId ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{progress.isCompleted(lesson.id) ? <CheckCircle2 className="h-3 w-3 text-success" /> : <span className="w-3 text-[10px]">{lessonIndex + 1}</span>}<span className="min-w-0 truncate">{lesson.title}</span></Link></li>)}</ol></details>)}</nav></aside>
      <main className="surface-card min-w-0 p-5 sm:p-8"><div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-primary"><span>{current.unit.title}</span><span>·</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {current.lesson.duration}</span></div><h1 className="mt-4 font-display text-h1 text-foreground">{current.lesson.title}</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">{current.lesson.description}</p><div className="mt-8">{current.lesson.content.map((block, index) => <Content key={`${block.type}-${index}`} block={block} index={index} />)}</div>{current.lesson.questions?.length ? <QuizSection questions={current.lesson.questions} /> : null}<div className="mt-6 grid items-center gap-4 border-t pt-5 sm:grid-cols-3">{previous ? <Link to="/learn/$courseId/$unitId/$lessonId" params={{ courseId: course.slug, unitId: previous.unit.id, lessonId: previous.lesson.id }} className="group text-left text-sm"><span className="flex items-center text-muted-foreground"><ArrowLeft className="mr-2 h-4 w-4" /> Previous lesson</span><span className="mt-1 block font-semibold text-foreground group-hover:text-primary">{previous.lesson.title}</span></Link> : <span />}{next ? <Button asChild className="mx-auto"><Link to="/learn/$courseId/$unitId/$lessonId" params={{ courseId: course.slug, unitId: next.unit.id, lessonId: next.lesson.id }} onClick={() => progress.setLessonCompleted(current.lesson.id, true)}>Complete &amp; continue</Link></Button> : <Button className="mx-auto" onClick={() => progress.setLessonCompleted(current.lesson.id, true)}><CheckCircle2 className="mr-2 h-4 w-4" /> Completed</Button>}{next ? <Link to="/learn/$courseId/$unitId/$lessonId" params={{ courseId: course.slug, unitId: next.unit.id, lessonId: next.lesson.id }} className="group text-right text-sm"><span className="flex items-center justify-end text-muted-foreground">Next lesson <ArrowRight className="ml-2 h-4 w-4" /></span><span className="mt-1 block font-semibold text-foreground group-hover:text-primary">{next.lesson.title}</span></Link> : <span className="text-right text-sm font-semibold text-success">Course complete</span>}</div></main>
      <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit"><div className="surface-card p-5"><BookOpen className="h-6 w-6 text-primary" /><p className="mt-3 text-sm font-semibold">Course progress</p><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{progress.completedCount}/{lessons.length} lessons</span><span className="font-semibold text-primary">{progress.progressPercent}%</span></div><Progress value={progress.progressPercent} className="mt-2 h-2" /><p className="mt-2 text-xs text-muted-foreground">Module {currentModuleIndex + 1}: {moduleCompleted}/{moduleLessonIds.length} · {modulePercent}%</p><Link to="/courses/$courseId" params={{ courseId: course.slug }} className="mt-4 block text-sm font-semibold text-primary">View course overview</Link></div><div className="surface-card p-5"><p className="text-sm font-semibold">In this lesson</p>{headings.length ? <nav className="mt-3 space-y-2">{headings.map((heading, index) => heading.type === "heading" ? <a key={`${heading.text}-${index}`} href={`#lesson-heading-${index}`} className="block text-xs text-primary hover:underline">{heading.text}</a> : null)}</nav> : <p className="mt-2 text-sm text-muted-foreground">Read through the lesson and mark it complete when you are done.</p>}</div><div className="surface-card p-5"><p className="text-sm font-semibold">Learning context</p><p className="mt-2 text-sm leading-6 text-muted-foreground">You are viewing module {currentModuleIndex + 1} of {course.units.length}. Progress is saved on this device and reaches 100% when every lesson is completed.</p></div></aside>
    </div>
  </ProductPage>;
}
