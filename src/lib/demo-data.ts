// Live demo data shared by the dashboard and the public marketing sites.
// A website enquiry, a register sale or a module action all write here, and the
// Overview, Reports, Customers and module pages read it back, so the demo behaves like
// one connected system. Everything is saved to localStorage and can be reset in Settings.
import { useMemo } from "react";
import { rand, rooms, type Room } from "./hotel-data";
import type { VerticalConfig } from "./marketing-data";
import { createPersistedStore } from "./persisted-store";
import {
  moduleRecords,
  type ModuleKey,
  type ModuleRecord,
  type NicheConfig,
} from "./platform-data";
import type { Niche } from "./product";
import {
  TODAY,
  addDays,
  addReservation,
  freeRooms,
  getReservations,
  nightsOf,
  parseDay,
  shortDay,
  type Reservation,
} from "./reservations";

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
  /** Status changes made to bookings, keyed by booking reference. */
  bookingStatus?: Record<string, string>;
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
export const initialsOf = (name: string) =>
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
      const preferred: Room["type"] = /suite|villa/i.test(selected)
        ? "Suite"
        : /twin/i.test(selected)
          ? "Twin"
          : /single/i.test(selected)
            ? "Single"
            : "Deluxe";
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

// ---------------------------------------------------------------------------
// Automotive workshop helpers (job cards, quotes, parts, live KPIs)
// ---------------------------------------------------------------------------

export const numberIn = (text: string | number) => Number(String(text).replace(/[^0-9]/g, "")) || 0;

const nextNumber = (records: ModuleRecord[], pattern: RegExp, first: number) =>
  Math.max(first - 1, ...records.map((record) => Number(pattern.exec(record.name)?.[1] ?? 0))) + 1;

export const jobStatuses = [
  "Booked in",
  "In progress",
  "Awaiting parts",
  "Ready for collection",
  "Completed",
] as const;
export const quoteStatuses = ["Pending", "Approved", "Paid"] as const;

export function addJob(input: {
  customer: string;
  vehicle: string;
  phone: string;
  work: string;
  estimate: number;
}) {
  const id = `EMP-J${nextNumber(currentRecords("jobs"), /EMP-J(\d+)/, 100)}`;
  addModuleRecord("jobs", {
    name: `${id} · ${input.vehicle}`,
    detail: `${input.customer} · ${input.work}`,
    status: "Booked in",
    value: input.estimate ? rand(input.estimate) : "Quote",
    date: TODAY,
  });
  addCustomer({
    niche: "automotive",
    name: input.customer,
    initials: initialsOf(input.customer),
    detail: input.vehicle,
    meta: "Job in progress",
    value: "New",
    phone: input.phone,
    vehicle: input.vehicle,
    problem: input.work,
  });
  addFeed("automotive", "Job card opened", `${id} · ${input.vehicle}`);
  return id;
}

export function addQuote(input: {
  customer: string;
  vehicle: string;
  issue: string;
  amount: number;
}) {
  const id = `Q-${nextNumber(currentRecords("quotes"), /Q-(\d+)/, 1087)}`;
  addModuleRecord("quotes", {
    name: `${id} · ${input.customer}`,
    detail: input.vehicle ? `${input.vehicle} · ${input.issue}` : input.issue,
    status: "Pending",
    value: input.amount ? rand(input.amount) : "TBC",
  });
  addFeed("automotive", "Quote created", `${id} · ${input.customer}`);
  return id;
}

export function addPart(input: {
  kind: "stock" | "customer";
  name: string;
  qty: number;
  supplier: string;
  customer: string;
}) {
  const forCustomer = input.kind === "customer";
  addModuleRecord("parts", {
    name: input.name,
    detail: forCustomer
      ? `For ${input.customer}${input.supplier ? ` · ${input.supplier}` : ""}`
      : input.supplier || "Workshop stock",
    status: forCustomer ? "Customer part" : input.qty <= 5 ? "Low stock" : "In stock",
    value: input.qty,
  });
  addFeed(
    "automotive",
    forCustomer ? "Customer part logged" : "Stock part added",
    `${input.name} · ${input.qty}`,
  );
}

/** Workshop KPIs computed from the live job, quote and part records. */
export function automotiveKpis(records: Live["records"]): NicheConfig["kpis"] {
  const jobs = records.jobs ?? moduleRecords.jobs ?? [];
  const quotes = records.quotes ?? moduleRecords.quotes ?? [];
  const parts = records.parts ?? moduleRecords.parts ?? [];
  const open = jobs.filter((job) => !/complete|collected/i.test(job.status));
  const pending = quotes.filter((quote) => /pending|draft/i.test(quote.status));
  const pendingValue = pending.reduce((sum, quote) => sum + numberIn(quote.value), 0);
  return [
    {
      label: "Open jobs",
      value: String(open.length),
      sub: `${open.filter((job) => /progress/i.test(job.status)).length} in progress`,
    },
    {
      label: "Ready for collection",
      value: String(jobs.filter((job) => /ready/i.test(job.status)).length),
      sub: "Customers to call",
    },
    {
      label: "Awaiting parts",
      value: String(jobs.filter((job) => /awaiting/i.test(job.status)).length),
      sub: `${parts.filter((part) => /low/i.test(part.status)).length} parts low on stock`,
    },
    {
      label: "Quotes pending",
      value: String(pending.length),
      sub: `${rand(pendingValue)} waiting for a yes`,
    },
  ];
}

/** Overview KPIs for every industry, computed from the live records instead of fixed numbers. */
export function liveKpis(
  niche: Niche,
  base: NicheConfig["kpis"],
  records: Live["records"],
  reservations: Reservation[],
  salesTotal: number,
  salesCount: number,
): NicheConfig["kpis"] {
  const get = (key: ModuleKey) => records[key] ?? moduleRecords[key] ?? [];
  const n = (list: ModuleRecord[], pattern: RegExp) =>
    list.filter((record) => pattern.test(record.status)).length;
  const sum = (list: ModuleRecord[]) =>
    list.reduce((total, record) => total + numberIn(record.value), 0);

  switch (niche) {
    case "automotive":
      return automotiveKpis(records);
    case "hospitality": {
      const sellable = rooms.filter((room) => room.status !== "ooo").length;
      const inHouse = reservations.filter((r) => nightsOf(r).includes(TODAY));
      const averageRate = inHouse.length
        ? Math.round(inHouse.reduce((total, r) => total + r.rate, 0) / inHouse.length)
        : 0;
      return [
        {
          label: "Occupancy",
          value: `${Math.round((inHouse.length / sellable) * 100)}%`,
          sub: `${inHouse.length} of ${sellable} rooms tonight`,
        },
        { label: "Average rate", value: rand(averageRate), sub: "Rooms in house tonight" },
        {
          label: "Arrivals",
          value: String(reservations.filter((r) => r.start === TODAY).length),
          sub: "Due today",
        },
        {
          label: "Departures",
          value: String(reservations.filter((r) => addDays(r.start, r.nights) === TODAY).length),
          sub: "Checking out today",
        },
      ];
    }
    case "food": {
      const tables = get("floor-plan");
      const kitchen = get("kitchen");
      const occupied = tables.filter((table) =>
        /seated|ordered|awaiting|ready/i.test(table.status),
      );
      return [
        {
          label: "Tables occupied",
          value: String(occupied.length),
          sub: `of ${tables.length} tables`,
        },
        {
          label: "Open checks",
          value: String(n(tables, /ordered|awaiting|seated/i)),
          sub: `${rand(sum(occupied))} live`,
        },
        {
          label: "Reserved",
          value: String(n(tables, /reserved/i)),
          sub: "Tables held for bookings",
        },
        {
          label: "Kitchen queue",
          value: String(n(kitchen, /queued|cooking/i)),
          sub: `${n(kitchen, /ready/i)} ready`,
        },
      ];
    }
    case "retail": {
      const stock = get("inventory");
      return [
        {
          label: "Sales today",
          value: rand(48240 + salesTotal),
          sub: `${126 + salesCount} transactions`,
        },
        { label: "Low stock", value: String(n(stock, /low/i)), sub: "Needs reordering" },
        { label: "Products", value: String(stock.length), sub: "Stock lines tracked" },
        { label: "Units on hand", value: String(sum(stock)), sub: "Across all products" },
      ];
    }
    case "beauty": {
      const diary = get("appointments");
      return [
        {
          label: "Appointments",
          value: String(diary.length),
          sub: `${n(diary, /confirmed|in service/i)} still to come`,
        },
        {
          label: "Completed",
          value: String(n(diary, /completed/i)),
          sub: "Done and ready to bill",
        },
        { label: "No-shows", value: String(n(diary, /no-show/i)), sub: "Missed appointments" },
        { label: "Service sales", value: rand(21680 + salesTotal), sub: "This week" },
      ];
    }
    case "cleaning": {
      const visits = get("scheduling");
      const billing = get("billing");
      const crews = get("crew");
      const due = billing.filter((plan) => /due/i.test(plan.status));
      return [
        {
          label: "Visits scheduled",
          value: String(visits.length),
          sub: `${n(visits, /scheduled/i)} still to do`,
        },
        { label: "Completed", value: String(n(visits, /completed/i)), sub: "Done today" },
        { label: "Invoices due", value: String(due.length), sub: `${rand(sum(due))} to collect` },
        { label: "Crews", value: String(crews.length), sub: `${n(crews, /available/i)} available` },
      ];
    }
    default:
      return base;
  }
}

export const setBookingStatus = (ref: string, status: string) =>
  live.set((current) => ({
    ...current,
    bookingStatus: { ...(current.bookingStatus ?? {}), [ref]: status },
  }));
