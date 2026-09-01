import { createFileRoute } from "@tanstack/react-router";
import { Programs } from "./programs";

/** Canonical course catalog entry point; /programs remains as a compatibility alias. */
export const Route = createFileRoute("/courses")({
  component: Programs,
  head: () => ({ meta: [{ title: "BrihatLabs Courses | CareerBoost AI" }] }),
});
