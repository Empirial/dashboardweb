import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/catalog")({
  head: () => pageMeta("Catalog · Empirial POS", "Retail products, variants, and barcodes."),
  component: () => <ModulePage moduleKey="catalog" />,
});
