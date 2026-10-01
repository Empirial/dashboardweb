import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/quotes")({
  head: () => pageMeta("Quotes · Empirial POS", "Automotive estimates and job conversion."),
  component: () => <ModulePage moduleKey="quotes" />,
});
