import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/jobs")({
  head: () => pageMeta("Job Cards · Empirial POS", "Automotive workshop job cards."),
  component: () => <ModulePage moduleKey="jobs" />,
});
