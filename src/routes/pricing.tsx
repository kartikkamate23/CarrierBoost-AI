import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Minus, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading, Reveal, RevealItem } from "@/components/marketing/section";
import { Eyebrow } from "@/components/patterns/stat";
import { revealOnce, slideUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Static pricing presentation.
 *
 * There is no billing system in this application: no payment provider, no
 * checkout, no subscription records and no billing tables. Nothing on this page
 * initiates a transaction — every call to action routes to the existing signup
 * or analyzer route, and the page states plainly that plans are not yet
 * purchasable.
 *
 * The "Free" column describes what the product does today. The other two
 * columns describe intended future packaging and are labelled as such.
 */

const description =
  "CareerBoost AI pricing. Guest resume analysis is free today; paid plans are still in development and are not yet purchasable.";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing | CareerBoost AI" },
      { name: "description", content: description },
      { property: "og:title", content: "Pricing | CareerBoost AI" },
      { property: "og:description", content: description },
      { name: "twitter:description", content: description },
    ],
  }),
});

type Plan = {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  status: "available" | "planned";
  featured?: boolean;
  includes: string[];
  cta: { label: string; to: "/analyze" | "/signup" };
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Everything the platform does today, at no cost.",
    status: "available",
    includes: [
      "Unlimited guest resume analysis",
      "All explainable score dimensions",
      "Priority actions and evidence gaps",
      "Role-matched Hitavir Tech course path",
      "InterviewIQ practice and answer feedback",
      "AI Mentor across eight coaching modes",
      "Saved reports and score history with an account",
    ],
    cta: { label: "Analyze my resume", to: "/analyze" },
  },
  {
    name: "Pro",
    price: "—",
    cadence: "pricing not set",
    tagline: "Planned tier for sustained, multi-role job searches.",
    status: "planned",
    featured: true,
    includes: [
      "Everything in Free",
      "Higher AI analysis limits",
      "Multiple target roles tracked side by side",
      "Longer report retention",
      "Priority AI processing",
    ],
    cta: { label: "Create a free account", to: "/signup" },
  },
  {
    name: "Career Pro",
    price: "—",
    cadence: "pricing not set",
    tagline: "Planned tier for reviewed, evidence-backed portfolios.",
    status: "planned",
    includes: [
      "Everything in Pro",
      "Structured ProjectLab rubric review",
      "Verified mastery records",
      "Extended interview practice history",
      "Team and cohort administration",
    ],
    cta: { label: "Create a free account", to: "/signup" },
  },
];

/** null = not included, true = included, string = qualified note. */
const comparison: Array<{
  feature: string;
  free: true | null | string;
  pro: true | null | string;
  career: true | null | string;
}> = [
  { feature: "Guest resume analysis", free: true, pro: true, career: true },
  { feature: "Explainable score breakdown", free: true, pro: true, career: true },
  { feature: "Hitavir Tech course path", free: true, pro: true, career: true },
  { feature: "InterviewIQ practice", free: true, pro: true, career: true },
  { feature: "AI Mentor", free: true, pro: true, career: true },
  { feature: "Saved reports and history", free: "With an account", pro: true, career: true },
  { feature: "AI cover letters", free: "With an account", pro: true, career: true },
  { feature: "Higher AI limits", free: null, pro: "Planned", career: "Planned" },
  { feature: "Multiple tracked roles", free: null, pro: "Planned", career: "Planned" },
  { feature: "ProjectLab rubric review", free: null, pro: null, career: "Planned" },
  { feature: "Verified mastery records", free: null, pro: null, career: "Planned" },
];

const faqs = [
  {
    question: "Can I pay for a plan right now?",
    answer:
      "No. CareerBoost AI has no payment system connected — there is no checkout, no card handling and no subscription billing anywhere in the product. The Pro and Career Pro columns describe intended packaging so you can see the direction, not something you can buy today.",
  },
  {
    question: "So what does it cost to use it today?",
    answer:
      "Nothing. Guest resume analysis, InterviewIQ, the roadmap, SkillPath and the AI Mentor are all usable now at no cost. Creating an account is also free and adds saved reports, score history and AI cover letters.",
  },
  {
    question: "Will the free tier disappear when paid plans launch?",
    answer:
      "There is no plan to remove it. Guest analysis running locally in your browser is a deliberate part of the product, not a trial mechanic, and we would rather tell you that plainly than imply scarcity that does not exist.",
  },
  {
    question: "Why are the paid prices blank?",
    answer:
      "Because they have not been decided. Publishing a number we might change would be worse than showing you an honest dash. When pricing is set, this page will say so.",
  },
  {
    question: "What about the Hitavir Tech courses?",
    answer:
      "Course content is hosted in the Hitavir Tech learning portal and may require separate enrolment there. CareerBoost AI maps your detected skill gaps onto that catalogue; it does not resell the courses.",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <section className="bg-mesh border-b">
          <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
            <motion.div initial="hidden" animate="visible" variants={slideUp}>
              <Eyebrow icon={Clock}>Paid plans in development</Eyebrow>
              <h1 className="mt-6 font-display text-h1 text-foreground sm:text-display">
                Free to use today.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-body-lg text-muted-foreground">
                Every feature CareerBoost AI ships right now is available at no cost. Paid tiers are
                still being designed — you cannot buy one yet, and we would rather say so than put a
                fake button on this page.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="btn-glow h-12 px-6 text-body">
                  <Link to="/analyze">
                    Analyze my resume — free
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-body">
                  <Link to="/signup">Create a free account</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Section>
          <Reveal className="grid items-start gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <RevealItem
                key={plan.name}
                className={cn(
                  "surface-card relative flex h-full flex-col p-6 sm:p-7",
                  plan.featured && "border-primary/40 shadow-[var(--shadow-elevated)]",
                )}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-caption normal-case tracking-normal text-primary-foreground">
                    Planned flagship
                  </span>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-h3 text-foreground">{plan.name}</h2>
                  <StatusBadge status={plan.status} />
                </div>

                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-h1 tabular-nums text-foreground">
                    {plan.price}
                  </span>
                  {plan.cadence ? (
                    <span className="text-small text-muted-foreground">{plan.cadence}</span>
                  ) : null}
                </p>
                <p className="mt-2 text-small leading-6 text-muted-foreground">{plan.tagline}</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-small text-muted-foreground">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          plan.status === "available" ? "text-success" : "text-muted-foreground",
                        )}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.featured ? "default" : "outline"}
                  className="mt-7 h-11 w-full"
                >
                  <Link to={plan.cta.to}>{plan.cta.label}</Link>
                </Button>

                {plan.status === "planned" ? (
                  <p className="mt-3 text-center text-small text-muted-foreground">
                    Not yet purchasable
                  </p>
                ) : null}
              </RevealItem>
            ))}
          </Reveal>

          <motion.p
            {...revealOnce}
            variants={slideUp}
            className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-muted/40 p-4 text-center text-small leading-6 text-muted-foreground"
          >
            <strong className="font-medium text-foreground">No payment system is connected.</strong>{" "}
            CareerBoost AI does not process payments, store card details or manage subscriptions.
            Every button on this page leads to the free analyzer or free signup.
          </motion.p>
        </Section>

        <Section tone="muted">
          <SectionHeading
            eyebrow="Compare"
            title="What each tier is intended to include"
            body="Anything marked “Planned” does not exist yet and is shown so you can see where the product is heading."
          />

          <motion.div {...revealOnce} variants={slideUp} className="mt-12">
            {/* Table scrolls inside its own container so the page never moves sideways. */}
            <div className="scrollbar-slim surface-card overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <caption className="sr-only">
                  Feature comparison across the Free, Pro and Career Pro tiers
                </caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="p-4 text-caption uppercase text-muted-foreground">
                      Feature
                    </th>
                    {["Free", "Pro", "Career Pro"].map((name) => (
                      <th
                        key={name}
                        scope="col"
                        className="p-4 text-caption uppercase text-muted-foreground"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b last:border-0">
                      <th scope="row" className="p-4 text-small font-medium text-foreground">
                        {row.feature}
                      </th>
                      <Cell value={row.free} />
                      <Cell value={row.pro} />
                      <Cell value={row.career} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </Section>

        <Section containerClassName="max-w-3xl">
          <SectionHeading
            eyebrow="Straight answers"
            title="Pricing questions"
            body="Including the one most pricing pages avoid."
          />
          <motion.div {...revealOnce} variants={slideUp} className="mt-12">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-b">
                  <AccordionTrigger className="py-5 text-left font-display text-h3 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-body leading-7 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </Section>

        <section className="container mx-auto max-w-7xl px-4 pb-24">
          <motion.div
            {...revealOnce}
            variants={slideUp}
            className="edge-highlight overflow-hidden rounded-3xl bg-[image:var(--gradient-brand)] px-6 py-14 text-center sm:px-12"
          >
            <Sparkles className="mx-auto h-7 w-7 text-white/80" aria-hidden="true" />
            <h2 className="mt-4 font-display text-h2 text-white">
              Nothing to buy. Plenty to find out.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body-lg text-white/80">
              Run the analyzer on your resume and see the gaps, the evidence behind each score, and
              the next action — without an account.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 bg-white px-7 text-body text-primary shadow-lg hover:bg-white/90"
            >
              <Link to="/analyze">Analyze my resume — free</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: "available" | "planned" }) {
  return status === "available" ? (
    <span className="rounded-full bg-success/10 px-2.5 py-1 text-caption normal-case tracking-normal text-success">
      Available now
    </span>
  ) : (
    <span className="rounded-full bg-muted px-2.5 py-1 text-caption normal-case tracking-normal text-muted-foreground">
      In development
    </span>
  );
}

function Cell({ value }: { value: true | null | string }) {
  return (
    <td className="p-4 text-small text-muted-foreground">
      {value === true ? (
        <>
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
          <span className="sr-only">Included</span>
        </>
      ) : value === null ? (
        <>
          <Minus className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
          <span className="sr-only">Not included</span>
        </>
      ) : (
        value
      )}
    </td>
  );
}
