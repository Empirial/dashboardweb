import { createFileRoute, notFound } from "@tanstack/react-router";
import { BusinessSite } from "@/components/BusinessSite";
import { verticals, verticalByKey } from "@/lib/marketing-data";

export const Route = createFileRoute("/marketing/$vertical")({
  beforeLoad: ({ params }) => {
    if (!verticals.some((site) => site.key === params.vertical)) throw notFound();
  },
  head: ({ params }) => {
    const config = verticalByKey(params.vertical);
    return { meta: [
      { title: `${config.brand} · ${config.category}` },
      { name: "description", content: config.sub },
      { property: "og:title", content: `${config.brand} · ${config.headline}` },
      { property: "og:description", content: config.sub },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: VerticalHome,
});

function VerticalHome() {
  return <BusinessSite config={verticalByKey(Route.useParams().vertical)} />;
}