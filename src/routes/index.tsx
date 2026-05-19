import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileSearch, Sparkles, BarChart3, ShieldCheck, Zap, Target } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ResumeIQ — AI Resume Analyzer & ATS Scoring" },
      { name: "description", content: "Get instant AI-powered ATS scores, missing keywords, and tailored improvement suggestions for your resume in seconds." },
    ],
  }),
});

const features = [
  { icon: BarChart3, title: "ATS Score out of 100", desc: "Know exactly how applicant tracking systems read your resume." },
  { icon: Target, title: "Job Role Match", desc: "Compare your resume against any target role and see the gap." },
  { icon: FileSearch, title: "Keyword Scanner", desc: "Find the keywords recruiters look for — and the ones you're missing." },
  { icon: Sparkles, title: "AI Suggestions", desc: "Get concrete, role-aware improvements written for you." },
  { icon: ShieldCheck, title: "Grammar & Formatting", desc: "Catch typos, weak phrasing, and formatting issues automatically." },
  { icon: Zap, title: "Instant Analysis", desc: "Upload a PDF and receive a full report in under 30 seconds." },
];

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by Gemini AI
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Land more interviews with a <span className="text-gradient">resume that scores</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload your resume, choose a target role, and get an instant ATS score, missing keywords, and AI-written improvements.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="h-12 px-7 text-base shadow-lg btn-glow">
                  Analyze my resume — free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                  I have an account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="glass-strong rounded-3xl p-6 shadow-2xl sm:p-10">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { label: "ATS Score", value: "92", tag: "Excellent", color: "text-success" },
                  { label: "Role Match", value: "87%", tag: "Senior Engineer", color: "text-primary" },
                  { label: "Keywords Found", value: "24/30", tag: "+6 to add", color: "text-warning" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/60 p-6 text-left">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    <p className={`mt-2 text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to beat the bots</h2>
            <p className="mt-3 text-muted-foreground">
              Modern recruiters use ATS filters. ResumeIQ tells you exactly what to fix.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 transition hover:shadow-elevated"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to score your resume?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Free to start. No credit card required.
            </p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button size="lg" className="h-12 px-8 text-base btn-glow">Get started for free</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
