// Services and products an owner publishes from the dashboard. They are stored per
// marketing site and appended to that site's built-in offerings, so the public pages and
// the enquiry form pick them up without a forked site. The owner can also edit or hide the
// built-in offerings; those changes are kept separately so the originals are never lost.
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

/** Owner changes to a site's built-in offerings, keyed by the built-in's original name. */
type BuiltInEdits = { hidden: string[]; edited: Record<string, Offering> };
const editStore = createPersistedStore<Partial<Record<VerticalKey, BuiltInEdits>>>(
  "site-offering-edits",
  {},
);
const noEdits: BuiltInEdits = { hidden: [], edited: {} };
const editsFor = (all: Partial<Record<VerticalKey, BuiltInEdits>>, key: VerticalKey) =>
  all[key] ?? noEdits;

export type BuiltInEntry = { id: string; offering: Offering; hidden: boolean; edited: boolean };

/** A plain number becomes a rand price; anything else ("From R1 840 / night") is kept as typed. */
export const formatPrice = (input: string) => {
  const value = input.trim();
  if (!value) return "Ask for a quote";
  return /^\d[\d\s]*$/.test(value) ? rand(Number(value.replace(/\s/g, ""))) : value;
};

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

export const updateSiteOffering = (
  site: VerticalKey,
  id: string,
  input: { name: string; detail: string; price: string; tag: string },
) =>
  store.set((current) => ({
    ...current,
    [site]: (current[site] ?? []).map((offering) =>
      offering.id === id ? { ...offering, ...input, price: formatPrice(input.price) } : offering,
    ),
  }));

const setEdits = (site: VerticalKey, change: (edits: BuiltInEdits) => BuiltInEdits) =>
  editStore.set((current) => ({ ...current, [site]: change(editsFor(current, site)) }));

/** Edit one of the site's built-in offerings, identified by its original name. */
export const editBuiltInOffering = (
  site: VerticalKey,
  originalName: string,
  input: { name: string; detail: string; price: string; tag: string },
) =>
  setEdits(site, (edits) => ({
    ...edits,
    edited: { ...edits.edited, [originalName]: { ...input, price: formatPrice(input.price) } },
  }));

export const resetBuiltInOffering = (site: VerticalKey, originalName: string) =>
  setEdits(site, (edits) => {
    const { [originalName]: _removed, ...edited } = edits.edited;
    return { ...edits, edited };
  });

export const setBuiltInHidden = (site: VerticalKey, originalName: string, hidden: boolean) =>
  setEdits(site, (edits) => ({
    ...edits,
    hidden: hidden
      ? [...new Set([...edits.hidden, originalName])]
      : edits.hidden.filter((name) => name !== originalName),
  }));

const builtInEntries = (config: VerticalConfig, edits: BuiltInEdits): BuiltInEntry[] =>
  config.offerings.map((original) => ({
    id: original.name,
    offering: edits.edited[original.name] ?? original,
    hidden: edits.hidden.includes(original.name),
    edited: original.name in edits.edited,
  }));

const visibleOfferings = (entries: BuiltInEntry[], published: PublishedOffering[]) => [
  ...entries.filter((entry) => !entry.hidden).map((entry) => entry.offering),
  ...published,
];

/** Visible built-in offerings (with the owner's edits) plus anything the owner has published. */
export const getOfferings = (config: VerticalConfig): Offering[] =>
  visibleOfferings(
    builtInEntries(config, editsFor(editStore.get(), config.key)),
    store.get()[config.key] ?? [],
  );

export function useOfferings(config: VerticalConfig) {
  const published = store.use()[config.key];
  const edits = editStore.use()[config.key];
  return useMemo(() => {
    const builtIn = builtInEntries(config, edits ?? noEdits);
    return {
      builtIn,
      published: published ?? [],
      all: visibleOfferings(builtIn, published ?? []),
    };
  }, [config, published, edits]);
}
