import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/scheduling")({
  head: () => pageMeta("Scheduling · Empirial POS", "Cleaning and property job scheduling."),
  component: () => <ModulePage moduleKey="scheduling" />,
});
