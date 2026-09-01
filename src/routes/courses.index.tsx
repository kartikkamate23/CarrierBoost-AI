import { createFileRoute } from "@tanstack/react-router";
import { Programs } from "./programs";

/** Canonical BrihatLabs course catalog at /courses. */
export const Route = createFileRoute("/courses/")({
  component: Programs,
  head: () => ({ meta: [{ title: "BrihatLabs Courses | CareerBoost AI" }] }),
});
