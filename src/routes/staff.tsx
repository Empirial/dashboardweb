import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/staff")({
  head: () => pageMeta("Staff · Empirial POS", "Staff specialties and daily availability."),
  component: () => <ModulePage moduleKey="staff" />,
});
