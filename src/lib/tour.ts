// Guided tour: one engine, with a step list built from each business's marketing config.
// A step highlights a real element (data-tour="…"), and finishes when something actually
// happens (a page opens, a request is sent, a sale is rung up), not when a button is clicked.
import { offer, type VerticalConfig, type VerticalKey } from "./marketing-data";
import { createPersistedStore } from "./persisted-store";
import type { Niche } from "./product";

export type TourCounts = { feed: number; sales: number; cart: number };

type TourState = {
  active: boolean;
  key: VerticalKey | null;
  step: number;
  /** Counts taken when the step began; null until the overlay has measured them. */
  base: TourCounts | null;
  /** Bumped by "Fill in an example for me" so forms can pre-fill themselves. */
  seed: number;
};

const idle: TourState = { active: false, key: null, step: 0, base: null, seed: 0 };

const tourStore = createPersistedStore<TourState>("tour", idle);

export const useTour = tourStore.use;
export const startTour = (key: VerticalKey) =>
  tourStore.set({ active: true, key, step: 0, base: null, seed: 0 });
export const stopTour = () => tourStore.set(idle);
export const calibrateTour = (counts: TourCounts) =>
  tourStore.set((current) => (current.base ? current : { ...current, base: counts }));
export const advanceTour = (counts: TourCounts) =>
  tourStore.set((current) => ({ ...current, step: current.step + 1, base: counts }));
export const fillExample = () =>
  tourStore.set((current) => ({ ...current, seed: current.seed + 1 }));

export type TourContext = {
  path: string;
  has: (selector: string) => boolean;
  counts: TourCounts;
  base: TourCounts;
};

export type TourStep = {
  id: string;
  title: string;
  body: string;
  /** Selectors in order of preference; the first one that is visible is highlighted. */
  targets: string[];
  /** Where "Take me there" goes if the person wanders off. */
  goto?: string;
  /** Show a Next button instead of waiting for an action. */
  manual?: boolean;
  /** Show the "Fill in an example for me" button. */
  fill?: boolean;
  /** The closing card with the offer. */
  final?: boolean;
  done: (context: TourContext) => boolean;
};

const copy: Record<VerticalKey, { noun: string; lands: string }> = {
  hotel: {
    noun: "booking",
    lands:
      "It is in the activity feed, on the Rooms calendar and in Bookings, with a room already assigned.",
  },
  property: {
    noun: "viewing request",
    lands:
      "It is on the schedule, ready to be given to someone, and the enquirer is saved as a customer.",
  },
  retail: {
    noun: "order",
    lands: "The order counted as a sale and the stock level for that product dropped.",
  },
  salon: {
    noun: "appointment",
    lands: "It is on the appointment calendar and the client is saved in Customers.",
  },
  auto: {
    noun: "service booking",
    lands: "A job card was opened for the vehicle and the customer was saved.",
  },
  restaurant: {
    noun: "table reservation",
    lands: "The table is held on your floor plan for that guest.",
  },
  cleaning: {
    noun: "clean request",
    lands: "It is on the schedule, ready to be given to a crew.",
  },
};

const onSite = (path: string) => path.startsWith("/marketing");

export function buildSteps(config: VerticalConfig): TourStep[] {
  const home = `/marketing/${config.key}`;
  const { noun, lands } = copy[config.key];
  return [
    {
      id: "open",
      title: "Start as your customer",
      body: `This is ${config.brand}'s website. Press “${config.primaryCta}” to make a ${noun}, exactly as a customer would.`,
      targets: ['[data-tour="hero-cta"]', '[data-tour="nav-cta"]'],
      goto: home,
      done: (c) => c.has('[data-tour="form"]') || c.counts.feed > c.base.feed,
    },
    {
      id: "send",
      title: "Fill it in and send",
      body: "Tap “Fill in an example for me”, then press the send button at the bottom of the form.",
      targets: ['[data-tour="form"]', '[data-tour="hero-cta"]'],
      fill: true,
      goto: home,
      done: (c) => c.counts.feed > c.base.feed,
    },
    {
      id: "management",
      title: "Now be the business owner",
      body: `Your ${noun} was sent. Press “See it in Management” to open the owner's dashboard.`,
      targets: ['[data-tour="see-management"]', '[data-tour="nav-management"]'],
      goto: home,
      done: (c) => !onSite(c.path),
    },
    {
      id: "see",
      title: `Your ${noun} is already here`,
      body: lands,
      targets: ['[data-tour="activity"]', '[data-tour="records"]'],
      manual: true,
      goto: config.managementPath,
      done: () => false,
    },
    {
      id: "register",
      title: "Take a payment",
      body: "Open the Register. This is where you ring up customers in person.",
      targets: ['[data-tour="nav-register"]'],
      goto: config.managementPath,
      done: (c) => c.path === "/pos",
    },
    {
      id: "sale",
      title: "Ring up a sale",
      body: "Tap any item to add it to the check.",
      targets: ['[data-tour="catalog-item"]'],
      goto: "/pos",
      done: (c) => c.counts.cart > c.base.cart || c.counts.sales > c.base.sales,
    },
    {
      id: "pay",
      title: "Take the payment",
      body: "Choose Card, then confirm the payment.",
      targets: ['[data-tour="settle"]', '[data-tour="pay-card"]'],
      goto: "/pos",
      done: (c) => c.counts.sales > c.base.sales,
    },
    {
      id: "overview",
      title: "See what it did",
      body: "Head back to the Overview.",
      targets: ['[data-tour="nav-overview"]'],
      goto: "/pos",
      done: (c) => c.path === "/overview",
    },
    {
      id: "chart",
      title: "The sale is already in your numbers",
      body: "Today's bar and the revenue total include the sale you just rang up.",
      targets: ['[data-tour="revenue-chart"]'],
      manual: true,
      goto: "/overview",
      done: () => false,
    },
    {
      id: "finish",
      title: "That is a complete business system",
      body: `A website your customers use and a back office that updates itself. It can be yours for ${offer.price} (normally ${offer.wasPrice}), and only ${offer.spotsLeft} of the first ${offer.totalSpots} spots are left.`,
      targets: [],
      final: true,
      done: () => false,
    },
  ];
}

/** Sensible starting website for each dashboard industry. */
export const nicheVertical: Record<Niche, VerticalKey> = {
  hospitality: "hotel",
  food: "restaurant",
  retail: "retail",
  beauty: "salon",
  automotive: "auto",
  cleaning: "cleaning",
};

const commonExamples: Record<string, string> = {
  "Your name": "Thando Mokoena",
  Phone: "082 555 0123",
  Email: "thando@example.com",
  Guests: "2",
  "Delivery city": "Johannesburg",
};

const keyedExamples: Partial<Record<VerticalKey, Record<string, string>>> = {
  property: { Property: "Parkview Courtyard Home" },
  salon: { Service: "Knotless Braids" },
  auto: { Vehicle: "2021 VW Polo", "Service needed": "Brake inspection" },
  cleaning: { Service: "Deep Clean" },
};

/** The example value for a website form field, or undefined if there is none. */
export const exampleFor = (key: VerticalKey, label: string): string | undefined =>
  commonExamples[label] ?? keyedExamples[key]?.[label];

/** How many days from today the example dates fall. */
export const exampleDateOffsets = (key: VerticalKey): Record<string, number> =>
  key === "hotel" ? { "Check in": 2, "Check out": 4 } : { "Preferred date": 3 };
