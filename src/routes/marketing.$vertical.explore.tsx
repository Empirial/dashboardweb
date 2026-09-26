import { createFileRoute, notFound } from "@tanstack/react-router";
import { BusinessSite } from "@/components/BusinessSite";
import { verticals, verticalByKey } from "@/lib/marketing-data";

export const Route = createFileRoute("/marketing/$vertical/explore")({
  beforeLoad: ({ params }) => { if (!verticals.some((site) => site.key === params.vertical)) throw notFound(); },
  head: ({ params }) => {
    const config = verticalByKey(params.vertical);
    return { meta: [
      { title: `${config.exploreLabel} · ${config.brand}` },
      { name: "description", content: `Explore the latest from ${config.brand}. ${config.promise}` },
      { property: "og:title", content: `${config.exploreLabel} · ${config.brand}` },
      { property: "og:description", content: config.promise },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: ExplorePage,
});

function ExplorePage() { return <BusinessSite config={verticalByKey(Route.useParams().vertical)} page="explore" />; }