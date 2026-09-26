export type VerticalKey = "hotel" | "property" | "retail" | "salon" | "auto";

export type VerticalConfig = {
  key: VerticalKey;
  tab: string;
  brand: string;
  represents: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  preview: {
    label: string;
    caption: string;
    rows: Array<{ left: string; mid: string; right: string; tone?: "accent" | "muted" }>;
  };
  steps: [string, string, string];
  features: Array<{ title: string; body: string }>;
  pricingUnit: string;
  tiers: Array<{ name: string; setup: string; monthly: string; includes: string[] }>;
  proof: Array<{ name: string; detail: string }>;
};

export const verticals: VerticalConfig[] = [
  {
    key: "hotel",
    tab: "Hotel",
    brand: "Empirial Hotel",
    represents: "Accommodation, guesthouses, hotels",
    accent: "#0F5C56",
    accentSoft: "#E4F0EE",
    accentInk: "#0A403C",
    headline: "Your booking book is a paper diary and the bar tab lives on a",
    headlineAccent: "separate till.",
    sub: "Empirial Hotel puts the room board, arrivals, bar and restaurant charges on one screen, so a guest's stay and spend never have to be added up by hand at checkout.",
    preview: {
      label: "Room board · next 5 nights",
      caption: "Live availability, advance bookings, and room charges in one grid.",
      rows: [
        { left: "101 · Standard", mid: "T. Mokoena · 3 nights", right: "Checked in", tone: "accent" },
        { left: "104 · Standard", mid: "Open", right: "Available", tone: "muted" },
        { left: "209 · Deluxe", mid: "L. Khumalo · 2 nights", right: "Arrives 14:00" },
        { left: "212 · Deluxe", mid: "Advance · 12 Oct", right: "Held" },
        { left: "301 · Suite", mid: "Bar tab R860", right: "On room", tone: "accent" },
      ],
    },
    steps: ["Take bar, restaurant and room-service payments at any till.", "Run the room board: arrivals, departures, housekeeping, advance bookings.", "Close the day with one report that ties rooms and F&B together."],
    features: [
      { title: "Room board calendar", body: "Fourteen nights at a glance, with booked stays, advance holds and free rooms per room type." },
      { title: "Charge to room", body: "A drink at the bar lands on the guest folio, so checkout is one balance instead of three slips." },
      { title: "Book from the till", body: "A walk-in can be given a room, dates and a rate from the register without leaving the sale." },
      { title: "Arrivals and departures", body: "Today's check-ins, check-outs and housekeeping status on the overview screen." },
    ],
    pricingUnit: "per room",
    tiers: [
      { name: "Starter", setup: "R3 500 setup", monthly: "R650 / month", includes: ["Up to 10 rooms", "Register + room board", "Daily reports"] },
      { name: "Smart", setup: "R6 500 setup", monthly: "R1 250 / month", includes: ["Up to 40 rooms", "Charge to room + F&B till", "Advance bookings"] },
      { name: "Elite", setup: "R12 000 setup", monthly: "R2 400 / month", includes: ["Unlimited rooms", "Multiple tills and bars", "Staff roles and shift reports"] },
    ],
    proof: [],
  },
  {
    key: "property",
    tab: "Property",
    brand: "Empirial Property",
    represents: "Cleaning & property services",
    accent: "#9C3F1C",
    accentSoft: "#F6E8E1",
    accentInk: "#6F2C12",
    headline: "You are chasing the same monthly invoices and guessing which crew took the",
    headlineAccent: "morning job.",
    sub: "Empirial Property keeps the schedule, the crews and the recurring billing run in one place, so nobody arrives at an unassigned job and no month-end invoice is forgotten.",
    preview: {
      label: "Today's schedule",
      caption: "Jobs, assigned crews and billing status for the day.",
      rows: [
        { left: "08:00 · Rosebank Dental", mid: "Crew 3 · weekly", right: "Completed", tone: "accent" },
        { left: "10:30 · Parkhurst home", mid: "Crew 1 · fortnightly", right: "In progress" },
        { left: "13:00 · Oxford offices", mid: "Unassigned", right: "Needs crew", tone: "muted" },
        { left: "15:00 · Deep clean", mid: "Crew 2 · once-off", right: "Scheduled" },
        { left: "Billing run · 01 Oct", mid: "18 clients", right: "R18 420", tone: "accent" },
      ],
    },
    steps: ["Take card or cash for once-off jobs on site.", "Assign crews to the day's schedule and mark jobs complete as they finish.", "Run the recurring billing batch and see who has paid."],
    features: [
      { title: "Job schedule", body: "The day laid out by time with the crew on each job and anything still unassigned flagged." },
      { title: "Recurring billing", body: "Weekly, fortnightly and monthly clients batched into one run instead of chased one by one." },
      { title: "Crew capacity", body: "Who is on today, how many jobs each crew carries, and where there is room for one more." },
      { title: "Once-off charges", body: "Carpet treatments and extras added to a job and paid for on the spot." },
    ],
    pricingUnit: "per crew",
    tiers: [
      { name: "Starter", setup: "R2 500 setup", monthly: "R550 / month", includes: ["1 crew", "Schedule + register", "Once-off invoicing"] },
      { name: "Smart", setup: "R5 500 setup", monthly: "R1 050 / month", includes: ["Up to 5 crews", "Recurring billing runs", "Client history"] },
      { name: "Elite", setup: "R9 500 setup", monthly: "R1 950 / month", includes: ["Unlimited crews", "Commercial contracts", "Crew performance reports"] },
    ],
    proof: [{ name: "NNA Electrical & Plumbing", detail: "Field service client of Empirial Designs" }],
  },
  {
    key: "retail",
    tab: "Retail",
    brand: "Empirial Retail",
    represents: "Shops and retail stores",
    accent: "#8A5A06",
    accentSoft: "#F8EEDA",
    accentInk: "#5F3D02",
    headline: "You only find out a line has sold out when a customer asks for it at the",
    headlineAccent: "counter.",
    sub: "Empirial Retail counts stock as it sells, flags reorder levels before the shelf is empty, and scans barcodes straight into the sale.",
    preview: {
      label: "Stock on hand",
      caption: "Counts move as items sell, with reorder levels flagged.",
      rows: [
        { left: "Field Tote", mid: "ACC-1001 · reorder at 6", right: "3 left", tone: "accent" },
        { left: "Linen Shirt", mid: "APP-2044 · 4 variants", right: "24 left" },
        { left: "Stone Carafe", mid: "HOM-3012", right: "18 left" },
        { left: "Candle No. 04", mid: "HOM-4430 · reorder at 8", right: "5 left", tone: "accent" },
        { left: "Studio Tee", mid: "APP-2088", right: "31 left", tone: "muted" },
      ],
    },
    steps: ["Scan or tap items into the sale and take card or cash.", "Watch stock counts and reorder flags move as the day sells.", "Check what sold, what is short, and what to order."],
    features: [
      { title: "Barcode selling", body: "Scan straight into the till; the line, price and stock count all update together." },
      { title: "Low stock flags", body: "Reorder levels per product so a fast line is flagged before it runs out." },
      { title: "Product catalogue", body: "Prices, categories and variants in one list you can change without calling anyone." },
      { title: "Daily sales report", body: "Units sold, takings by category, and the day's top products." },
    ],
    pricingUnit: "per till",
    tiers: [
      { name: "Starter", setup: "R2 500 setup", monthly: "R550 / month", includes: ["1 till", "Up to 300 products", "Daily sales report"] },
      { name: "Smart", setup: "R5 000 setup", monthly: "R1 050 / month", includes: ["2 tills", "Barcode scanning", "Stock and reorder levels"] },
      { name: "Elite", setup: "R9 000 setup", monthly: "R1 850 / month", includes: ["Unlimited tills", "Variants and suppliers", "Staff roles and shift cash-up"] },
    ],
    proof: [],
  },
  {
    key: "salon",
    tab: "Salon",
    brand: "Empirial Salon",
    represents: "Beauty & grooming",
    accent: "#9B2F58",
    accentSoft: "#F7E5EC",
    accentInk: "#6D1E3C",
    headline: "The appointment book is a notebook, the reminders are on WhatsApp, and the 10:30 just",
    headlineAccent: "did not arrive.",
    sub: "Empirial Salon keeps every chair's day in one book, shows the open slots you can still fill, and records no-shows instead of losing them.",
    preview: {
      label: "Today · by chair",
      caption: "Every stylist's day, with open slots you can still sell.",
      rows: [
        { left: "09:00 · Zanele Khoza", mid: "Cut & finish · Mia", right: "Completed", tone: "accent" },
        { left: "10:30 · Nadia Peters", mid: "Signature facial · Lwazi", right: "In service" },
        { left: "13:00 · Open slot", mid: "Mia · 60 minutes", right: "Fill it", tone: "muted" },
        { left: "14:30 · Amara Scott", mid: "Gel manicure · Priya", right: "Confirmed" },
        { left: "16:00 · Glow Day", mid: "Package · 3 services", right: "R1 450", tone: "accent" },
      ],
    },
    steps: ["Take payment for services, packages and retail at the front desk.", "Run the appointment book chair by chair and fill open slots.", "See chair use, no-shows and service takings for the week."],
    features: [
      { title: "Appointment book", body: "The day per stylist with confirmed, in-service, completed and open slots clearly marked." },
      { title: "Packages", body: "Bundle services into one sellable package that drops straight onto the till." },
      { title: "Chair and staff view", body: "Who is on today, their hours, and how full each chair is." },
      { title: "No-show record", body: "No-shows counted instead of forgotten, so repeat offenders are visible." },
    ],
    pricingUnit: "per chair",
    tiers: [
      { name: "Starter", setup: "R2 500 setup", monthly: "R500 / month", includes: ["Up to 2 chairs", "Appointment book", "Card and cash"] },
      { name: "Smart", setup: "R4 500 setup", monthly: "R950 / month", includes: ["Up to 6 chairs", "Packages and retail", "Client history"] },
      { name: "Elite", setup: "R8 500 setup", monthly: "R1 750 / month", includes: ["Unlimited chairs", "Staff commission reports", "Multi-branch"] },
    ],
    proof: [{ name: "R&M Beauty Salon", detail: "Salon client of Empirial Designs" }],
  },
  {
    key: "auto",
    tab: "Auto",
    brand: "Empirial Auto",
    represents: "Automotive repair shops",
    accent: "#1E4B80",
    accentSoft: "#E4EBF4",
    accentInk: "#143459",
    headline: "Job cards live on paper and only one person knows which parts are on",
    headlineAccent: "order.",
    sub: "Empirial Auto tracks every job card from intake to collection, ties parts and labour to the vehicle, and turns an accepted quote into the invoice.",
    preview: {
      label: "Job cards · workshop",
      caption: "Each vehicle's stage, parts and running total.",
      rows: [
        { left: "EMP-J104 · VW Polo", mid: "G. Adams · brake service", right: "Ready", tone: "accent" },
        { left: "EMP-J105 · Fortuner", mid: "P. Molefe · major service", right: "In progress" },
        { left: "EMP-J106 · BMW X3", mid: "M. Botha · diagnosis", right: "Awaiting parts", tone: "muted" },
        { left: "Brake pad set", mid: "BP-442 · AutoParts SA", right: "4 in stock" },
        { left: "Quote EMP-Q88", mid: "Clutch replacement", right: "R14 200", tone: "accent" },
      ],
    },
    steps: ["Take deposits and final payments at the counter.", "Move job cards through intake, work, parts and ready for collection.", "See labour versus parts billed and what is still outstanding."],
    features: [
      { title: "Job cards", body: "Vehicle, customer, complaint and stage in one card the whole workshop can read." },
      { title: "Parts tracking", body: "Parts on hand, on order and attached to a specific job instead of a memory." },
      { title: "Quotes to invoice", body: "An approved estimate becomes the counter invoice without retyping the lines." },
      { title: "Labour and parts split", body: "Reports that show what the workshop earned on hours versus what came from parts." },
    ],
    pricingUnit: "per bay",
    tiers: [
      { name: "Starter", setup: "R3 000 setup", monthly: "R600 / month", includes: ["Up to 3 bays", "Job cards", "Card and cash"] },
      { name: "Smart", setup: "R6 000 setup", monthly: "R1 150 / month", includes: ["Up to 8 bays", "Parts and suppliers", "Quotes to invoice"] },
      { name: "Elite", setup: "R11 000 setup", monthly: "R2 100 / month", includes: ["Unlimited bays", "Technician hours", "Labour vs parts reporting"] },
    ],
    proof: [],
  },
];

export const verticalByKey = (key: string | null): VerticalConfig =>
  verticals.find((vertical) => vertical.key === key) ?? verticals[0]!;
