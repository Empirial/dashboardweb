import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return <Outlet />;
}