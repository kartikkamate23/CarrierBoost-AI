import { analyzeCareerReadiness } from "@/lib/career-engine";

/**
 * A real analysis of a short, anonymised sample resume, used to populate the
 * landing-page product preview.
 *
 * `analyzeCareerReadiness` is a pure deterministic function, so computing this
 * once at module scope produces identical output on the server and the client —
 * no hydration mismatch. `src/routes/sample-report.tsx` already uses this exact
 * pattern.
 *
 * Nothing here calls an API, touches the database or invents a figure: every
 * number the landing page shows is produced by the live rubric.
 */

const SAMPLE_RESUME = `Summary Data analyst transitioning to data engineering.
Skills Python SQL PostgreSQL Docker AWS.
Experience Built ETL workflows for reporting and improved refresh time by 35%.
Projects Designed a warehouse model for 500K sales records.
Education Bachelor of Engineering.`;

const SAMPLE_ROLE = "Data Engineer";

export const sampleAnalysis = analyzeCareerReadiness(SAMPLE_RESUME, SAMPLE_ROLE);
