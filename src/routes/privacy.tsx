import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LegalPage, LegalSection } from "@/components/patterns/legal-page";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({ meta: [{ title: "Privacy | CareerBoost AI" }] }),
});

/**
 * Presentation only. Every sentence below is reproduced verbatim from the
 * previous version of this page — no guarantee has been added, removed,
 * strengthened or weakened.
 */
function Privacy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LegalPage
        updated="Last updated: 24 August 2026"
        title="Privacy notice"
        intro="CareerBoost AI processes resume information to provide analysis, learning plans, project feedback, and interview preparation requested by you."
        sections={[
          { id: "guest-analysis", title: "Guest analysis" },
          { id: "account-data", title: "Account data and retention" },
          { id: "ai-training", title: "AI and model training" },
          { id: "security", title: "Security and rights" },
        ]}
      >
        <LegalSection id="guest-analysis" title="Guest analysis">
          Guest analysis runs in your browser. The selected file and extracted resume text are not
          uploaded by the guest analyzer. Session data is removed when the browser session ends or
          when you clear it.
        </LegalSection>

        <LegalSection id="account-data" title="Account data and retention">
          Signed-in resume files are stored privately to support saved reports. You can permanently
          delete your resume. Production retention jobs should remove expired files according to the
          configured retention policy; the default target is 30 days unless you choose to retain a
          saved version.
        </LegalSection>

        <LegalSection id="ai-training" title="AI and model training">
          Resume content is sent to an AI provider only when you request an AI-powered feature.
          CareerBoost AI does not use resume content for model training without separate, explicit
          consent. Resume text is treated as untrusted data, never as instructions.
        </LegalSection>

        <LegalSection id="security" title="Security and rights">
          We use access controls, private storage, transport encryption, and row-level
          authorization. You may request access, correction, export, or deletion by contacting
          support@careerboost.ai.
        </LegalSection>
      </LegalPage>
      <Footer />
    </div>
  );
}
