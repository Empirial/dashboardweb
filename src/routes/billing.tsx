import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/billing")({
  head: () => pageMeta("Billing · Empirial POS", "Recurring property-service billing."),
  component: () => <ModulePage moduleKey="billing" />,
});
