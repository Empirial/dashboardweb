// Shared mock reservation store. Lives in memory so the Rooms calendar and the
// POS register both read and write the same bookings during a session.
import { useEffect, useState } from "react";
import { bookings, rooms, type Room } from "./hotel-data";

export type Reservation = {
  id: string;
  room: string;
  roomType: Room["type"];
  guest: string;
  /** First night, yyyy-mm-dd */
  start: string;
  nights: number;
  rate: number;
  total: number;
  source: "Front desk" | "POS" | "Direct" | "Booking.com" | "Walk-in" | "Corporate";
  payment?: "Card" | "Cash" | "Charged to room" | "Unpaid";
};

/** Operational "today" for this mock property. */
export const TODAY = "2026-03-12";

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseDay = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
};

export const addDays = (key: string, n: number) => {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

export const shortDay = (key: string) =>
  parseDay(key).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });

export const weekdayLetter = (key: string) =>
  parseDay(key).toLocaleDateString("en-ZA", { weekday: "short" }).slice(0, 2);

export const isWeekend = (key: string) => [0, 6].includes(parseDay(key).getDay());

/** Every night covered by a reservation. */
export const nightsOf = (r: Reservation) =>
  Array.from({ length: r.nights }, (_, i) => addDays(r.start, i));

const roomOf = (num: string) => rooms.find((r) => r.number === num);

const seed: Reservation[] = [
  ...bookings.map((b, i) => {
    const room = roomOf(b.room);
    const offset = b.status === "Checked out" ? -4 : b.status === "Checked in" ? -2 : 0;
    return {
      id: b.ref,
      room: b.room,
      roomType: room?.type ?? b.roomType,
      guest: b.guest,
      start: addDays(TODAY, offset - (i % 2)),
      nights: b.nights,
      rate: room?.rate ?? Math.round(b.total / b.nights),
      total: b.total,
      source: b.channel,
      payment: b.status === "Checked out" ? ("Card" as const) : ("Unpaid" as const),
    };
  }),
  {
    id: "EMP-4901",
    room: "205",
    roomType: "Deluxe",
    guest: "N. Maseko",
    start: addDays(TODAY, 3),
    nights: 2,
    rate: 1840,
    total: 3680,
    source: "Direct",
    payment: "Unpaid",
  },
  {
    id: "EMP-4902",
    room: "302",
    roomType: "Suite",
    guest: "D. Fourie",
    start: addDays(TODAY, 6),
    nights: 3,
    rate: 3400,
    total: 10200,
    source: "Corporate",
    payment: "Unpaid",
  },
  {
    id: "EMP-4903",
    room: "104",
    roomType: "Twin",
    guest: "K. Naidoo",
    start: addDays(TODAY, 1),
    nights: 4,
    rate: 1450,
    total: 5800,
    source: "Booking.com",
    payment: "Unpaid",
  },
];

let state: Reservation[] = seed;
const listeners = new Set<(r: Reservation[]) => void>();

const emit = () => listeners.forEach((l) => l(state));

export const getReservations = () => state;

export const addReservation = (r: Omit<Reservation, "id" | "total">) => {
  const created: Reservation = {
    ...r,
    id: `EMP-${5000 + state.length}`,
    total: r.rate * r.nights,
  };
  state = [...state, created];
  emit();
  return created;
};

export function useReservations() {
  const [value, setValue] = useState(state);
  useEffect(() => {
    listeners.add(setValue);
    setValue(state);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
}

/** Nights (yyyy-mm-dd) that a given room is already sold, mapped to the guest. */
export function bookedNights(list: Reservation[], room: string) {
  const map = new Map<string, Reservation>();
  for (const r of list.filter((x) => x.room === room)) {
    for (const night of nightsOf(r)) map.set(night, r);
  }
  return map;
}

export function isRoomFree(list: Reservation[], room: string, start: string, nights: number) {
  const taken = bookedNights(list, room);
  return Array.from({ length: nights }, (_, i) => addDays(start, i)).every((n) => !taken.has(n));
}

export function freeRooms(list: Reservation[], start: string, nights: number, type?: Room["type"]) {
  return rooms.filter(
    (r) =>
      r.status !== "ooo" &&
      (!type || r.type === type) &&
      isRoomFree(list, r.number, start, nights),
  );
}

export const calendarDays = (from: string, count: number) =>
  Array.from({ length: count }, (_, i) => addDays(from, i));
