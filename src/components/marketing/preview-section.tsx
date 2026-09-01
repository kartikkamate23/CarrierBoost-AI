import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section, SectionHeading } from "@/components/marketing/section";
import { AppWindow, EvidencePanel, GapPanel, ScorePanel } from "@/components/marketing/app-preview";
import { sampleAnalysis } from "@/components/marketing/sample-analysis";
import { revealOnce, slideUp } from "@/lib/motion";
import { landingSections } from "@/lib/site";

/**
 * The interactive product preview.
 *
 * Everything inside the window is produced by the real rubric — see
 * app-preview.tsx. The tabs simply switch which part of that one analysis is
 * displayed.
 */
export function PreviewSection() {
  const analysis = sampleAnalysis;

  return (
    <Section id={landingSections.preview}>
      <SectionHeading
        eyebrow="Inside the product"
        title="This is a real analysis, not a screenshot."
        body={`Every figure below is produced live by rubric ${analysis.rubricVersion}, running the same function the analyzer uses, against an anonymised sample resume for a ${analysis.role} target.`}
      />

      <motion.div {...revealOnce} variants={slideUp} className="mx-auto mt-14 max-w-4xl">
        <AppWindow label={`ResumeIQ · ${analysis.role} · Sample`}>
          <Tabs defaultValue="scores">
            <div className="scrollbar-slim overflow-x-auto border-b px-5 pt-4">
              <TabsList className="h-auto min-w-max justify-start bg-transparent p-0">
                <TabsTrigger value="scores" className="min-h-11">
                  Scores
                </TabsTrigger>
                <TabsTrigger value="actions" className="min-h-11">
                  Priority actions
                </TabsTrigger>
                <TabsTrigger value="evidence" className="min-h-11">
                  Skill evidence
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="scores" className="m-0">
              <ScorePanel />
            </TabsContent>
            <TabsContent value="actions" className="m-0">
              <GapPanel />
            </TabsContent>
            <TabsContent value="evidence" className="m-0">
              <EvidencePanel />
            </TabsContent>
          </Tabs>
        </AppWindow>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-small text-muted-foreground">
            Scores are rubric-based estimates. They do not guarantee results in any particular ATS
            or hiring process.
          </p>
          <Button asChild size="lg" className="btn-glow h-12 px-6">
            <Link to="/analyze">
              Run this on my resume
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
