import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel } from "@/components/AppShell";
import {
  occupiedRooms,
  posCategories,
  posItems,
  rand,
  type PosCategory,
  type PosItem,
} from "@/lib/hotel-data";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "Register · Empirial Hotel POS" },
      {
        name: "description",
        content:
          "Empirial Hotel point of sale: tap bar, kitchen and room-service items and charge the check to a room or card.",
      },
      { property: "og:title", content: "Register · Empirial Hotel POS" },
      {
        property: "og:description",
        content: "Ring up bar, kitchen and room-service items and charge to room or card.",
      },
    ],
  }),
  component: Pos,
});

type Line = { item: PosItem; qty: number };

function Pos() {
  const [category, setCategory] = useState<PosCategory>("Drinks");
  const [lines, setLines] = useState<Line[]>([
    { item: posItems.find((i) => i.id === "d2")!, qty: 2 },
    { item: posItems.find((i) => i.id === "d3")!, qty: 1 },
  ]);
  const [room, setRoom] = useState(occupiedRooms[5]?.number ?? occupiedRooms[0]?.number ?? "209");
  const [receipt, setReceipt] = useState<string | null>(null);

  const add = (item: PosItem) => {
    setReceipt(null);
    setLines((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { item, qty: 1 }];
    });
  };

  const remove = (id: string) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.item.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l])),
    );
  };

  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const service = Math.round(subtotal * 0.1);
  const total = subtotal + service;

  const settle = (method: string) => {
    if (lines.length === 0) return;
    setReceipt(`${rand(total)} ${method}`);
    setLines([]);
  };

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Panel title="POS · Bar & Kitchen">
          <div className="mb-2 flex gap-1 overflow-x-auto">
            {posCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  category === c
                    ? "bg-brass text-brass-foreground"
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
                  onClick={() => add(item)}
                  className="rounded-lg bg-secondary px-2.5 py-2 text-left ring-1 ring-border transition-transform active:scale-95 active:bg-accent"
                >
                  <div className="text-[12px] font-medium">{item.name}</div>
                  <div className="font-mono text-[11px] tnum text-muted-foreground">
                    {rand(item.price)}
                  </div>
                </button>
              ))}
          </div>
        </Panel>

        <Panel title="Live Check">
          <div className="mb-3 flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Room
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="flex-1 rounded-md bg-secondary px-2 py-1.5 font-mono text-[11px] ring-1 ring-border"
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
                {receipt ? `Settled ${receipt}` : "Tap an item to start a check."}
              </p>
            ) : (
              <div className="space-y-1.5 text-[12px]">
                {lines.map((l) => (
                  <div key={l.item.id} className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => remove(l.item.id)}
                      className="grid size-5 shrink-0 place-items-center rounded bg-paper/10 text-[11px]"
                      aria-label={`Remove one ${l.item.name}`}
                    >
                      −
                    </button>
                    <span className="flex-1 truncate">
                      {l.qty} × {l.item.name}
                    </span>
                    <span className="font-mono tnum">{rand(l.item.price * l.qty)}</span>
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
                <span>Service 10%</span>
                <span className="font-mono tnum">{rand(service)}</span>
              </div>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-[11px] text-paper/60">Total</span>
              <span className="font-mono text-xl font-semibold tnum">{rand(total)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => settle(`charged to room ${room}`)}
                className="flex-1 rounded-lg bg-brass py-2.5 text-[12px] font-semibold text-brass-foreground transition-transform active:scale-95"
              >
                Charge to Room
              </button>
              <button
                onClick={() => settle("paid by card")}
                className="rounded-lg bg-paper/10 px-3 py-2.5 text-[12px] font-medium transition-transform active:scale-95"
              >
                Card
              </button>
              <button
                onClick={() => settle("paid cash")}
                className="rounded-lg bg-paper/10 px-3 py-2.5 text-[12px] font-medium transition-transform active:scale-95"
              >
                Cash
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
