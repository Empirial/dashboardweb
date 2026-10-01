import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/appointments")({
  head: () =>
    pageMeta("Appointments · Empirial POS", "Beauty appointment calendar and availability."),
  component: () => <ModulePage moduleKey="appointments" />,
});
