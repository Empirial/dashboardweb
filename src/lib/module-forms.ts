// Registry of "New …" forms for dashboard modules. Each entry describes its fields and how
// the submitted values become a record, so every module page gets a working add button.
import { numberIn } from "./demo-data";
import { rand } from "./hotel-data";
import type { ModuleKey, ModuleRecord } from "./platform-data";
import { shortDay } from "./reservations";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "number" | "tel" | "date" | "time" | "select";
  placeholder?: string;
  required?: boolean;
  wide?: boolean;
  options?: string[];
  defaultValue?: string;
};

export type ModuleForm = {
  /** Text on the page's add button. */
  label: string;
  title: string;
  description: string;
  submit: string;
  fields: FormField[];
  build: (values: Record<string, string>, existing: ModuleRecord[]) => ModuleRecord;
  /** Activity feed entry: [title, detail]. */
  feed: (values: Record<string, string>) => [string, string];
};

const g = (values: Record<string, string>, key: string) => values[key] ?? "";
const highest = (records: ModuleRecord[], pattern: RegExp, floor: number) =>
  Math.max(floor, ...records.map((record) => Number(pattern.exec(record.name)?.[1] ?? 0)));
const money = (value: string) => (numberIn(value) ? rand(numberIn(value)) : "Quote");

export const moduleForms: Partial<Record<ModuleKey, ModuleForm>> = {
  "floor-plan": {
    label: "New table",
    title: "Add a table or hold one for a guest",
    description: "Add a table to the floor plan, or reserve one for a booking.",
    submit: "Add table",
    fields: [
      { name: "table", label: "Table name", placeholder: "e.g. Table 11" },
      { name: "covers", label: "Covers", type: "number", defaultValue: "2" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Empty", "Reserved", "Seated"],
        defaultValue: "Empty",
      },
      {
        name: "note",
        label: "Guest or note",
        required: false,
        placeholder: "e.g. Birthday, window seat",
      },
    ],
    build: (v) => ({
      name: g(v, "table"),
      detail: `${g(v, "note") ? `${g(v, "note")} · ` : ""}${g(v, "covers")} covers`,
      status: g(v, "status"),
      value: g(v, "status") === "Empty" ? "Open" : "Booked",
    }),
    feed: (v) => ["Table added", `${g(v, "table")} · ${g(v, "covers")} covers`],
  },
  kitchen: {
    label: "New ticket",
    title: "Send a ticket to the kitchen",
    description: "Add an order so the kitchen can start cooking.",
    submit: "Send to kitchen",
    fields: [
      { name: "table", label: "Table", placeholder: "e.g. Table 7" },
      { name: "items", label: "Items", wide: true, placeholder: "e.g. 2 starters, 4 mains" },
    ],
    build: (v, existing) => ({
      name: `Ticket ${highest(existing, /Ticket (\d+)/, 50) + 1} · ${g(v, "table")}`,
      detail: g(v, "items"),
      status: "Queued",
      value: "0 min",
    }),
    feed: (v) => ["Kitchen ticket sent", `${g(v, "table")} · ${g(v, "items")}`],
  },
  inventory: {
    label: "New product",
    title: "Add a stock line",
    description: "Track a product, its stock level and when to reorder.",
    submit: "Add product",
    fields: [
      { name: "name", label: "Product", wide: true, placeholder: "e.g. Linen Shirt" },
      { name: "sku", label: "SKU", placeholder: "e.g. APP-2044" },
      { name: "qty", label: "Units in stock", type: "number", defaultValue: "10" },
      { name: "reorder", label: "Reorder at", type: "number", defaultValue: "6" },
    ],
    build: (v) => ({
      name: g(v, "name"),
      detail: `SKU ${g(v, "sku")} · reorder ${g(v, "reorder")}`,
      status: numberIn(g(v, "qty")) <= numberIn(g(v, "reorder")) ? "Low stock" : "In stock",
      value: numberIn(g(v, "qty")),
    }),
    feed: (v) => ["Product added", `${g(v, "name")} · ${g(v, "qty")} units`],
  },
  catalog: {
    label: "New product",
    title: "Add a product to the catalog",
    description: "Set its category and price.",
    submit: "Add product",
    fields: [
      { name: "name", label: "Product", wide: true, placeholder: "e.g. Studio Tee" },
      { name: "category", label: "Category", placeholder: "e.g. Apparel" },
      { name: "price", label: "Price (R)", type: "number" },
    ],
    build: (v) => ({
      name: g(v, "name"),
      detail: `${g(v, "category")} · 1 variant`,
      status: "Active",
      value: money(g(v, "price")),
    }),
    feed: (v) => ["Catalog product added", g(v, "name")],
  },
  appointments: {
    label: "New appointment",
    title: "Book an appointment",
    description: "Reserve a chair for a client.",
    submit: "Book appointment",
    fields: [
      { name: "client", label: "Client name", placeholder: "Full name" },
      { name: "service", label: "Service", placeholder: "e.g. Silk press" },
      { name: "date", label: "Date", type: "date" },
      { name: "time", label: "Time", type: "time", defaultValue: "10:00" },
      { name: "price", label: "Price (R)", type: "number", required: false },
    ],
    build: (v) => ({
      name: `${g(v, "time")} · ${g(v, "client")}`,
      detail: `${g(v, "service")} · Unassigned`,
      status: "Confirmed",
      value: money(g(v, "price")),
      date: g(v, "date"),
    }),
    feed: (v) => ["New appointment", `${g(v, "client")} · ${g(v, "service")}`],
  },
  staff: {
    label: "New staff member",
    title: "Add a team member",
    description: "Record their specialty and working hours.",
    submit: "Add staff member",
    fields: [
      { name: "name", label: "Name", placeholder: "Full name" },
      { name: "specialty", label: "Specialty", placeholder: "e.g. Hair" },
      { name: "hours", label: "Working hours", wide: true, placeholder: "e.g. 09:00-18:00" },
    ],
    build: (v) => ({
      name: g(v, "name"),
      detail: `${g(v, "specialty")} · ${g(v, "hours")}`,
      status: "Available today",
      value: "0%",
    }),
    feed: (v) => ["Staff member added", g(v, "name")],
  },
  packages: {
    label: "New package",
    title: "Create a package",
    description: "Bundle services into one price.",
    submit: "Create package",
    fields: [
      { name: "name", label: "Package name", placeholder: "e.g. Glow Day" },
      { name: "price", label: "Price (R)", type: "number" },
      {
        name: "services",
        label: "Services included",
        wide: true,
        placeholder: "e.g. Facial, manicure, blowout",
      },
    ],
    build: (v) => ({
      name: g(v, "name"),
      detail: g(v, "services"),
      status: `${
        g(v, "services")
          .split(",")
          .filter((part) => part.trim()).length
      } services`,
      value: money(g(v, "price")),
    }),
    feed: (v) => ["Package created", g(v, "name")],
  },
  scheduling: {
    label: "New visit",
    title: "Schedule a visit",
    description: "Book a once-off or recurring visit for a crew.",
    submit: "Schedule visit",
    fields: [
      { name: "client", label: "Client", placeholder: "Name or business" },
      { name: "address", label: "Address", placeholder: "e.g. 14 Oxford Rd" },
      { name: "date", label: "Date", type: "date" },
      { name: "time", label: "Time", type: "time", defaultValue: "09:00" },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["One-off", "Recurring"],
        defaultValue: "One-off",
        wide: true,
      },
    ],
    build: (v) => ({
      name: `${g(v, "time")} · ${g(v, "client")}`,
      detail: `${g(v, "address")} · Unassigned`,
      status: "Scheduled",
      value: g(v, "type"),
      date: g(v, "date"),
    }),
    feed: (v) => ["Visit scheduled", `${g(v, "client")} · ${g(v, "address")}`],
  },
  billing: {
    label: "New billing plan",
    title: "Add a recurring billing plan",
    description: "Set how often a client is billed and for how much.",
    submit: "Add plan",
    fields: [
      { name: "client", label: "Client", placeholder: "Name or business" },
      { name: "amount", label: "Amount (R)", type: "number" },
      {
        name: "frequency",
        label: "Frequency",
        type: "select",
        options: ["Weekly", "Fortnightly", "Monthly"],
        defaultValue: "Monthly",
      },
      { name: "next", label: "Next bill date", type: "date" },
    ],
    build: (v) => ({
      name: g(v, "client"),
      detail: `${g(v, "frequency")} · next ${g(v, "next") ? shortDay(g(v, "next")) : "TBC"}`,
      status: "Upcoming",
      value: money(g(v, "amount")),
    }),
    feed: (v) => ["Billing plan added", `${g(v, "client")} · ${g(v, "frequency")}`],
  },
  crew: {
    label: "New crew",
    title: "Add a crew",
    description: "Set the crew lead, area and daily job capacity.",
    submit: "Add crew",
    fields: [
      { name: "lead", label: "Crew lead", placeholder: "Name" },
      { name: "area", label: "Area", placeholder: "e.g. Sandton" },
      { name: "capacity", label: "Jobs per day", type: "number", defaultValue: "4" },
    ],
    build: (v, existing) => ({
      name: `Crew ${highest(existing, /Crew (\d+)/, 0) + 1} · ${g(v, "lead")}`,
      detail: `0 jobs · ${g(v, "area")}`,
      status: "Available today",
      value: `0/${g(v, "capacity")}`,
    }),
    feed: (v) => ["Crew added", `${g(v, "lead")} · ${g(v, "area")}`],
  },
};
