import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revealOnce, slideUp } from "@/lib/motion";

const points = ["Free to start", "No account required", "Every score explained"];

export function CtaSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 pb-24">
      <motion.div
        {...revealOnce}
        variants={slideUp}
        className="edge-highlight relative overflow-hidden rounded-3xl bg-[image:var(--gradient-brand)] px-6 py-16 text-center sm:px-12"
      >
        {/* Slow ambient drift behind the copy. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-white/15 blur-3xl"
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-h2 text-white sm:text-h1">
            Your next role starts with an honest look at your resume.
          </h2>
          <p className="mt-4 text-body-lg text-white/80">
            Find out what is actually missing, get the three highest-impact actions, and keep the
            evidence trail all the way through to interview practice.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-7 text-body text-primary shadow-lg hover:bg-white/90"
            >
              <Link to="/analyze">
                Analyze my resume — free
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/35 bg-transparent px-7 text-body text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/signup">Create a free account</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-small text-white/80">
            {points.map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
