import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/floor-plan")({
  head: () => pageMeta("Floor Plan · Empirial POS", "Live restaurant table operations."),
  component: () => <ModulePage moduleKey="floor-plan" />,
});
