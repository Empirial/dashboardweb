// Services and products an owner publishes from the dashboard. They are stored per
// marketing site and appended to that site's built-in offerings, so the public pages and
// the enquiry form pick them up without a forked site.
import { useMemo } from "react";
import { rand } from "./hotel-data";
import { verticals, type Offering, type VerticalConfig, type VerticalKey } from "./marketing-data";
import { createPersistedStore } from "./persisted-store";
import type { Niche } from "./product";

export type PublishedOffering = Offering & { id: string };

const store = createPersistedStore<Partial<Record<VerticalKey, PublishedOffering[]>>>(
  "site-offerings",
  {},
);

const uid = () => Math.random().toString(36).slice(2, 8);

/** Every marketing site managed from a given dashboard niche (cleaning runs two). */
export const sitesForNiche = (niche: Niche): VerticalConfig[] =>
  verticals.filter((site) => site.managementNiche === niche);

export function addSiteOffering(
  site: VerticalKey,
  input: { name: string; detail: string; price: number; tag: string },
) {
  const offering: PublishedOffering = {
    id: uid(),
    name: input.name,
    detail: input.detail,
    price: input.price > 0 ? rand(input.price) : "Ask for a quote",
    tag: input.tag,
  };
  store.set((current) => ({ ...current, [site]: [...(current[site] ?? []), offering] }));
}

export const removeSiteOffering = (site: VerticalKey, id: string) =>
  store.set((current) => ({
    ...current,
    [site]: (current[site] ?? []).filter((offering) => offering.id !== id),
  }));

/** Built-in offerings plus anything the owner has published. */
export const getOfferings = (config: VerticalConfig): Offering[] => [
  ...config.offerings,
  ...(store.get()[config.key] ?? []),
];

export function useOfferings(config: VerticalConfig) {
  const published = store.use()[config.key];
  return useMemo(
    () => ({
      builtIn: config.offerings,
      published: published ?? [],
      all: [...config.offerings, ...(published ?? [])],
    }),
    [config, published],
  );
}
