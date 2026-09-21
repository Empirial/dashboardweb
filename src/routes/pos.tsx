import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel } from "@/components/AppShell";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import {
  occupiedRooms,
  posCategories,
  posItems,
  rand,
  type PosCategory,
  type PosItem,
} from "@/lib/hotel-data";
import { addReservation, shortDay } from "@/lib/reservations";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "Register · Empirial Hotel POS" },
      {
        name: "description",
        content:
          "Empirial Hotel point of sale: ring up food and drink, book a room stay and check out by card or cash.",
      },
      { property: "og:title", content: "Register · Empirial Hotel POS" },
      {
        property: "og:description",
        content: "Ring up items, sell a room stay and settle the check by card or cash.",
      },
    ],
  }),
  component: Pos,
});

type Line = {
  id: string;
  name: string;
  note?: string;
  price: number;
  qty: number;
  kind: "item" | "stay";
};

type Payment = "Card" | "Cash";

function Pos() {
  const [category, setCategory] = useState<PosCategory>("Drinks");
  const [lines, setLines] = useState<Line[]>([
    { id: "d2", name: "Amarula", price: 65, qty: 2, kind: "item" },
    { id: "d3", name: "Fresh Juice", price: 45, qty: 1, kind: "item" },
  ]);
  const [room, setRoom] = useState(occupiedRooms[5]?.number ?? occupiedRooms[0]?.number ?? "209");
  const [bookOpen, setBookOpen] = useState(false);
  const [checkout, setCheckout] = useState<Payment | null>(null);
  const [tender, setTender] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);

  const addItem = (item: PosItem) => {
    setReceipt(null);
    setLines((prev) => {
      const found = prev.find((l) => l.id === item.id);
      if (found) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, kind: "item" }];
    });
  };

  const remove = (id: string) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l])),
    );
  };

  const hasStay = lines.some((l) => l.kind === "stay");
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const service = Math.round(lines.filter((l) => l.kind === "item").reduce((s, l) => s + l.price * l.qty, 0) * 0.1);
  const total = subtotal + service;
  const tendered = Number(tender.replace(/[^\d.]/g, "")) || 0;
  const change = tendered - total;

  const finish = (method: Payment | "Room") => {
    if (lines.length === 0) return;
    const note =
      method === "Room"
        ? `${rand(total)} charged to room ${room}`
        : method === "Cash"
          ? `${rand(total)} cash · change ${rand(Math.max(0, change))}`
          : `${rand(total)} paid by card`;
    setReceipt(note);
    setLines([]);
    setCheckout(null);
    setTender("");
  };

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Panel
            title="POS · Bar & Kitchen"
            action={
              <button
                onClick={() => setBookOpen(true)}
                className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground"
              >
                Sell a room stay
              </button>
            }
          >
            <div className="mb-2 flex gap-1 overflow-x-auto">
              {posCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {posItems
                .filter((i) => i.category === category)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className="rounded-lg border border-border bg-secondary px-2.5 py-2 text-left transition-transform active:scale-95"
                  >
                    <div className="text-[12px] font-medium">{item.name}</div>
                    <div className="font-mono text-[11px] tnum text-muted-foreground">
                      {rand(item.price)}
                    </div>
                  </button>
                ))}
            </div>
          </Panel>
        </div>

        <Panel title="Live Check">
          <div className="mb-3 flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Room
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="flex-1 rounded-md border border-border bg-secondary px-2 py-1.5 font-mono text-[11px]"
            >
              {occupiedRooms.map((r) => (
                <option key={r.number} value={r.number}>
                  {r.number} · {r.guest}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-ink p-3 text-paper">
            <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-paper/50">
              Check · Rm {room}
            </div>
            {lines.length === 0 ? (
              <p className="py-4 text-center text-[11px] text-paper/50">
                {receipt ? `Settled · ${receipt}` : "Tap an item to start a check."}
              </p>
            ) : (
              <div className="space-y-1.5 text-[12px]">
                {lines.map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => remove(l.id)}
                      className="grid size-5 shrink-0 place-items-center rounded bg-paper/10 text-[11px]"
                      aria-label={`Remove ${l.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">
                        {l.qty} × {l.name}
                      </span>
                      {l.note && <span className="block text-[10px] text-paper/50">{l.note}</span>}
                    </span>
                    <span className="font-mono tnum">{rand(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="my-2.5 h-px bg-paper/15" />
            <div className="space-y-1 text-[11px] text-paper/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tnum">{rand(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service 10% (F&amp;B)</span>
                <span className="font-mono tnum">{rand(service)}</span>
              </div>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-[11px] text-paper/60">Total</span>
              <span className="font-mono text-xl font-semibold tnum">{rand(total)}</span>
            </div>

            {checkout === null ? (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setCheckout("Card")}
                  disabled={lines.length === 0}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-[12px] font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
                >
                  Checkout
                </button>
                <button
                  onClick={() => finish("Room")}
                  disabled={lines.length === 0 || hasStay}
                  title={hasStay ? "Room stays cannot be charged to a room" : undefined}
                  className="rounded-lg bg-paper/10 px-3 py-2.5 text-[12px] font-medium transition-transform active:scale-95 disabled:opacity-40"
                >
                  Charge to Room
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                <div className="flex gap-2">
                  {(["Card", "Cash"] as Payment[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setCheckout(m)}
                      className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-colors ${
                        checkout === m ? "bg-primary text-primary-foreground" : "bg-paper/10 text-paper"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {checkout === "Cash" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-paper/50">
                        Tendered
                      </span>
                      <input
                        value={tender}
                        onChange={(e) => setTender(e.target.value)}
                        inputMode="decimal"
                        placeholder="0"
                        className="flex-1 rounded-md bg-paper/10 px-2 py-1.5 font-mono text-[12px] tnum text-paper outline-none placeholder:text-paper/30"
                      />
                    </div>
                    <div className="flex gap-1">
                      {[total, 200, 500, 1000].map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setTender(String(v))}
                          className="flex-1 rounded-md bg-paper/10 py-1.5 font-mono text-[11px] tnum"
                        >
                          {i === 0 ? "Exact" : rand(v)}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-paper/60">Change due</span>
                      <span className={`font-mono tnum ${change < 0 ? "text-dirty" : ""}`}>
                        {change < 0 ? `short ${rand(-change)}` : rand(change)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-paper/50">
                    Tap the card machine, then confirm the approval below.
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => finish(checkout)}
                    disabled={checkout === "Cash" && change < 0}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-[12px] font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {checkout === "Cash" ? "Confirm cash payment" : "Confirm card approval"}
                  </button>
                  <button
                    onClick={() => {
                      setCheckout(null);
                      setTender("");
                    }}
                    className="rounded-lg bg-paper/10 px-3 py-2.5 text-[12px] font-medium"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {receipt && (
            <p className="mt-3 rounded-md border border-border bg-secondary px-2.5 py-2 text-[11px] text-muted-foreground">
              Last sale · {receipt}
            </p>
          )}
        </Panel>
      </div>

      {bookOpen && (
        <BookRoomDialog
          open={bookOpen}
          source="POS"
          confirmLabel="Add stay to check"
          onClose={() => setBookOpen(false)}
          onConfirm={(draft) => {
            const created = addReservation({ ...draft, source: "POS", payment: "Unpaid" });
            setLines((prev) => [
              ...prev,
              {
                id: created.id,
                name: `Rm ${created.room} · ${created.nights} night${created.nights > 1 ? "s" : ""}`,
                note: `${created.guest} · from ${shortDay(created.start)} · ${created.id}`,
                price: created.total,
                qty: 1,
                kind: "stay",
              },
            ]);
            setRoom(created.room);
            setBookOpen(false);
            setReceipt(null);
          }}
        />
      )}
    </AppShell>
  );
}
