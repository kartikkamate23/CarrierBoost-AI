import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Check,
  Copy,
  LoaderCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InlineError } from "@/components/patterns/error-state";
import { askMentor } from "@/lib/mentor.functions";
import { getCoursesForTargetRole, brihatlabsCourses } from "@/lib/brihatlabs-courses";
import { mentorModes } from "@/lib/program-data";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";
import { cn } from "@/lib/utils";

type Message = { role: "assistant" | "user"; content: string };
type Provider = "openai" | "lovable" | "offline" | null;

const welcome: Message = {
  role: "assistant",
  content:
    "I’m your CareerBoost industry mentor. Select a BrihatLabs course and coaching mode, then share the concept, code, project decision, or interview skill you want to improve. I’ll diagnose before advising and require evidence before claiming mastery.",
};

const quickPrompts: Record<string, string[]> = {
  "Teach me": ["Teach me this course from the beginning", "Help me understand a difficult concept"],
  "Explain simply": ["Explain this with a practical analogy", "Show me a tiny working example"],
  "Give me a hint": ["I’m stuck—give me only the first hint", "Help me isolate the failure"],
  "Quiz me": ["Start a five-question adaptive quiz", "Quiz me on production trade-offs"],
  "Review my code": [
    "Review this code for correctness and reliability",
    "Help me debug this error",
  ],
  "Review my project": [
    "Review my architecture and identify risks",
    "Assess my portfolio evidence",
  ],
  "Prepare me for an interview": [
    "Run a senior-level mock interview",
    "Help me improve this answer",
  ],
  "Test my mastery": [
    "Give me a mastery scenario",
    "Assess whether I can apply this in production",
  ],
};

export const Route = createFileRoute("/mentor")({
  component: Mentor,
  head: () => ({ meta: [{ title: "AI Mentor | CareerBoost AI" }] }),
});

function Mentor() {
  const runMentor = useServerFn(askMentor);
  const [mode, setMode] = useState("Teach me");
  const [courseId, setCourseId] = useState("python-data-engineering");
  const [targetRole, setTargetRole] = useState("Data Engineer");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<Provider>(null);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const roleCourses = useMemo(() => getCoursesForTargetRole(targetRole, 6), [targetRole]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("careerboost-mentor-session") ?? "null") as {
        messages?: Message[];
        mode?: string;
        courseId?: string;
        targetRole?: string;
      } | null;
      if (saved?.messages?.length) {
        const recent = saved.messages.slice(-30);
        const deduplicated = recent.filter(
          (message, index) =>
            index === 0 ||
            message.role !== recent[index - 1]?.role ||
            message.content !== recent[index - 1]?.content,
        );
        setMessages(deduplicated);
      }
      if (saved?.mode && mentorModes.some((item) => item === saved.mode)) setMode(saved.mode);
      if (saved?.courseId && brihatlabsCourses.some((course) => course.id === saved.courseId))
        setCourseId(saved.courseId);
      if (saved?.targetRole) setTargetRole(saved.targetRole);
      else setTargetRole(loadTargetRole());
    } catch {
      // A corrupt or blocked local store should never break the mentor.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "careerboost-mentor-session",
        JSON.stringify({ messages, mode, courseId, targetRole }),
      );
    } catch {
      // Conversation remains available for the current session.
    }
    saveTargetRole(targetRole);
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mode, courseId, targetRole]);

  useEffect(() => {
    if (!roleCourses.some((course) => course.id === courseId) && roleCourses[0]) {
      setCourseId(roleCourses[0].id);
    }
  }, [courseId, roleCourses]);

  const send = async (preset?: string) => {
    const learnerText = (preset ?? input).trim();
    if (!learnerText || busy) return;
    if (targetRole.trim().length < 2) {
      setError("Enter a target role before starting the mentor session.");
      return;
    }
    const userMessage: Message = { role: "user", content: learnerText };
    const conversation = [...messages, userMessage].slice(-20);
    const previousMessages = messages;
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const result = await runMentor({
        data: {
          mode: mode as (typeof mentorModes)[number],
          courseId,
          targetRole: targetRole.trim(),
          messages: conversation,
        },
      });
      setProvider(result.provider);
      setMessages((current) => [...current, { role: "assistant", content: result.text }]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The mentor could not respond.";
      setMessages(previousMessages);
      setInput(learnerText);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setMessages([welcome]);
    setProvider(null);
    setError("");
    try {
      localStorage.removeItem("careerboost-mentor-session");
    } catch {
      // Reset still applies in memory.
    }
  };

  const activeCourse = roleCourses.find((course) => course.id === courseId);

  return (
    <ProductPage
      eyebrow="Adaptive AI mentor · Curriculum grounded"
      title="Practise with an industry-grade technical mentor."
      description="Get diagnostic teaching, progressive hints, code and project reviews, adaptive quizzes, interview practice, and evidence-based mastery checks."
      showIntro={false}
    >
      <header className="mb-6">
        <p className="text-caption uppercase text-primary">Adaptive AI mentor</p>
        <h1 className="mt-2 font-display text-h2 text-foreground">
          Practise with an industry-grade technical mentor.
        </h1>
        <p className="mt-2 max-w-3xl text-body text-muted-foreground">
          Diagnostic teaching, progressive hints, code and project reviews, adaptive quizzes,
          interview practice and evidence-based mastery checks — grounded in the BrihatLabs course
          outline.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[16rem_minmax(0,1fr)_17rem]">
        {/* LEFT — session setup */}
        <aside className="h-fit space-y-5 xl:sticky xl:top-20">
          <div className="surface-card space-y-4 p-5">
            <div>
              <Label htmlFor="mentor-role" className="text-small font-medium">
                Target role
              </Label>
              <Input
                id="mentor-role"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="mt-2 h-10"
                maxLength={120}
              />
            </div>
            <div>
              <Label htmlFor="mentor-course" className="text-small font-medium">
                BrihatLabs course
              </Label>
              <select
                id="mentor-course"
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {roleCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-caption uppercase text-muted-foreground">Coaching mode</h2>
            {/* Horizontal scroll on narrow screens, vertical rail on xl. */}
            <div className="scrollbar-slim -mx-1 mt-3 overflow-x-auto px-1 xl:overflow-visible">
              <div className="flex min-w-max gap-1.5 xl:grid xl:min-w-0 xl:gap-1">
                {mentorModes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    aria-pressed={mode === item}
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-2 text-left text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:w-full",
                      mode === item
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* CENTRE — conversation */}
        <section className="surface-card flex min-h-[34rem] flex-col overflow-hidden xl:min-h-[42rem]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-white"
                aria-hidden="true"
              >
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-small font-semibold text-foreground">
                  CareerBoost Mentor
                </p>
                <p className="truncate text-small text-muted-foreground">{mode}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ProviderChip provider={provider} />
              <Button type="button" variant="outline" size="sm" onClick={reset} disabled={busy}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> New session
              </Button>
            </div>
          </header>

          <div
            ref={logRef}
            className="scrollbar-slim max-h-[34rem] flex-1 space-y-5 overflow-y-auto p-4 sm:p-5"
            role="log"
            aria-live="polite"
            aria-label="Mentor conversation"
          >
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} message={message} />
            ))}
            {busy && (
              <div className="flex items-start gap-3">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-small text-muted-foreground">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Mentor is reasoning through your context…
                </div>
              </div>
            )}
          </div>

          <div className="border-t bg-muted/25 p-4">
            {error && <InlineError message={error} className="mb-3 bg-destructive/10" />}

            <div className="scrollbar-slim -mx-1 mb-3 overflow-x-auto px-1">
              <div className="flex min-w-max gap-2">
                {(quickPrompts[mode] ?? []).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void send(prompt)}
                    disabled={busy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-small text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-input bg-background p-2 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/30">
              <label htmlFor="mentor-message" className="sr-only">
                Message to mentor
              </label>
              <Textarea
                id="mentor-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask a question, paste code, describe an architecture, or answer the mentor…"
                className="min-h-20 resize-y border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
                maxLength={6000}
                disabled={busy}
              />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-1.5">
                <p className="text-small text-muted-foreground">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 text-caption normal-case tracking-normal">
                    Ctrl/⌘ + Enter
                  </kbd>{" "}
                  to send · {input.length}/6000
                </p>
                <Button
                  onClick={() => void send()}
                  size="sm"
                  className="h-9 shrink-0"
                  aria-label="Send message"
                  disabled={!input.trim() || busy}
                >
                  {busy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — session context */}
        <aside className="h-fit space-y-4 xl:sticky xl:top-20">
          <div className="surface-card p-5">
            <h2 className="text-caption uppercase text-muted-foreground">This session</h2>
            <dl className="mt-3 space-y-3">
              <ContextRow label="Coaching mode" value={mode} />
              <ContextRow label="Target role" value={targetRole.trim() || "Not set"} />
              <ContextRow label="Course" value={activeCourse?.title ?? "Not selected"} />
              <ContextRow label="Provider" value={providerLabel(provider)} />
            </dl>
          </div>

          <div className="surface-card p-5">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg bg-success/10 text-success"
              aria-hidden="true"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <h2 className="mt-3 text-small font-semibold text-foreground">
              Curriculum-grounded and injection-resistant
            </h2>
            <p className="mt-1.5 text-small leading-6 text-muted-foreground">
              The mentor stays inside the verified course outline and treats anything you paste as
              untrusted content. Never share secrets, private customer data or production
              credentials.
            </p>
          </div>
        </aside>
      </div>
    </ProductPage>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-small text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-small font-medium text-foreground">{value}</dd>
    </div>
  );
}

function ProviderChip({ provider }: { provider: Provider }) {
  const tone =
    provider === "offline"
      ? "border-warning/30 bg-warning/10 text-warning"
      : provider === null
        ? "border-border bg-muted text-muted-foreground"
        : "border-success/30 bg-success/10 text-success";
  return (
    <span
      className={cn(
        "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption normal-case tracking-normal sm:inline-flex",
        tone,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {providerLabel(provider)}
    </span>
  );
}

function providerLabel(provider: Provider) {
  if (provider === "openai") return "OpenAI connected";
  if (provider === "lovable") return "AI provider connected";
  if (provider === "offline") return "offline coaching engine";
  return "ready";
}

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard access is unavailable.");
    }
  };

  const isUser = message.role === "user";

  return (
    <div className={cn("group flex items-start gap-3", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary",
        )}
        aria-hidden="true"
      >
        {isUser ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>

      <div className={cn("relative min-w-0 max-w-[85%]", isUser && "text-right")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-small leading-7",
            isUser
              ? "rounded-tr-sm bg-primary text-left text-primary-foreground"
              : "rounded-tl-sm bg-secondary text-secondary-foreground",
          )}
        >
          {/* Rendered as plain text, exactly as before — no Markdown parsing. */}
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>

        {!isUser && (
          <button
            type="button"
            onClick={copy}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border bg-card text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
            aria-label="Copy mentor response"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
