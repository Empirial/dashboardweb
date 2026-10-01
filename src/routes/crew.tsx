import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/crew")({
  head: () => pageMeta("Crew · Empirial POS", "Cleaning crew availability and assignments."),
  component: () => <ModulePage moduleKey="crew" />,
});
