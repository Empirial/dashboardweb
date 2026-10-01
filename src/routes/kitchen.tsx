import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/kitchen")({
  head: () => pageMeta("Kitchen · Empirial POS", "Restaurant kitchen tickets and prep progress."),
  component: () => <ModulePage moduleKey="kitchen" />,
});
