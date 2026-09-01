import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/marketing/section";
import { revealOnce, slideUp } from "@/lib/motion";
import { landingSections } from "@/lib/site";

/**
 * Answers describe the application as it actually behaves today.
 */
const faqs = [
  {
    question: "How does the AI actually work?",
    answer:
      "Scoring is deterministic, not generative: a versioned rubric parses your resume, matches it against a role competency map and produces the same result every time for the same input. AI is used separately to write explanations, cover letters and mentor responses — it never sets your score.",
  },
  {
    question: "Is it free?",
    answer:
      "Guest analysis is free and requires no account. You get the full set of scores, your priority actions and the role course path. An account adds saved reports, progress history and AI-written cover letters.",
  },
  {
    question: "Do I have to create an account?",
    answer:
      "No. Analysis runs locally in your browser as a guest, and your file is never uploaded. An account is only needed to save a report, track progress or generate a cover letter.",
  },
  {
    question: "Will my resume be used to train AI models?",
    answer:
      "No — not without separate, explicit consent. Guest analysis never leaves your browser. Signed-in uploads are stored privately, scoped to your account, and you can delete them.",
  },
  {
    question: "Who is the platform for?",
    answer:
      "People targeting a specific technical role — students, career changers and working engineers. You name the target role yourself, so the analysis adapts rather than assuming a single career track.",
  },
  {
    question: "Can I practise more than one skill or role?",
    answer:
      "Yes. Change the target role anywhere in the product and the gaps, course path and interview questions all re-derive. InterviewIQ covers several role tracks across technical, HR and coding questions.",
  },
  {
    question: "Can watching lessons mark a skill as mastered?",
    answer:
      "No. Course completion is not inferred from opening content; mastery additionally requires assessment or project evidence against a structured rubric.",
  },
  {
    question: "Is the score guaranteed to match every ATS?",
    answer:
      "No. It is an estimate produced by a transparent, versioned rubric, and the rubric version is shown alongside every report. No tool can replicate every applicant tracking system.",
  },
];

export function FaqSection() {
  return (
    <Section id={landingSections.faq} tone="muted" containerClassName="max-w-3xl">
      <SectionHeading
        eyebrow="Straight answers"
        title="Frequently asked questions"
        body="No inflated claims, invented scarcity or hidden scoring logic."
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
  );
}
