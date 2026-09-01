import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { PrivacySection } from "@/components/marketing/privacy-section";
import { ProblemSection } from "@/components/marketing/problem-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { PreviewSection } from "@/components/marketing/preview-section";
import { CoursesSection } from "@/components/marketing/courses-section";
import { MentorSection } from "@/components/marketing/mentor-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

const description =
  "Score your resume against a target role on a transparent, versioned rubric, then close every gap with verified Hitavir Tech courses, portfolio projects and interview practice. Free to start, no account required.";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "CareerBoost AI | From Resume Gaps to Job-Ready Skills" },
      { name: "description", content: description },
      { property: "og:title", content: "CareerBoost AI | From Resume Gaps to Job-Ready Skills" },
      { property: "og:description", content: description },
      { name: "twitter:description", content: description },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TrustSection />
        <PrivacySection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PreviewSection />
        <CoursesSection />
        <MentorSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
