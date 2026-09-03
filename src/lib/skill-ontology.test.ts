import assert from "node:assert/strict";
import test from "node:test";
import { containsForm, evidencesSkill, matchSkill, surfaceFormsFor } from "./skill-ontology.ts";
import { analyzeCareerReadiness } from "./career-engine.ts";

test("abbreviations and vendor names evidence their competency", () => {
  assert.equal(matchSkill("Orchestrated K8s workloads", "kubernetes")?.kind, "alias");
  assert.equal(matchSkill("Tuned PostgreSQL indexes", "sql")?.form, "postgresql");
  assert.equal(matchSkill("Built with PySpark", "spark")?.form, "pyspark");
  assert.ok(evidencesSkill("Deployed to Amazon Web Services", "aws"));
  assert.ok(evidencesSkill("Used Pinecone for retrieval", "vector database"));
});

test("plural and singular forms both count", () => {
  assert.ok(evidencesSkill("Shipped three dashboards", "dashboard"));
  assert.ok(evidencesSkill("Owned a microservice", "microservices"));
  assert.ok(evidencesSkill("Built data pipelines", "data pipeline"));
  assert.ok(evidencesSkill("Designed an autonomous agent", "agents"));
});

test("exact matches are reported as exact, not alias", () => {
  const hit = matchSkill("Wrote SQL queries", "sql");
  assert.equal(hit?.kind, "exact");
  assert.equal(hit?.form, "sql");
});

test("word boundaries prevent false positives", () => {
  // The substring is present but the competency is not.
  assert.equal(matchSkill("Used NoSQL stores exclusively", "sql"), null);
  assert.equal(matchSkill("Strong JavaScript background", "java"), null);
  assert.equal(containsForm("nosql", "sql"), false);
});

test("ambiguous abbreviations are deliberately excluded", () => {
  // "TS" reads as Top Secret clearance at least as often as TypeScript, so it
  // must not be treated as evidence.
  assert.equal(matchSkill("Held TS clearance", "typescript"), null);
});

test("surface forms are ordered longest first so evidence quotes the best span", () => {
  const forms = surfaceFormsFor("sql");
  const lengths = forms.map((form) => form.length);
  assert.deepEqual(
    lengths,
    [...lengths].sort((a, b) => b - a),
  );
  assert.ok(forms.includes("sql"));
});

test("ontology matching raises scores for equivalent resume wording", () => {
  const literal = `Summary Data engineer. Experience Built an ETL data pipeline with Spark
that reduced processing time by 42% for 2M records using SQL and Docker on AWS.`;
  const equivalent = `Summary Data engineer. Experience Built ETL data pipelines with PySpark
that reduced processing time by 42% for 2M records using PostgreSQL and containers on Amazon Web Services.`;

  const literalScore = analyzeCareerReadiness(literal, "Data Engineer");
  const equivalentScore = analyzeCareerReadiness(equivalent, "Data Engineer");

  const coverage = (result: typeof literalScore) =>
    result.scores.find((score) => score.key === "keywords")?.score ?? 0;

  // Wording that means the same thing should not be punished.
  assert.equal(coverage(equivalentScore), coverage(literalScore));
  assert.ok(equivalentScore.matchedKeywords.includes("spark"));
  assert.ok(equivalentScore.matchedKeywords.includes("sql"));
  assert.ok(equivalentScore.matchedKeywords.includes("aws"));
});

test("ontology matching stays deterministic", () => {
  const resume = "Experience Built data pipelines with PySpark that processed 2M records.";
  assert.deepEqual(
    analyzeCareerReadiness(resume, "Data Engineer"),
    analyzeCareerReadiness(resume, "Data Engineer"),
  );
});
