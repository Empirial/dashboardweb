import { createFileRoute, redirect } from "@tanstack/react-router";

// The public marketing site is the home page; the dashboard Overview lives at /overview.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/marketing", replace: true });
  },
});
