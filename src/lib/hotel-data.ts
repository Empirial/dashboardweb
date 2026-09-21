// Mock data for the Empirial Hotel property-ops dashboard.
// Replace with live data when a backend is connected.

export type RoomStatus = "clean" | "dirty" | "occupied" | "ooo";

export type Room = {
  number: string;
  type: "Single" | "Twin" | "Deluxe" | "Suite";
  floor: number;
  status: RoomStatus;
  guest?: string;
  rate: number;
};

export const statusLabel: Record<RoomStatus, string> = {
  clean: "Clean",
  dirty: "Dirty",
  occupied: "Occ",
  ooo: "OOO",
};

// Minimal status treatment: hairline border with a thin coloured left rule.
export const statusClasses: Record<RoomStatus, string> = {
  clean: "border border-border border-l-2 border-l-clean bg-paper text-clean-foreground",
  dirty: "border border-border border-l-2 border-l-dirty bg-paper text-dirty-foreground",
  occupied: "border border-border border-l-2 border-l-occupied bg-paper text-occupied-foreground",
  ooo: "border border-border border-l-2 border-l-ooo bg-paper text-ooo-foreground",
};

export const statusDot: Record<RoomStatus, string> = {
  clean: "bg-clean",
  dirty: "bg-dirty",
  occupied: "bg-occupied",
  ooo: "bg-ooo",
};

export const rooms: Room[] = [
  { number: "101", type: "Single", floor: 1, status: "clean", rate: 980 },
  { number: "102", type: "Single", floor: 1, status: "occupied", guest: "P. Sithole", rate: 980 },
  { number: "103", type: "Twin", floor: 1, status: "dirty", rate: 1450 },
  { number: "104", type: "Twin", floor: 1, status: "clean", rate: 1450 },
  { number: "105", type: "Deluxe", floor: 1, status: "occupied", guest: "M. Dlamini", rate: 1840 },
  { number: "106", type: "Deluxe", floor: 1, status: "ooo", rate: 1840 },
  { number: "107", type: "Single", floor: 1, status: "clean", rate: 980 },
  { number: "108", type: "Twin", floor: 1, status: "occupied", guest: "R. Pillay", rate: 1450 },
  { number: "204", type: "Deluxe", floor: 2, status: "occupied", guest: "L. Khumalo", rate: 1840 },
  { number: "205", type: "Deluxe", floor: 2, status: "clean", rate: 1840 },
  { number: "206", type: "Twin", floor: 2, status: "dirty", rate: 1450 },
  { number: "207", type: "Twin", floor: 2, status: "ooo", rate: 1450 },
  { number: "208", type: "Single", floor: 2, status: "clean", rate: 980 },
  { number: "209", type: "Suite", floor: 2, status: "occupied", guest: "T. Mokoena", rate: 3400 },
  { number: "210", type: "Deluxe", floor: 2, status: "dirty", rate: 1840 },
  { number: "211", type: "Deluxe", floor: 2, status: "clean", rate: 1840 },
  { number: "301", type: "Suite", floor: 3, status: "occupied", guest: "A. van Wyk", rate: 3400 },
  { number: "302", type: "Suite", floor: 3, status: "clean", rate: 3400 },
  { number: "303", type: "Deluxe", floor: 3, status: "occupied", guest: "J. Ndlovu", rate: 1840 },
  { number: "304", type: "Deluxe", floor: 3, status: "dirty", rate: 1840 },
  { number: "305", type: "Twin", floor: 3, status: "clean", rate: 1450 },
  { number: "306", type: "Twin", floor: 3, status: "occupied", guest: "S. Botha", rate: 1450 },
  { number: "307", type: "Single", floor: 3, status: "clean", rate: 980 },
  { number: "308", type: "Single", floor: 3, status: "dirty", rate: 980 },
];

export type Booking = {
  ref: string;
  guest: string;
  initials: string;
  roomType: Room["type"];
  room: string;
  nights: number;
  arrival: string;
  time: string;
  total: number;
  status: "Confirmed" | "Checked in" | "Checked out" | "Pending";
  channel: "Direct" | "Booking.com" | "Walk-in" | "Corporate";
};

export const bookings: Booking[] = [
  {
    ref: "EMP-4821",
    guest: "T. Mokoena",
    initials: "TM",
    roomType: "Deluxe",
    room: "209",
    nights: 2,
    arrival: "12 Mar",
    time: "15:00",
    total: 2100,
    status: "Confirmed",
    channel: "Direct",
  },
  {
    ref: "EMP-4822",
    guest: "J. Ndlovu",
    initials: "JN",
    roomType: "Suite",
    room: "303",
    nights: 1,
    arrival: "12 Mar",
    time: "17:30",
    total: 3400,
    status: "Confirmed",
    channel: "Booking.com",
  },
  {
    ref: "EMP-4823",
    guest: "A. van Wyk",
    initials: "AV",
    roomType: "Twin",
    room: "301",
    nights: 3,
    arrival: "12 Mar",
    time: "19:00",
    total: 1750,
    status: "Pending",
    channel: "Walk-in",
  },
  {
    ref: "EMP-4810",
    guest: "L. Khumalo",
    initials: "LK",
    roomType: "Deluxe",
    room: "204",
    nights: 4,
    arrival: "10 Mar",
    time: "14:10",
    total: 7360,
    status: "Checked in",
    channel: "Corporate",
  },
  {
    ref: "EMP-4808",
    guest: "R. Pillay",
    initials: "RP",
    roomType: "Twin",
    room: "108",
    nights: 2,
    arrival: "11 Mar",
    time: "16:45",
    total: 2900,
    status: "Checked in",
    channel: "Direct",
  },
  {
    ref: "EMP-4799",
    guest: "S. Botha",
    initials: "SB",
    roomType: "Twin",
    room: "306",
    nights: 5,
    arrival: "08 Mar",
    time: "13:20",
    total: 7250,
    status: "Checked out",
    channel: "Booking.com",
  },
];

export type Guest = {
  name: string;
  initials: string;
  room?: string;
  phone: string;
  stays: number;
  folio: number;
  tier: "VIP" | "Returning" | "New";
};

export const guests: Guest[] = [
  { name: "Thabo Mokoena", initials: "TM", room: "209", phone: "082 441 0921", stays: 12, folio: 2313, tier: "VIP" },
  { name: "Lerato Khumalo", initials: "LK", room: "204", phone: "071 220 8814", stays: 5, folio: 7890, tier: "Returning" },
  { name: "Ravi Pillay", initials: "RP", room: "108", phone: "083 907 3312", stays: 2, folio: 3140, tier: "Returning" },
  { name: "Jabu Ndlovu", initials: "JN", room: "303", phone: "079 118 4470", stays: 1, folio: 3400, tier: "New" },
  { name: "Sanet Botha", initials: "SB", phone: "084 332 7710", stays: 8, folio: 0, tier: "VIP" },
  { name: "Anke van Wyk", initials: "AV", phone: "072 654 1180", stays: 1, folio: 0, tier: "New" },
];

export type PosCategory = "Drinks" | "Mains" | "Snacks" | "Room service";

export type PosItem = { id: string; name: string; price: number; category: PosCategory };

export const posItems: PosItem[] = [
  { id: "d1", name: "Nespresso", price: 38, category: "Drinks" },
  { id: "d2", name: "Amarula", price: 65, category: "Drinks" },
  { id: "d3", name: "Fresh Juice", price: 45, category: "Drinks" },
  { id: "d4", name: "Chenin Blanc", price: 55, category: "Drinks" },
  { id: "d5", name: "Castle Lager", price: 42, category: "Drinks" },
  { id: "d6", name: "Rooibos Pot", price: 32, category: "Drinks" },
  { id: "m1", name: "Beef Sirloin", price: 245, category: "Mains" },
  { id: "m2", name: "Line Fish", price: 210, category: "Mains" },
  { id: "m3", name: "Lamb Curry", price: 185, category: "Mains" },
  { id: "m4", name: "Veg Bobotie", price: 155, category: "Mains" },
  { id: "s1", name: "Biltong Board", price: 120, category: "Snacks" },
  { id: "s2", name: "Truffle Fries", price: 75, category: "Snacks" },
  { id: "s3", name: "Samoosas (4)", price: 60, category: "Snacks" },
  { id: "s4", name: "Cheese Plate", price: 140, category: "Snacks" },
  { id: "r1", name: "Breakfast Tray", price: 165, category: "Room service" },
  { id: "r2", name: "Late Supper", price: 195, category: "Room service" },
  { id: "r3", name: "Laundry Bag", price: 90, category: "Room service" },
];

export const posCategories: PosCategory[] = ["Drinks", "Mains", "Snacks", "Room service"];

export const occupiedRooms = rooms.filter((r) => r.status === "occupied");

export const kpis = {
  occupancyPct: 92,
  occupied: 184,
  totalRooms: 200,
  adr: 1840,
  adrDelta: "▲ 4.2% vs wk",
  revenueToday: 126480,
  fnbToday: 21340,
  arrivals: 17,
  checkedIn: 3,
  departures: 9,
};

export const revenueWeek = [
  { day: "Wed", rooms: 88400, fnb: 17200 },
  { day: "Thu", rooms: 94100, fnb: 19850 },
  { day: "Fri", rooms: 118600, fnb: 26400 },
  { day: "Sat", rooms: 131200, fnb: 31100 },
  { day: "Sun", rooms: 102700, fnb: 22600 },
  { day: "Mon", rooms: 96300, fnb: 18900 },
  { day: "Tue", rooms: 105140, fnb: 21340 },
];

export const posOutlets = [
  { name: "Terrace Bar", checks: 48, sales: 9840 },
  { name: "Empirial Grill", checks: 31, sales: 8420 },
  { name: "Room Service", checks: 19, sales: 3080 },
];

export const rand = (value: number) =>
  "R" + value.toLocaleString("en-ZA", { maximumFractionDigits: 0 }).replace(/,/g, " ");
