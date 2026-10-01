import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import { MonthCalendar } from "@/components/MonthCalendar";
import { bookings as seedBookings, rand, type Booking } from "@/lib/hotel-data";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addFeed, setBookingStatus, useLive } from "@/lib/demo-data";
import {
  TODAY,
  addDays,
  addReservation,
  nightsOf,
  shortDay,
  useReservations,
  type Reservation,
} from "@/lib/reservations";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings · Empirial Hotel Ops" },
      {
        name: "description",
        content:
          "Reservations, arrivals and departures for Empirial Hotel with channel and folio totals.",
      },
      { property: "og:title", content: "Bookings · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Track Empirial Hotel reservations by status, channel and arrival time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bookings,
});

const tabs: Array<Booking["status"] | "All"> = [
  "All",
  "Confirmed",
  "Checked in",
  "Checked out",
  "Pending",
];

const statusPill: Record<Booking["status"], string> = {
  Confirmed: "bg-occupied/10 text-occupied-foreground",
  "Checked in": "bg-clean/10 text-clean-foreground",
  "Checked out": "bg-secondary text-muted-foreground",
  Pending: "bg-dirty/10 text-dirty-foreground",
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

// Bookings made on the website or the register are reservations, not seeded bookings.
const fromReservation = (r: Reservation): Booking => ({
  ref: r.id,
  guest: r.guest,
  initials: initialsOf(r.guest),
  roomType: r.roomType,
  room: r.room,
  nights: r.nights,
  arrival: shortDay(r.start),
  time: "14:00",
  total: r.total,
  status: "Confirmed",
  channel: r.source === "POS" || r.source === "Front desk" ? "Walk-in" : r.source,
});

function Bookings() {
  const [tab, setTab] = useState<Booking["status"] | "All">("All");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const reservations = useReservations();
  const { bookingStatus = {} } = useLive();

  const newest = reservations
    .filter((r) => !seedBookings.some((b) => b.ref === r.id))
    .map(fromReservation)
    .reverse();
  const allBookings = [...newest, ...seedBookings].map((b) => ({
    ...b,
    status: (bookingStatus[b.ref] as Booking["status"] | undefined) ?? b.status,
  }));
  const shown = allBookings
    .filter((b) => tab === "All" || b.status === tab)
    .filter((b) => `${b.guest} ${b.ref} ${b.room}`.toLowerCase().includes(query.toLowerCase()));

  const arrivals = reservations.filter((r) => r.start === TODAY).length;
  const departures = reservations.filter((r) => addDays(r.start, r.nights) === TODAY).length;
  const inHouse = reservations.filter((r) => nightsOf(r).includes(TODAY)).length;
  const bookedValue = reservations
    .filter((r) => r.start >= TODAY && r.start <= addDays(TODAY, 30))
    .reduce((total, r) => total + r.total, 0);

  const changeStatus = (booking: Booking, status: Booking["status"]) => {
    setBookingStatus(booking.ref, status);
    setViewing({ ...booking, status });
    if (status === "Checked in" || status === "Checked out") {
      addFeed(
        "hospitality",
        `Guest ${status.toLowerCase()}`,
        `${booking.guest} · Room ${booking.room}`,
      );
    }
  };

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="Arrivals today" value={arrivals} sub="Due to check in" />
        <Stat label="Departures" value={departures} sub="Checkout by 10:00" />
        <Stat label="In house" value={inHouse} sub="Rooms occupied tonight" />
        <Stat label="Booked value" value={rand(bookedValue)} sub="Arriving in the next 30 days" />
      </div>

      <Panel title="Arrivals · next 30 days">
        <MonthCalendar
          events={reservations.map((r) => ({
            id: r.id,
            date: r.start,
            label: `${r.guest} · Rm ${r.room}`,
            detail: `${r.roomType} · ${r.nights} night${r.nights === 1 ? "" : "s"} · ${r.source}`,
          }))}
          emptyText="No arrivals on this day."
        />
      </Panel>

      <Panel
        title="Reservations"
        action={
          <Button size="sm" onClick={() => setNewOpen(true)}>
            <Plus />
            New booking
          </Button>
        }
      >
        <label className="relative mb-3 block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guest, reference or room"
            aria-label="Search reservations"
            className="w-full rounded-[14px] border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </label>
        <div className="mb-3 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === t ? "bg-brass text-brass-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="divide-y divide-line">
          {shown.map((b) => (
            <button
              key={b.ref}
              onClick={() => setViewing(b)}
              className="flex w-full items-center gap-3 py-2.5 text-left"
            >
              <div className="grid size-9 place-items-center rounded-full bg-secondary font-mono text-[11px] font-medium">
                {b.initials}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[12px] font-medium">{b.guest}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{b.ref}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {b.roomType} {b.room} · {b.nights} night{b.nights > 1 ? "s" : ""} · {b.arrival}{" "}
                  {b.time} · {b.channel}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] font-medium tnum">{rand(b.total)}</div>
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-medium ${statusPill[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
            </button>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-[11px] text-muted-foreground">
              No reservations match.
            </p>
          )}
        </div>
      </Panel>

      <Dialog open={!!viewing} onOpenChange={(next) => !next && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{viewing.guest}</DialogTitle>
                <DialogDescription>
                  {viewing.ref} · {viewing.roomType} {viewing.room}
                </DialogDescription>
              </DialogHeader>
              <dl className="divide-y divide-border rounded-2xl border border-border bg-secondary text-sm">
                {(
                  [
                    ["Arrival", `${viewing.arrival} · ${viewing.time}`],
                    ["Stay", `${viewing.nights} night${viewing.nights > 1 ? "s" : ""}`],
                    ["Channel", viewing.channel],
                    ["Folio total", rand(viewing.total)],
                    ["Status", viewing.status],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-3 py-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Update status</p>
                <div className="flex flex-wrap gap-2">
                  {tabs
                    .filter((t): t is Booking["status"] => t !== "All")
                    .map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={viewing.status === status ? "default" : "outline"}
                        onClick={() => changeStatus(viewing, status)}
                      >
                        {status}
                      </Button>
                    ))}
                </div>
              </div>
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BookRoomDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onConfirm={(draft) => {
          addReservation({ ...draft, source: "Front desk", payment: "Unpaid" });
          setNewOpen(false);
        }}
      />
    </AppShell>
  );
}
