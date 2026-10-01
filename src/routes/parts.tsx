import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/parts")({
  head: () => pageMeta("Parts · Empirial POS", "Workshop parts stock and suppliers."),
  component: () => <ModulePage moduleKey="parts" />,
});
