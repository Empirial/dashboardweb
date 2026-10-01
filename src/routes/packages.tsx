import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/packages")({
  head: () => pageMeta("Packages · Empirial POS", "Beauty service bundles and sales."),
  component: () => <ModulePage moduleKey="packages" />,
});
