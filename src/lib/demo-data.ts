// Live demo data shared by the dashboard and the public marketing sites.
// A website enquiry, a register sale or a module action all write here, and the
// Overview, Reports, Customers and module pages read it back, so the demo behaves like
// one connected system. Everything is saved to localStorage and can be reset in Settings.
import { useMemo } from "react";
import { rand, type Room } from "./hotel-data";
import type { VerticalConfig } from "./marketing-data";
import { createPersistedStore } from "./persisted-store";
import {
  moduleRecords,
  type ModuleKey,
  type ModuleRecord,
  type NicheConfig,
} from "./platform-data";
import type { Niche } from "./product";
import { addReservation, freeRooms, getReservations, parseDay, shortDay } from "./reservations";

export type Sale = {
  id: string;
  niche: Niche;
  total: number;
  method: string;
  items: number;
  time: string;
};
export type FeedItem = { id: string; niche: Niche; title: string; detail: string; time: string };
export type LiveCustomer = NicheConfig["customers"][number] & { niche: Niche };

type Live = {
  sales: Sale[];
  feed: FeedItem[];
  records: Partial<Record<ModuleKey, ModuleRecord[]>>;
  customers: LiveCustomer[];
};

const live = createPersistedStore<Live>("live", {
  sales: [],
  feed: [],
  records: {},
  customers: [],
});

export const useLive = live.use;

/** Seven-day baseline so a fresh demo already looks busy; live sales are added on top. */
const baselines: Record<Niche, { revenue: number; transactions: number }> = {
  hospitality: { revenue: 284620, transactions: 486 },
  food: { revenue: 168420, transactions: 347 },
  retail: { revenue: 338900, transactions: 611 },
  beauty: { revenue: 121600, transactions: 188 },
  automotive: { revenue: 486200, transactions: 112 },
  cleaning: { revenue: 214800, transactions: 142 },
};

export function useRevenue(niche: Niche) {
  const { sales } = live.use();
  return useMemo(() => {
    const mine = sales.filter((sale) => sale.niche === niche);
    const liveTotal = mine.reduce((sum, sale) => sum + sale.total, 0);
    const base = baselines[niche];
    const revenue = base.revenue + liveTotal;
    const transactions = base.transactions + mine.length;
    return {
      revenue,
      transactions,
      average: Math.round(revenue / transactions),
      bestDay: Math.round(revenue * 0.172),
      liveTotal,
      liveCount: mine.length,
    };
  }, [sales, niche]);
}

const stamp = () => new Date().toTimeString().slice(0, 5);
const uid = () => Math.random().toString(36).slice(2, 8);
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

/** "From R1 200" -> 1200 */
export const priceOf = (text: string) =>
  Number((/R\s?([\d\s]+)/.exec(text)?.[1] ?? "0").replace(/\s/g, ""));

export const addFeed = (niche: Niche, title: string, detail: string) =>
  live.set((current) => ({
    ...current,
    feed: [{ id: uid(), niche, title, detail, time: stamp() }, ...current.feed].slice(0, 30),
  }));

export const recordSale = (
  niche: Niche,
  total: number,
  method: string,
  items: number,
  title = "Sale completed",
) =>
  live.set((current) => ({
    ...current,
    sales: [...current.sales, { id: uid(), niche, total, method, items, time: stamp() }],
    feed: [
      {
        id: uid(),
        niche,
        title,
        detail: `${items} item${items === 1 ? "" : "s"} · ${rand(total)} · ${method.toLowerCase()}`,
        time: stamp(),
      },
      ...current.feed,
    ].slice(0, 30),
  }));

const currentRecords = (key: ModuleKey) => live.get().records[key] ?? moduleRecords[key] ?? [];

export const setModuleRecords = (key: ModuleKey, records: ModuleRecord[]) =>
  live.set((current) => ({ ...current, records: { ...current.records, [key]: records } }));

export const addModuleRecord = (key: ModuleKey, record: ModuleRecord) =>
  setModuleRecords(key, [record, ...currentRecords(key)]);

export const addCustomer = (customer: LiveCustomer) =>
  live.set((current) =>
    current.customers.some((c) => c.niche === customer.niche && c.name === customer.name)
      ? current
      : { ...current, customers: [customer, ...current.customers] },
  );

type EnquiryResult = { ok: boolean; message: string };

/**
 * Turns a public website request into dashboard data. Each vertical lands in the module
 * its own management side uses, so the owner sees the request after clicking Management.
 */
export function submitEnquiry(
  config: VerticalConfig,
  selected: string,
  values: Record<string, string>,
): EnquiryResult {
  const niche = config.managementNiche;
  const name = values["Your name"]?.trim() || "Website guest";
  const phone = values["Phone"] || values["Email"] || "";
  const date = values["Preferred date"] ?? "";
  const when = date ? shortDay(date) : "Unscheduled";
  const price = priceOf(
    config.offerings.find((offering) => offering.name === selected)?.price ?? "",
  );
  const customer = (detail: string, meta: string, value: string) =>
    addCustomer({ niche, name, initials: initialsOf(name), detail, meta, value });

  const add = (key: ModuleKey, record: ModuleRecord) =>
    addModuleRecord(key, date ? { ...record, date } : record);

  switch (config.key) {
    case "hotel": {
      const start = values["Check in"] ?? "";
      const end = values["Check out"] ?? "";
      const nights =
        start && end
          ? Math.round((parseDay(end).getTime() - parseDay(start).getTime()) / 86_400_000)
          : 0;
      if (nights < 1)
        return { ok: false, message: "Choose a check-out date after your check-in date." };
      const preferred: Room["type"] = /suite|villa/i.test(selected) ? "Suite" : "Deluxe";
      const list = getReservations();
      const room =
        freeRooms(list, start, nights, preferred)[0] ?? freeRooms(list, start, nights)[0];
      if (!room)
        return {
          ok: false,
          message: "We are fully booked for those dates. Please try other dates.",
        };
      const created = addReservation({
        room: room.number,
        roomType: room.type,
        guest: name,
        start,
        nights,
        rate: room.rate,
        source: "Direct",
        payment: "Unpaid",
      });
      addFeed(
        niche,
        "New website booking",
        `${name} · Room ${room.number} · ${nights} night${nights === 1 ? "" : "s"}`,
      );
      customer(`Room ${room.number} · 1 stay`, "Website booking", rand(created.total));
      return {
        ok: true,
        message: `Room ${room.number} is held for ${nights} night${nights === 1 ? "" : "s"}. Reference ${created.id}.`,
      };
    }
    case "property":
      add("scheduling", {
        name: `${when} · ${name}`,
        detail: `${selected} · ${phone}`,
        status: "Scheduled",
        value: "Viewing",
      });
      addFeed(niche, "Viewing requested", `${name} · ${selected}`);
      customer(selected, "Viewing requested", "Prospect");
      return { ok: true, message: `Your viewing request for ${when} has been received.` };
    case "retail": {
      const qty = Math.max(1, Number(values["Quantity"]) || 1);
      recordSale(niche, price * qty, "Online order", qty, "Online order");
      setModuleRecords(
        "inventory",
        currentRecords("inventory").map((record) => {
          if (record.name !== selected) return record;
          const left = Math.max(0, Number(record.value) - qty);
          return { ...record, value: left, status: left <= 6 ? "Low stock" : record.status };
        }),
      );
      customer(
        `${qty} × ${selected}`,
        `Delivery · ${values["Delivery city"] ?? ""}`,
        rand(price * qty),
      );
      return {
        ok: true,
        message: `Order for ${qty} × ${selected} placed. Stock has been updated.`,
      };
    }
    case "salon":
      add("appointments", {
        name: `${when} · ${name}`,
        detail: `${values["Service"] || selected} · ${phone}`,
        status: "Confirmed",
        value: price ? rand(price) : "Quote",
      });
      addFeed(niche, "New online booking", `${name} · ${values["Service"] || selected} · ${when}`);
      customer(values["Service"] || selected, `Next: ${when}`, price ? rand(price) : "New");
      return {
        ok: true,
        message: `Your chair is reserved for ${when}. We'll confirm the exact time.`,
      };
    case "auto": {
      const vehicle = values["Vehicle"] || "Vehicle";
      add("jobs", {
        name: `EMP-J${100 + Math.floor(Math.random() * 900)} · ${vehicle}`,
        detail: `${name} · ${values["Service needed"] || selected} · ${phone}`,
        status: "Booked in",
        value: when,
      });
      addFeed(niche, "Workshop booking", `${vehicle} · ${values["Service needed"] || selected}`);
      customer(vehicle, `Booked: ${when}`, "New client");
      return { ok: true, message: `${vehicle} is booked in for ${when}.` };
    }
    case "restaurant": {
      const covers = values["Guests"] || "2";
      add("floor-plan", {
        name: `${when} · ${name}`,
        detail: `${covers} covers · ${phone}`,
        status: "Reserved",
        value: "Booked",
      });
      addFeed(niche, "Table reserved online", `${name} · ${covers} covers · ${when}`);
      customer(`${covers} covers`, `Booked: ${when}`, "New guest");
      return { ok: true, message: `A table for ${covers} is reserved on ${when}.` };
    }
    case "cleaning":
      add("scheduling", {
        name: `${when} · ${name}`,
        detail: `${values["Service"] || selected} · ${phone}`,
        status: "Scheduled",
        value: "One-off",
      });
      addFeed(niche, "Clean requested", `${name} · ${values["Service"] || selected} · ${when}`);
      customer(values["Service"] || selected, `Clean: ${when}`, price ? rand(price) : "New client");
      return { ok: true, message: `Your clean is requested for ${when}. We'll confirm shortly.` };
  }
}
