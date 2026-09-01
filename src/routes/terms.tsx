import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LegalPage, LegalSection } from "@/components/patterns/legal-page";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({ meta: [{ title: "Terms | CareerBoost AI" }] }),
});

/**
 * Presentation only. Every clause below is reproduced verbatim from the
 * previous version of this page — no obligation has been added, removed or
 * reworded.
 */
function Terms() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LegalPage
        updated="Last updated: 24 August 2026"
        title="Terms of use"
        sections={[
          { id: "educational-guidance", title: "Educational guidance" },
          { id: "your-content", title: "Your content" },
          { id: "acceptable-use", title: "Acceptable use" },
          { id: "subscriptions", title: "Subscriptions" },
          { id: "contact", title: "Contact" },
        ]}
      >
        <LegalSection id="educational-guidance" title="Educational guidance">
          CareerBoost AI provides educational and career-planning guidance. Scores, job matches, and
          recommendations are estimates and do not guarantee interviews, employment, admission, or
          compatibility with every ATS.
        </LegalSection>

        <LegalSection id="your-content" title="Your content">
          You retain ownership of your resume, projects, and submissions. You confirm that you have
          the right to upload them and must not submit malware, secrets, or unlawful content.
        </LegalSection>

        <LegalSection id="acceptable-use" title="Acceptable use">
          Do not attempt to bypass access controls, misuse AI features, submit another person’s
          personal data without authorization, or represent unverified generated claims as fact.
        </LegalSection>

        <LegalSection id="subscriptions" title="Subscriptions">
          Payments are not currently active. Paid plans will not launch until pricing, cancellation,
          taxation, invoicing, and refund terms are published and implemented.
        </LegalSection>

        <LegalSection id="contact" title="Contact">
          Questions about these terms can be sent to support@careerboost.ai.
        </LegalSection>
      </LegalPage>
      <Footer />
    </div>
  );
}
