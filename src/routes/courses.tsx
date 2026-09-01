import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Shared route shell for the catalog and course-detail child routes. */
export const Route = createFileRoute("/courses")({
  component: CoursesLayout,
});

function CoursesLayout() {
  return <Outlet />;
}
