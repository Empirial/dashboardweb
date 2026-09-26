import { createFileRoute, notFound } from "@tanstack/react-router";
import { BusinessSite } from "@/components/BusinessSite";
import { verticals, verticalByKey } from "@/lib/marketing-data";

export const Route = createFileRoute("/marketing/$vertical/about")({
  beforeLoad: ({ params }) => { if (!verticals.some((site) => site.key === params.vertical)) throw notFound(); },
  head: ({ params }) => {
    const config = verticalByKey(params.vertical);
    return { meta: [
      { title: `About · ${config.brand}` },
      { name: "description", content: config.about },
      { property: "og:title", content: `About ${config.brand}` },
      { property: "og:description", content: config.about },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: AboutPage,
});

function AboutPage() { return <BusinessSite config={verticalByKey(Route.useParams().vertical)} page="about" />; }