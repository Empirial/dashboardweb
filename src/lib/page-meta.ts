/** Shared `head()` metadata so every route gets a title, description and social tags. */
export const pageMeta = (
  title: string,
  description: string,
  card: "summary" | "summary_large_image" = "summary",
) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: card },
  ],
});
