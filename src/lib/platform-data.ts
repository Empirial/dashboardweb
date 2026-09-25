import type { Niche } from "./product";

export type ModuleKey = "rooms" | "bookings" | "floor-plan" | "kitchen" | "inventory" | "catalog" | "appointments" | "staff" | "packages" | "jobs" | "parts" | "quotes" | "scheduling" | "billing" | "crew";

export type NicheConfig = {
  label: string;
  shortLabel: string;
  business: string;
  descriptor: string;
  kpis: Array<{ label: string; value: string; sub: string }>;
  modules: Array<{ key: ModuleKey; label: string }>;
  categories: string[];
  catalog: Array<{ id: string; name: string; category: string; price: number }>;
  customers: Array<{ name: string; initials: string; detail: string; meta: string; value: string }>;
  revenueLabels: [string, string];
  activity: Array<{ title: string; detail: string; time: string }>;
};

export const nicheOrder: Niche[] = ["hospitality", "food", "retail", "beauty", "automotive", "cleaning"];

export const nicheConfigs: Record<Niche, NicheConfig> = {
  hospitality: {
    label: "Hospitality", shortLabel: "Hotel", business: "Empirial Hotel", descriptor: "Property operations",
    kpis: [{ label: "Occupancy", value: "92%", sub: "184 of 200 rooms" }, { label: "ADR", value: "R1 840", sub: "+4.2% this week" }, { label: "Arrivals", value: "17", sub: "3 checked in" }, { label: "Departures", value: "9", sub: "Before 10:00" }],
    modules: [{ key: "rooms", label: "Rooms" }, { key: "bookings", label: "Bookings" }],
    categories: ["Drinks", "Mains", "Snacks", "Room service"],
    catalog: [{ id: "h1", name: "Nespresso", category: "Drinks", price: 38 }, { id: "h2", name: "Amarula", category: "Drinks", price: 65 }, { id: "h3", name: "Fresh Juice", category: "Drinks", price: 45 }, { id: "h4", name: "Beef Sirloin", category: "Mains", price: 245 }, { id: "h5", name: "Line Fish", category: "Mains", price: 210 }, { id: "h6", name: "Veg Bobotie", category: "Mains", price: 155 }, { id: "h7", name: "Biltong Board", category: "Snacks", price: 120 }, { id: "h8", name: "Truffle Fries", category: "Snacks", price: 75 }, { id: "h9", name: "Breakfast Tray", category: "Room service", price: 165 }, { id: "h10", name: "Laundry Bag", category: "Room service", price: 90 }],
    customers: [{ name: "Thabo Mokoena", initials: "TM", detail: "Room 209 · 12 stays", meta: "VIP guest", value: "R2 313" }, { name: "Lerato Khumalo", initials: "LK", detail: "Room 204 · 5 stays", meta: "Returning", value: "R7 890" }, { name: "Ravi Pillay", initials: "RP", detail: "Room 108 · 2 stays", meta: "Returning", value: "R3 140" }],
    revenueLabels: ["Rooms", "Food & beverage"], activity: [{ title: "Room 209 checked in", detail: "Thabo Mokoena · Deluxe", time: "14:18" }, { title: "Card payment approved", detail: "Terrace Bar · R860", time: "13:54" }, { title: "Room 103 marked clean", detail: "Housekeeping", time: "13:31" }],
  },
  food: {
    label: "Food & Restaurant", shortLabel: "Restaurant", business: "Empirial Table", descriptor: "Restaurant operations",
    kpis: [{ label: "Tables occupied", value: "14", sub: "of 22 tables" }, { label: "Open checks", value: "11", sub: "R8 420 live" }, { label: "Average ticket", value: "R486", sub: "+7% this week" }, { label: "Kitchen queue", value: "8", sub: "3 ready" }],
    modules: [{ key: "floor-plan", label: "Floor plan" }, { key: "kitchen", label: "Kitchen" }], categories: ["Starters", "Mains", "Drinks", "Desserts"],
    catalog: [{ id: "f1", name: "Cape Malay Bites", category: "Starters", price: 95 }, { id: "f2", name: "Burrata", category: "Starters", price: 125 }, { id: "f3", name: "Grilled Kingklip", category: "Mains", price: 245 }, { id: "f4", name: "Short Rib", category: "Mains", price: 275 }, { id: "f5", name: "Chenin Glass", category: "Drinks", price: 78 }, { id: "f6", name: "Sparkling Water", category: "Drinks", price: 42 }, { id: "f7", name: "Malva Pudding", category: "Desserts", price: 82 }],
    customers: [{ name: "Nomsa Dube", initials: "ND", detail: "18 visits · Table 7", meta: "Shellfish allergy", value: "R7 260" }, { name: "David Hunt", initials: "DH", detail: "9 visits · Table 12", meta: "Prefers window", value: "R4 140" }], revenueLabels: ["Food", "Beverage"], activity: [{ title: "Table 7 sent to kitchen", detail: "4 covers · 7 items", time: "19:22" }, { title: "Ticket 48 ready", detail: "Table 12", time: "19:18" }],
  },
  retail: {
    label: "Retail", shortLabel: "Retail", business: "Empirial Goods", descriptor: "Retail operations",
    kpis: [{ label: "Sales today", value: "R48 240", sub: "126 transactions" }, { label: "Low stock", value: "8", sub: "Needs attention" }, { label: "Top product", value: "Field Tote", sub: "19 sold" }, { label: "Units sold", value: "284", sub: "+12% vs Friday" }],
    modules: [{ key: "inventory", label: "Inventory" }, { key: "catalog", label: "Catalog" }], categories: ["Accessories", "Apparel", "Home", "Gifts"],
    catalog: [{ id: "r1", name: "Field Tote", category: "Accessories", price: 680 }, { id: "r2", name: "Leather Wallet", category: "Accessories", price: 420 }, { id: "r3", name: "Linen Shirt", category: "Apparel", price: 890 }, { id: "r4", name: "Studio Tee", category: "Apparel", price: 420 }, { id: "r5", name: "Stone Carafe", category: "Home", price: 540 }, { id: "r6", name: "Candle No. 04", category: "Home", price: 280 }, { id: "r7", name: "Gift Card", category: "Gifts", price: 500 }],
    customers: [{ name: "Ayanda Mbeki", initials: "AM", detail: "24 purchases", meta: "1 840 loyalty points", value: "R18 420" }, { name: "James Wilson", initials: "JW", detail: "8 purchases", meta: "620 loyalty points", value: "R6 210" }], revenueLabels: ["Apparel", "Home & gifts"], activity: [{ title: "Low stock alert", detail: "Field Tote · 3 remaining", time: "15:12" }, { title: "Sale completed", detail: "3 items · R1 740", time: "14:58" }],
  },
  beauty: {
    label: "Beauty & Grooming", shortLabel: "Beauty", business: "Empirial Studio", descriptor: "Salon operations",
    kpis: [{ label: "Appointments", value: "28", sub: "5 remaining" }, { label: "No-shows", value: "1", sub: "3.6% today" }, { label: "Chair use", value: "84%", sub: "6 of 7 active" }, { label: "Service sales", value: "R21 680", sub: "+9% this week" }],
    modules: [{ key: "appointments", label: "Appointments" }, { key: "staff", label: "Staff" }, { key: "packages", label: "Packages" }], categories: ["Hair", "Nails", "Skin", "Packages"],
    catalog: [{ id: "b1", name: "Cut & Finish", category: "Hair", price: 620 }, { id: "b2", name: "Colour Refresh", category: "Hair", price: 980 }, { id: "b3", name: "Gel Manicure", category: "Nails", price: 420 }, { id: "b4", name: "Signature Facial", category: "Skin", price: 850 }, { id: "b5", name: "Glow Day", category: "Packages", price: 1450 }],
    customers: [{ name: "Zanele Khoza", initials: "ZK", detail: "14 services · with Mia", meta: "Next: 02 Oct", value: "R12 480" }, { name: "Nadia Peters", initials: "NP", detail: "7 services · with Lwazi", meta: "Next: 05 Oct", value: "R5 920" }], revenueLabels: ["Services", "Products"], activity: [{ title: "Appointment completed", detail: "Zanele · Cut & Finish", time: "16:10" }, { title: "New booking", detail: "Facial · 10:30 tomorrow", time: "15:44" }],
  },
  automotive: {
    label: "Automotive", shortLabel: "Auto", business: "Empirial Auto", descriptor: "Workshop operations",
    kpis: [{ label: "In progress", value: "9", sub: "Across 12 bays" }, { label: "Ready", value: "4", sub: "For collection" }, { label: "Parts on order", value: "13", sub: "6 due today" }, { label: "Work billed", value: "R86 420", sub: "+6% this week" }],
    modules: [{ key: "jobs", label: "Job cards" }, { key: "parts", label: "Parts" }, { key: "quotes", label: "Quotes" }], categories: ["Labour", "Parts", "Tyres", "Care"],
    catalog: [{ id: "a1", name: "Diagnostic Hour", category: "Labour", price: 850 }, { id: "a2", name: "Workshop Hour", category: "Labour", price: 720 }, { id: "a3", name: "Oil Filter", category: "Parts", price: 280 }, { id: "a4", name: "Brake Pads", category: "Parts", price: 1680 }, { id: "a5", name: "Wheel Alignment", category: "Tyres", price: 520 }, { id: "a6", name: "Valet", category: "Care", price: 380 }],
    customers: [{ name: "Peter Molefe", initials: "PM", detail: "Toyota Fortuner · 2 vehicles", meta: "Last service: 18 Aug", value: "R24 600" }, { name: "Grace Adams", initials: "GA", detail: "VW Polo · 1 vehicle", meta: "Last service: 07 Sep", value: "R8 940" }], revenueLabels: ["Labour", "Parts"], activity: [{ title: "Job marked ready", detail: "EMP-J104 · VW Polo", time: "16:08" }, { title: "Parts received", detail: "Brake pads · 12 units", time: "15:36" }],
  },
  cleaning: {
    label: "Cleaning & Property", shortLabel: "Cleaning", business: "Empirial Property", descriptor: "Field service operations",
    kpis: [{ label: "Jobs today", value: "18", sub: "4 remaining" }, { label: "Completed", value: "14", sub: "78% of schedule" }, { label: "Overdue invoices", value: "6", sub: "R18 420 due" }, { label: "Crews active", value: "7", sub: "21 team members" }],
    modules: [{ key: "scheduling", label: "Scheduling" }, { key: "billing", label: "Billing" }, { key: "crew", label: "Crew" }], categories: ["Residential", "Commercial", "Deep clean", "Extras"],
    catalog: [{ id: "c1", name: "2-bed Home", category: "Residential", price: 680 }, { id: "c2", name: "3-bed Home", category: "Residential", price: 880 }, { id: "c3", name: "Office Half-day", category: "Commercial", price: 1450 }, { id: "c4", name: "Deep Clean", category: "Deep clean", price: 1850 }, { id: "c5", name: "Carpet Treatment", category: "Extras", price: 480 }],
    customers: [{ name: "Rosebank Dental", initials: "RD", detail: "14 Oxford Rd · weekly", meta: "Next bill: 01 Oct", value: "R8 600" }, { name: "S. Naidoo", initials: "SN", detail: "Parkhurst · fortnightly", meta: "Next bill: 04 Oct", value: "R3 240" }], revenueLabels: ["Recurring", "One-off"], activity: [{ title: "Job completed", detail: "Rosebank Dental · Crew 3", time: "16:20" }, { title: "Crew assigned", detail: "Parkhurst · tomorrow 09:00", time: "15:52" }],
  },
};

export const weekSeries = [68, 74, 71, 88, 94, 82, 91];

export const moduleRecords: Partial<Record<ModuleKey, Array<Record<string, string | number | boolean>>>> = {
  "floor-plan": [{ name: "Table 1", detail: "2 covers", status: "Seated", value: "R420" }, { name: "Table 4", detail: "4 covers", status: "Ordered", value: "R1 280" }, { name: "Table 7", detail: "6 covers", status: "Awaiting payment", value: "R2 140" }, { name: "Table 9", detail: "Window · 2 covers", status: "Empty", value: "Open" }, { name: "Table 12", detail: "4 covers", status: "Ready", value: "R980" }, { name: "Terrace 2", detail: "2 covers", status: "Empty", value: "Open" }],
  kitchen: [{ name: "Ticket 48 · Table 12", detail: "Kingklip, short rib, 2 sides", status: "Ready", value: "12 min" }, { name: "Ticket 49 · Table 7", detail: "2 starters, 4 mains", status: "Cooking", value: "8 min" }, { name: "Ticket 50 · Table 4", detail: "Burrata, kingklip", status: "Queued", value: "3 min" }],
  inventory: [{ name: "Field Tote", detail: "SKU ACC-1001 · reorder 6", status: "Low stock", value: 3 }, { name: "Linen Shirt", detail: "SKU APP-2044 · 4 variants", status: "In stock", value: 24 }, { name: "Stone Carafe", detail: "SKU HOM-3012", status: "In stock", value: 18 }, { name: "Candle No. 04", detail: "SKU HOM-4430 · reorder 8", status: "Low stock", value: 5 }],
  catalog: [{ name: "Field Tote", detail: "Accessories · 3 variants", status: "Active", value: "R680" }, { name: "Linen Shirt", detail: "Apparel · 8 variants", status: "Active", value: "R890" }, { name: "Stone Carafe", detail: "Home · 1 variant", status: "Active", value: "R540" }],
  appointments: [{ name: "09:00 · Zanele Khoza", detail: "Cut & Finish · Mia", status: "Completed", value: "R620" }, { name: "10:30 · Nadia Peters", detail: "Signature Facial · Lwazi", status: "In service", value: "R850" }, { name: "13:00 · Open slot", detail: "Mia · 60 minutes", status: "Available", value: "Book" }, { name: "14:30 · Amara Scott", detail: "Gel Manicure · Priya", status: "Confirmed", value: "R420" }],
  staff: [{ name: "Mia Jacobs", detail: "Hair · 09:00–18:00", status: "Available today", value: "35%" }, { name: "Lwazi Mthembu", detail: "Skin · 10:00–19:00", status: "Available today", value: "32%" }, { name: "Priya Naidoo", detail: "Nails · 08:00–17:00", status: "Off today", value: "30%" }],
  packages: [{ name: "Glow Day", detail: "Facial, manicure, blowout", status: "3 services", value: "R1 450" }, { name: "Monthly Reset", detail: "2 cuts, 1 treatment", status: "3 services", value: "R1 680" }, { name: "Bridal Edit", detail: "Trial, event hair, makeup", status: "3 services", value: "R3 200" }],
  jobs: [{ name: "EMP-J104 · VW Polo", detail: "Grace Adams · brake service", status: "Ready for collection", value: "R4 820" }, { name: "EMP-J105 · Toyota Fortuner", detail: "Peter Molefe · major service", status: "In progress", value: "R8 940" }, { name: "EMP-J106 · BMW X3", detail: "M. Botha · diagnosis", status: "Awaiting parts", value: "R2 100" }],
  parts: [{ name: "Brake Pad Set", detail: "BP-442 · AutoParts SA", status: "Low stock", value: 4 }, { name: "Oil Filter", detail: "OF-104 · Midas", status: "In stock", value: 18 }, { name: "Air Filter", detail: "AF-229 · Goldwagen", status: "On order", value: 0 }],
  quotes: [{ name: "Q-1084 · Peter Molefe", detail: "Service + front brakes", status: "Approved", value: "R8 940" }, { name: "Q-1085 · M. Botha", detail: "Diagnosis + cooling repair", status: "Pending", value: "R6 280" }, { name: "Q-1086 · Greenway Ltd", detail: "Fleet service · 4 vehicles", status: "Draft", value: "R22 400" }],
  scheduling: [{ name: "09:00 · Rosebank Dental", detail: "14 Oxford Rd · Crew 3", status: "Completed", value: "Recurring" }, { name: "11:30 · S. Naidoo", detail: "Parkhurst · Crew 1", status: "In progress", value: "Recurring" }, { name: "14:00 · Orbit Legal", detail: "Sandton · Unassigned", status: "Scheduled", value: "One-off" }],
  billing: [{ name: "Rosebank Dental", detail: "Weekly · next 01 Oct", status: "Due", value: "R8 600" }, { name: "S. Naidoo", detail: "Fortnightly · next 04 Oct", status: "Upcoming", value: "R3 240" }, { name: "Orbit Legal", detail: "Monthly · next 01 Oct", status: "Due", value: "R12 500" }],
  crew: [{ name: "Crew 1 · Themba", detail: "3 jobs · Parkhurst", status: "Available today", value: "3/4" }, { name: "Crew 2 · Lerato", detail: "2 jobs · Sandton", status: "Available today", value: "2/4" }, { name: "Crew 3 · Grace", detail: "4 jobs · Rosebank", status: "At capacity", value: "4/4" }],
};
