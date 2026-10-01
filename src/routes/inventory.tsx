import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/inventory")({
  head: () => pageMeta("Inventory · Empirial POS", "Retail inventory and restock management."),
  component: () => <ModulePage moduleKey="inventory" />,
});
