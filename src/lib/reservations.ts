// Shared mock reservation store. The Rooms calendar, Bookings list, POS register and
// the public hotel website all read and write the same bookings. Bookings added in the
// demo are saved to localStorage; the seed data is regenerated relative to today.
import { useMemo } from "react";
import { bookings, rooms, type Room, type RoomStatus } from "./hotel-data";
import { createPersistedStore } from "./persisted-store";

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

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Operational "today" for this mock property. */
export const TODAY = dayKey(new Date());

export const parseDay = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
};

export const addDays = (key: string, n: number) => {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const shortDay = (key: string) => {
  const d = parseDay(key);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
};

export const weekdayLetter = (key: string) => WEEKDAYS[parseDay(key).getDay()] ?? "";

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

const added = createPersistedStore<Reservation[]>("reservations", []);

export const getReservations = () => [...seed, ...added.get()];

export const addReservation = (r: Omit<Reservation, "id" | "total">) => {
  const created: Reservation = {
    ...r,
    id: `EMP-${5000 + seed.length + added.get().length}`,
    total: r.rate * r.nights,
  };
  added.set((current) => [...current, created]);
  return created;
};

export function useReservations() {
  const extra = added.use();
  return useMemo(() => [...seed, ...extra], [extra]);
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

const roomStatus = createPersistedStore<Record<string, RoomStatus>>("room-status", {});

/** Housekeeping changes made on the Rooms page, keyed by room number. */
export const useRoomStatus = roomStatus.use;
export const setRoomStatus = (number: string, status: RoomStatus) =>
  roomStatus.set((current) => ({ ...current, [number]: status }));
export const roomStatusOf = (room: Room): RoomStatus =>
  roomStatus.get()[room.number] ?? room.status;

export function freeRooms(list: Reservation[], start: string, nights: number, type?: Room["type"]) {
  return rooms.filter(
    (r) =>
      roomStatusOf(r) !== "ooo" &&
      (!type || r.type === type) &&
      isRoomFree(list, r.number, start, nights),
  );
}

export const calendarDays = (from: string, count: number) =>
  Array.from({ length: count }, (_, i) => addDays(from, i));
