import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/marketing/section";
import { revealOnce, slideUp, stagger } from "@/lib/motion";
import { mentorModes } from "@/lib/program-data";

/**
 * The illustrative exchange below demonstrates the mentor's diagnose-first
 * style. It is presentation, not a transcript — the live mentor at /mentor
 * generates its own responses.
 */
const sampleExchange = [
  {
    from: "mentor" as const,
    text: "Before we touch Spark partitioning — what happens when a single key holds most of your records?",
  },
  { from: "learner" as const, text: "I think one worker ends up doing most of the work." },
  {
    from: "mentor" as const,
    text: "That's data skew, and you reasoned it out rather than guessing. Let's confirm it on a tiny dataset before changing any configuration.",
  },
];

export function MentorSection() {
  return (
    <Section>
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div {...revealOnce} variants={stagger(0.08)} className="order-2 lg:order-1">
          <motion.div
            variants={slideUp}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-center gap-3 border-b bg-muted/50 p-4">
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
                <p className="truncate text-small text-muted-foreground">
                  Teach me · Data engineering
                </p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-muted px-2.5 py-1 text-caption normal-case tracking-normal text-muted-foreground">
                Illustrative
              </span>
            </div>

            <div className="space-y-3 p-5">
              {sampleExchange.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.from === "learner"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-small leading-6 text-primary-foreground"
                      : "max-w-[88%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-small leading-6 text-secondary-foreground"
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div {...revealOnce} variants={stagger(0.06)} className="order-1 lg:order-2">
          <motion.p variants={slideUp} className="text-caption uppercase text-primary">
            Adaptive, not answer-first
          </motion.p>
          <motion.h2
            variants={slideUp}
            className="mt-3 font-display text-h2 text-foreground sm:text-h1"
          >
            A mentor that refuses to hand over the answer.
          </motion.h2>
          <motion.p variants={slideUp} className="mt-4 text-body-lg text-muted-foreground">
            It diagnoses what you already understand, gives progressive hints instead of solutions,
            stays inside the verified course outline, and separates feeling confident from having
            demonstrated the skill.
          </motion.p>

          <motion.ul variants={slideUp} className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {mentorModes.map((mode) => (
              <li
                key={mode}
                className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-small font-medium text-foreground"
              >
                {mode}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={slideUp}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <Button asChild size="lg" className="h-12 px-6">
              <Link to="/mentor">
                Try the AI Mentor
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="inline-flex items-center gap-2 text-small text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Resistant to prompt injection
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
