import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/patterns/empty-state";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestion,
  getTechnologiesForRole,
  interviewTrackRequiresTechnology,
  interviewRoles,
  resolveInterviewRole,
  type InterviewDifficulty,
  type InterviewQuestion,
  type InterviewTrack,
} from "@/lib/interview-questions";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";
import { cn } from "@/lib/utils";

const tracks: Array<{ value: InterviewTrack; label: string; description: string }> = [
  { value: "Technical", label: "Technical", description: "Concepts, scenarios, and design" },
  { value: "HR", label: "HR", description: "Behaviour, ownership, and communication" },
  { value: "Coding", label: "Coding", description: "Role-based implementation problems" },
];

const difficulties: InterviewDifficulty[] = ["Easy", "Medium", "Hard"];

export const Route = createFileRoute("/interviewiq")({
  component: InterviewIQ,
  head: () => ({ meta: [{ title: "InterviewIQ | CareerBoost AI" }] }),
});

function InterviewIQ() {
  const [role, setRole] = useState("Data Engineer");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [track, setTrack] = useState<InterviewTrack>("Technical");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("Easy");
  const [sequence, setSequence] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<ReturnType<typeof evaluateInterviewAnswer> | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<InterviewQuestion | null>(null);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    const savedRole = resolveInterviewRole(loadTargetRole());
    setRole(savedRole);
  }, []);

  const technologies = useMemo(() => getTechnologiesForRole(role), [role]);
  const technologyRequired = interviewTrackRequiresTechnology(track);
  const generatedQuestion = useMemo(
    () =>
      !technologyRequired || selectedTechnologies.length
        ? generateInterviewQuestion({
            role,
            technologies: technologyRequired ? selectedTechnologies : ["Role-based HR"],
            track,
            difficulty,
            sequence,
          })
        : null,
    [difficulty, role, selectedTechnologies, sequence, technologyRequired, track],
  );
  const question = followUpQuestion ?? generatedQuestion;

  const averageScore = scores.length
    ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
    : 0;

  const clearCurrentAnswer = () => {
    setAnswer("");
    setFeedback(null);
    setFollowUpQuestion(null);
  };

  const generateNext = () => {
    setSequence((current) => current + 1);
    clearCurrentAnswer();
  };

  const changeRole = (nextRole: string) => {
    setRole(nextRole);
    saveTargetRole(nextRole);
    setSelectedTechnologies([]);
    setSequence((current) => current + 1);
    clearCurrentAnswer();
  };

  const changeTrack = (nextTrack: InterviewTrack) => {
    setTrack(nextTrack);
    setSequence((current) => current + 1);
    clearCurrentAnswer();
  };

  const changeDifficulty = (nextDifficulty: InterviewDifficulty) => {
    setDifficulty(nextDifficulty);
    setSequence((current) => current + 1);
    clearCurrentAnswer();
  };

  const toggleTechnology = (technology: string) => {
    setSelectedTechnologies((current) => {
      if (current.includes(technology)) {
        return current.filter((item) => item !== technology);
      }
      return [...current, technology];
    });
    setSequence((current) => current + 1);
    clearCurrentAnswer();
  };

  const submitAnswer = () => {
    if (!question) return;
    const result = evaluateInterviewAnswer(question, answer);
    setFeedback(result);
    setScores((current) => [...current, result.score]);
  };

  const answerFollowUp = () => {
    if (!question || !feedback) return;
    setFollowUpQuestion({
      ...question,
      id: `${question.id}-follow-up-${scores.length + 1}`,
      prompt: feedback.followUpPrompt,
      signals: feedback.missedSignals.length ? feedback.missedSignals : question.signals,
    });
    setAnswer("");
    setFeedback(null);
  };

  return (
    <ProductPage
      eyebrow=""
      title={
        <>
          {role} <span className="text-primary">Interview Practice</span>
        </>
      }
      description="Build interview confidence with unlimited role-specific questions, realistic follow-ups, and actionable answer feedback."
      showIntro={false}
    >
      <header className="mb-6">
        <p className="text-caption uppercase text-primary">InterviewIQ</p>
        <h1 className="mt-2 font-display text-h2 text-foreground">
          {role} <span className="text-primary">interview practice</span>
        </h1>
        <p className="mt-2 max-w-3xl text-body text-muted-foreground">
          Unlimited role-specific questions, realistic follow-ups and evidence-based answer
          feedback.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
        {/* Setup rail */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <section className="surface-card p-5">
            <label
              htmlFor="interview-role"
              className="text-caption uppercase text-muted-foreground"
            >
              Interview role
            </label>
            <select
              id="interview-role"
              value={role}
              onChange={(event) => changeRole(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {interviewRoles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <p className="mt-6 text-caption uppercase text-muted-foreground">
              Question technologies
            </p>
            <p className="mt-1.5 text-small leading-6 text-muted-foreground">
              {technologyRequired
                ? "Choose one or more question topics."
                : "Optional for HR questions. HR practice is based on your target role."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.map((technology) => {
                const selected = selectedTechnologies.includes(technology);
                return (
                  <button
                    type="button"
                    key={technology}
                    aria-pressed={selected}
                    onClick={() => toggleTechnology(technology)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {technology}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-5">
            <p className="text-caption uppercase text-muted-foreground">Session performance</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-h2 tabular-nums text-primary">{averageScore}</span>
              <span className="text-small text-muted-foreground">/100 average</span>
            </div>
            <Progress
              value={averageScore}
              className="mt-3 h-1.5"
              aria-label="Average interview score"
            />
            <p className="mt-3 text-small text-muted-foreground">
              {scores.length} {scores.length === 1 ? "answer" : "answers"} reviewed in this session
              · no fixed question limit
            </p>
          </section>
        </aside>

        {/* Practice column */}
        <div className="min-w-0 space-y-4">
          <section className="surface-card p-5" aria-labelledby="focus-heading">
            <h2 id="focus-heading" className="text-caption uppercase text-muted-foreground">
              Interview focus
            </h2>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {tracks.map((item) => {
                const active = track === item.value;
                const Icon =
                  item.value === "Technical"
                    ? Sparkles
                    : item.value === "Coding"
                      ? Code2
                      : MessageSquareText;
                return (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => changeTrack(item.value)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary/50 bg-primary/10"
                        : "border-border hover:border-primary/40 hover:bg-accent/50",
                    )}
                  >
                    <span className="flex items-center gap-2 text-small font-semibold text-foreground">
                      <Icon
                        className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")}
                        aria-hidden="true"
                      />
                      {item.label}
                    </span>
                    <span className="mt-1 block text-small text-muted-foreground">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-caption uppercase text-muted-foreground">Difficulty</span>
              <div
                className="inline-flex rounded-lg border border-border bg-muted/60 p-1"
                role="group"
                aria-label="Question difficulty"
              >
                {difficulties.map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => changeDifficulty(level)}
                    aria-pressed={difficulty === level}
                    className={cn(
                      "rounded-md px-3.5 py-1.5 text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      difficulty === level
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {question ? (
            <section className="surface-card overflow-hidden" aria-labelledby="question-heading">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 p-4 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <Chip tone="primary">{question.track}</Chip>
                  <Chip>{question.difficulty}</Chip>
                  {question.track !== "HR" ? <Chip>{question.technology}</Chip> : null}
                  {followUpQuestion ? <Chip tone="accent">Follow-up</Chip> : null}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={generateNext}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> New question
                </Button>
              </div>

              <div className="p-5 sm:p-6">
                <h2
                  id="question-heading"
                  className="font-display text-h3 leading-8 text-foreground"
                >
                  {question.prompt}
                </h2>
                <p className="mt-2.5 text-small leading-6 text-muted-foreground">
                  {question.guidance}
                </p>

                <label htmlFor="interview-answer" className="sr-only">
                  Your answer to: {question.prompt}
                </label>
                <div className="mt-5 rounded-xl border border-input bg-background p-2 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/30">
                  <Textarea
                    id="interview-answer"
                    value={answer}
                    disabled={Boolean(feedback)}
                    onChange={(event) => setAnswer(event.target.value)}
                    className="min-h-44 resize-y border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
                    placeholder={
                      track === "Coding"
                        ? "Write code or pseudocode, explain assumptions, edge cases, tests, and complexity…"
                        : "Structure your answer with context, decisions, evidence, trade-offs, and outcome…"
                    }
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-1.5">
                    <span className="text-small text-muted-foreground">
                      Scoring uses the visible evidence expected for this level.
                    </span>
                    <span className="text-small tabular-nums text-muted-foreground">
                      {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
                    </span>
                  </div>
                </div>

                {feedback ? (
                  <FeedbackPanel
                    feedback={feedback}
                    onFollowUp={answerFollowUp}
                    onNext={generateNext}
                  />
                ) : (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={submitAnswer}
                      disabled={answer.trim().split(/\s+/).filter(Boolean).length < 15}
                      className="btn-glow h-11"
                    >
                      Review answer
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {answer.trim().split(/\s+/).filter(Boolean).length < 15 ? (
                      <p className="inline-flex items-center gap-1.5 text-small text-muted-foreground">
                        <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        Write at least 15 words to get a review.
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Choose a technology to start practising"
              description="No technology is selected automatically. Pick one or more topics from the panel for Technical or Coding questions. HR questions do not require one."
              className="min-h-80"
            />
          )}
        </div>
      </div>
    </ProductPage>
  );
}

function Chip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "primary" | "accent";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-caption normal-case tracking-normal",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "accent" && "bg-brand-accent-soft text-brand-accent-strong",
        tone === "default" && "bg-secondary text-secondary-foreground",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Renders only what `evaluateInterviewAnswer` already returns: score,
 * matchedSignals, missedSignals, wordCount and followUpPrompt. No additional
 * metric is derived or invented.
 */
function FeedbackPanel({
  feedback,
  onFollowUp,
  onNext,
}: {
  feedback: ReturnType<typeof evaluateInterviewAnswer>;
  onFollowUp: () => void;
  onNext: () => void;
}) {
  const tone = feedback.score >= 70 ? "success" : feedback.score >= 40 ? "warning" : "destructive";

  return (
    <section
      className="mt-6 overflow-hidden rounded-xl border border-border"
      aria-labelledby="feedback-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/50 p-4 sm:px-5">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "grid h-16 w-16 shrink-0 place-items-center rounded-2xl",
              tone === "success" && "bg-success/10 text-success",
              tone === "warning" && "bg-warning/10 text-warning",
              tone === "destructive" && "bg-destructive/10 text-destructive",
            )}
          >
            <span className="font-display text-h3 tabular-nums">{feedback.score}</span>
          </div>
          <div>
            <h3 id="feedback-heading" className="text-small font-semibold text-foreground">
              Interview feedback
            </h3>
            <p className="mt-0.5 text-small text-muted-foreground">
              {feedback.score}/100 · {feedback.wordCount}{" "}
              {feedback.wordCount === 1 ? "word" : "words"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onFollowUp}>
            Answer follow-up
          </Button>
          <Button onClick={onNext}>
            Next question
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <SignalList
          tone="success"
          title="Strong evidence"
          signals={feedback.matchedSignals}
          fallback="No expected evidence was explicit yet."
        />
        <SignalList
          tone="warning"
          title="Areas to strengthen"
          signals={feedback.missedSignals}
          fallback="All expected evidence was covered."
        />
      </div>

      <div className="border-t bg-primary/5 p-4 sm:p-5">
        <p className="text-caption uppercase text-primary">Interviewer follow-up</p>
        <p className="mt-2 text-body font-medium leading-7 text-foreground">
          {feedback.followUpPrompt}
        </p>
      </div>
    </section>
  );
}

function SignalList({
  tone,
  title,
  signals,
  fallback,
}: {
  tone: "success" | "warning";
  title: string;
  signals: string[];
  fallback: string;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-caption uppercase",
          tone === "success" ? "text-success" : "text-warning",
        )}
      >
        {title}
      </p>
      {signals.length ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {signals.map((signal) => (
            <li
              key={signal}
              className={cn(
                "rounded-md px-2.5 py-1 text-small",
                tone === "success" ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
              )}
            >
              {signal}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 text-small text-muted-foreground">{fallback}</p>
      )}
    </div>
  );
}
