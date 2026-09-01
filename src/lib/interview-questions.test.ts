import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestion,
  getTechnologiesForRole,
  interviewTrackRequiresTechnology,
} from "./interview-questions.ts";

test("role technology choices are relevant", () => {
  assert.ok(getTechnologiesForRole("Data Engineer").includes("Apache Spark"));
  assert.ok(getTechnologiesForRole("Frontend Engineer").includes("React"));
});

test("HR questions do not require a technology selection", () => {
  assert.equal(interviewTrackRequiresTechnology("HR"), false);
  assert.equal(interviewTrackRequiresTechnology("Technical"), true);
  assert.equal(interviewTrackRequiresTechnology("Coding"), true);

  const first = generateInterviewQuestion({
    role: "Data Engineer",
    technologies: [],
    track: "HR",
    difficulty: "Easy",
    sequence: 1,
  });
  const next = generateInterviewQuestion({
    role: "Data Engineer",
    technologies: [],
    track: "HR",
    difficulty: "Easy",
    sequence: 2,
  });
  assert.equal(first.track, "HR");
  assert.notEqual(first.prompt, next.prompt);
});

test("question generation rotates through selected technologies without a session limit", () => {
  const question = generateInterviewQuestion({
    role: "Backend Developer",
    technologies: ["Java", "REST APIs"],
    track: "Coding",
    difficulty: "Hard",
    sequence: 1001,
  });
  assert.equal(question.technology, "Java");
  assert.match(question.prompt, /Java/);
});

test("technical and coding tracks produce distinct, varied interviewer questions", () => {
  const technical = Array.from(
    { length: 24 },
    (_, index) =>
      generateInterviewQuestion({
        role: "Data Engineer",
        technologies: ["SQL"],
        track: "Technical",
        difficulty: "Medium",
        sequence: index + 1,
      }).prompt,
  );
  const coding = Array.from(
    { length: 24 },
    (_, index) =>
      generateInterviewQuestion({
        role: "Data Engineer",
        technologies: ["SQL"],
        track: "Coding",
        difficulty: "Medium",
        sequence: index + 1,
      }).prompt,
  );

  assert.equal(new Set(technical).size, technical.length);
  assert.equal(new Set(coding).size, coding.length);
  assert.equal(
    technical.some((prompt) => coding.includes(prompt)),
    false,
  );
  assert.ok(coding.every((prompt) => /implement|write|pair-program|build/i.test(prompt)));
});

test("answer evaluation reports matched and missing evidence", () => {
  const question = generateInterviewQuestion({
    role: "Data Engineer",
    technologies: ["SQL"],
    track: "Technical",
    difficulty: "Easy",
    sequence: 1,
  });
  const result = evaluateInterviewAnswer(
    question,
    "I will explain the concept with an example, its benefit, and one limitation in production.",
  );
  assert.equal(result.missedSignals.length, 0);
  assert.ok(result.score > 60);
  assert.match(result.followUpPrompt, /deeper|scale|failure/i);
});
