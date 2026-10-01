import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, CreditCard, Delete, Minus, Plus, ScanLine, X } from "lucide-react";
import { AppShell, Panel, Segmented } from "@/components/AppShell";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import { Button } from "@/components/ui/button";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";
import { recordSale } from "@/lib/demo-data";
import { addReservation, shortDay } from "@/lib/reservations";
import { rand } from "@/lib/hotel-data";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "Register · Empirial POS" },
      { name: "description", content: "Fast checkout for products, services, stays, and jobs." },
      { property: "og:title", content: "Register · Empirial POS" },
      {
        property: "og:description",
        content: "Fast checkout for products, services, stays, and jobs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});
type Payment = "Card" | "Cash";

function Register() {
  const { niche, cart, setCart, addToCart } = useProduct();
  const config = nicheConfigs[niche];
  const [category, setCategory] = useState(config.categories[0] ?? "All");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [tender, setTender] = useState("");
  const [receipt, setReceipt] = useState("");
  const [bookOpen, setBookOpen] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [split, setSplit] = useState(false);
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  const service = ["hospitality", "food"].includes(niche) ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + service;
  const tendered = Number(tender) || 0;
  const change = tendered - total;
  const updateQty = (id: string, delta: number) =>
    setCart((current) =>
      current.flatMap((line) =>
        line.id === id
          ? line.qty + delta > 0
            ? [{ ...line, qty: line.qty + delta }]
            : []
          : [line],
      ),
    );
  const settle = () => {
    if (!payment || !cart.length || (payment === "Cash" && change < 0)) return;
    recordSale(
      niche,
      total,
      payment,
      cart.reduce((sum, line) => sum + line.qty, 0),
    );
    setReceipt(
      `${rand(total)} paid by ${payment.toLowerCase()}${payment === "Cash" ? ` · change ${rand(change)}` : ""}`,
    );
    setCart([]);
    setPayment(null);
    setTender("");
  };
  const actionLabel =
    niche === "hospitality"
      ? "Sell a stay"
      : niche === "food"
        ? "Open a table"
        : niche === "beauty"
          ? "Sell a service"
          : niche === "automotive"
            ? "Load ready job"
            : niche === "cleaning"
              ? "Charge one-off job"
              : "Scan product";
  const action = () => {
    if (niche === "hospitality") setBookOpen(true);
    else
      addToCart({
        id: `${niche}-action`,
        name: actionLabel.replace(/^(Sell|Open|Load|Charge) /, ""),
        price: niche === "automotive" ? 4820 : niche === "cleaning" ? 1850 : 680,
        note: `Added from ${config.shortLabel}`,
      });
  };
  const onBarcode = () => {
    const found =
      config.catalog.find((item) => item.id.toLowerCase() === barcode.toLowerCase()) ??
      config.catalog[0];
    if (found) addToCart(found);
    setBarcode("");
  };
  return (
    <AppShell title="Register" workspace>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1">
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold">Register</h2>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            Fast checkout for {config.business}.
          </p>
        </div>
        <Button size="sm" onClick={action} className="shrink-0">
          {niche === "retail" ? <ScanLine /> : <Plus />}
          {actionLabel}
        </Button>
      </div>
      <div
        className={`pos-workspace-grid ${niche === "retail" ? "pos-workspace-grid-retail" : ""}`}
      >
        {niche === "retail" && (
          <Panel className="pos-bar">
            <div className="flex gap-2">
              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onBarcode()}
                placeholder="Scan or type SKU"
                className="min-w-0 flex-1 rounded-[14px] border border-border bg-secondary px-4 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <Button onClick={onBarcode}>
                <ScanLine />
                Add
              </Button>
            </div>
          </Panel>
        )}
        <div className="pos-columns">
          <Panel
            className="pos-catalog"
            title="Catalog"
            action={
              <Segmented value={category} options={config.categories} onChange={setCategory} />
            }
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {config.catalog
                .filter((item) => item.category === category)
                .map((item) => (
                  <Button
                    key={item.id}
                    variant="secondary"
                    onClick={() => addToCart(item)}
                    className="h-20 flex-col items-start whitespace-normal p-3 text-left"
                  >
                    <span className="line-clamp-2 text-sm font-medium">{item.name}</span>
                    <span className="mt-auto font-display text-xs tnum text-muted-foreground">
                      {rand(item.price)}
                    </span>
                  </Button>
                ))}
            </div>
          </Panel>
          <Panel
            className="pos-check"
            title="Current check"
            action={
              cart.length ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCart([])}
                  aria-label="Clear check"
                >
                  <X />
                </Button>
              ) : undefined
            }
          >
            <div className="pos-check-lines">
              {cart.length === 0 ? (
                <div className="grid h-full min-h-20 place-items-center text-center">
                  <p className="text-sm text-muted-foreground">
                    {receipt ? `Settled · ${receipt}` : "Choose an item to begin."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cart.map((line) => (
                    <div key={line.id} className="flex items-center gap-3 py-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{line.name}</span>
                        {line.note && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {line.note}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center rounded-full border border-border bg-secondary">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQty(line.id, -1)}
                          className="size-8 rounded-full"
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-xs tnum">{line.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQty(line.id, 1)}
                          className="size-8 rounded-full"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="w-18 text-right font-display text-xs font-semibold tnum">
                        {rand(line.price * line.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tnum">{rand(subtotal)}</span>
              </div>
              {service > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Service charge · 10%</span>
                  <span className="tnum">{rand(service)}</span>
                </div>
              )}
              <div className="flex items-end justify-between pt-2">
                <span className="font-medium">Total</span>
                <span className="font-display text-2xl font-semibold tnum">{rand(total)}</span>
              </div>
            </div>
            {niche === "food" && cart.length > 0 && (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-secondary p-3">
                <span className="text-xs">Split this check</span>
                <Button
                  size="sm"
                  variant={split ? "default" : "outline"}
                  onClick={() => setSplit(!split)}
                >
                  {split ? "2 equal checks" : "Split bill"}
                </Button>
              </div>
            )}
            {!payment ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button disabled={!cart.length} onClick={() => setPayment("Card")}>
                  <CreditCard />
                  Card
                </Button>
                <Button
                  disabled={!cart.length}
                  variant="secondary"
                  onClick={() => setPayment("Cash")}
                >
                  <Banknote />
                  Cash
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3 rounded-3xl border border-border bg-secondary p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{payment} checkout</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPayment(null)}
                    className="size-8"
                  >
                    <X />
                  </Button>
                </div>
                {payment === "Cash" ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"].map((key) => (
                        <Button
                          key={key}
                          variant="outline"
                          onClick={() => setTender((value) => value + key)}
                          className="h-11 text-base"
                        >
                          {key}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setTender((value) => value.slice(0, -1))}
                        className="h-11"
                      >
                        <Delete />
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        ["Exact", total],
                        ["R200", 200],
                        ["R500", 500],
                        ["R1 000", 1000],
                      ].map(([label, value]) => (
                        <Button
                          key={String(label)}
                          variant="ghost"
                          size="sm"
                          onClick={() => setTender(String(value))}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tendered / Change</span>
                      <span className="tnum">
                        {rand(tendered)} / {change < 0 ? `Short ${rand(-change)}` : rand(change)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="py-5 text-center text-sm text-muted-foreground">
                    Confirm the approved card payment.
                  </p>
                )}
                <Button
                  className="w-full"
                  disabled={payment === "Cash" && change < 0}
                  onClick={settle}
                >
                  Confirm {payment.toLowerCase()} payment
                </Button>
              </div>
            )}
          </Panel>
        </div>
      </div>
      <BookRoomDialog
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        source="POS"
        confirmLabel="Add stay to check"
        onConfirm={(draft) => {
          const created = addReservation({ ...draft, source: "POS", payment: "Unpaid" });
          addToCart({
            id: created.id,
            name: `Room ${created.room} · ${created.nights} nights`,
            price: created.total,
            note: `${created.guest} · ${shortDay(created.start)}`,
          });
          setBookOpen(false);
        }}
      />
    </AppShell>
  );
}
