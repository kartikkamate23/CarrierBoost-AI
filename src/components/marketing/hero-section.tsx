import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/patterns/stat";
import { HeroPreview } from "@/components/marketing/app-preview";
import { slideUp, stagger } from "@/lib/motion";

const assurances = ["No account required", "Runs in your browser", "PDF & DOCX"];

export function HeroSection() {
  return (
    <section className="bg-mesh relative overflow-hidden border-b">
      {/* Soft glow anchored behind the headline. */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-28">
        <motion.div initial={false} animate="visible" variants={stagger(0.08)}>
          <motion.div variants={slideUp}>
            <Eyebrow icon={Sparkles}>Explainable career intelligence</Eyebrow>
          </motion.div>

          <motion.h1
            variants={slideUp}
            className="mt-6 font-display text-h1 text-foreground sm:text-display"
          >
            Turn resume gaps into <span className="text-gradient">job-ready proof</span>.
          </motion.h1>

          <motion.p variants={slideUp} className="mt-6 max-w-xl text-body-lg text-muted-foreground">
            CareerBoost AI scores your resume against a target role using a transparent, versioned
            rubric — then turns every gap into BrihatLabs coursework, portfolio projects
            and interview practice.
          </motion.p>

          <motion.div variants={slideUp} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="btn-glow h-12 px-6 text-body">
              <Link to="/analyze">
                Analyze my resume — free
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-body">
              <Link to="/sample-report">View a sample report</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={slideUp}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-small text-muted-foreground"
          >
            {assurances.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
