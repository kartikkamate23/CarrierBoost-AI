import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, GraduationCap, MessageSquareText } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/shell/brand-mark";
import { slideUp, stagger } from "@/lib/motion";

/**
 * Focused split-screen shell for the authentication screens.
 *
 * Presentational only — it renders whatever form it is given and holds no
 * state. The brand panel is decorative and collapses away below `lg`, so small
 * screens get the form immediately without scrolling past marketing content.
 *
 * Each point below restates behavior the product already has.
 */
const points = [
  {
    icon: BarChart3,
    title: "Explainable scoring",
    body: "Every dimension shows its evidence, what is missing and the expected gain — against a stated rubric version.",
  },
  {
    icon: GraduationCap,
    title: "Gaps mapped to real courses",
    body: "Detected weaknesses connect to the verified BrihatLabs catalogue, not a generic skills list.",
  },
  {
    icon: MessageSquareText,
    title: "Practice tied to your target role",
    body: "Interview questions and mentor sessions follow the role you are actually aiming at.",
  },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel — decorative, desktop only. */}
      <aside
        className="edge-highlight relative hidden overflow-hidden bg-[image:var(--gradient-brand)] p-12 text-white lg:flex lg:flex-col"
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5">
          <BrandMark className="bg-white/15 shadow-none" />
          <BrandWordmark className="text-white [&_span]:text-white/70" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.08, 0.1)}
          className="relative my-auto max-w-md py-12"
        >
          <motion.h2 variants={slideUp} className="font-display text-h1 text-white">
            Turn resume gaps into job-ready proof.
          </motion.h2>

          <motion.ul variants={slideUp} className="mt-10 space-y-7">
            {points.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                  <point.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-body font-semibold text-white">{point.title}</p>
                  <p className="mt-1 text-small leading-6 text-white/75">{point.body}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <p className="relative text-small text-white/70">
          Guest analysis runs in your browser and needs no account.
        </p>
      </aside>

      {/* Form panel. */}
      <div className="flex flex-col bg-background">
        <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:invisible"
            aria-label="CareerBoost AI home"
          >
            <BrandMark className="h-8 w-8" />
            <BrandWordmark />
          </Link>

          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to site
          </Link>
        </header>

        <main
          id="main-content"
          className="flex flex-1 items-center justify-center px-5 pb-14 pt-4 sm:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
