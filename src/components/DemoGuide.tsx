import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct, type Niche } from "@/lib/product";

type Step = { title: string; text: string; to: string };

const guides: Record<Niche, Step[]> = {
  hospitality: [
    {
      title: "Book a stay on the website",
      text: "Pick dates and a room on the Hotel site.",
      to: "/marketing/hotel",
    },
    {
      title: "See it on the room board",
      text: "The booking appears on the 30-day calendar.",
      to: "/rooms",
    },
    { title: "Charge a meal", text: "Add items or a stay to the register and settle.", to: "/pos" },
    {
      title: "Watch the numbers move",
      text: "Reports include every sale you just rang up.",
      to: "/reports",
    },
  ],
  food: [
    {
      title: "Reserve a table online",
      text: "Request a table on the Restaurant site.",
      to: "/marketing/restaurant",
    },
    {
      title: "Find it on the floor plan",
      text: "The reservation shows up as a table record.",
      to: "/floor-plan",
    },
    { title: "Ring up a check", text: "Add dishes, split the bill and take payment.", to: "/pos" },
    {
      title: "Move a kitchen ticket",
      text: "Advance a ticket from queued to ready.",
      to: "/kitchen",
    },
  ],
  retail: [
    {
      title: "Place an order online",
      text: "Buy a product on the Retail site.",
      to: "/marketing/retail",
    },
    {
      title: "Check inventory",
      text: "Stock for that product drops immediately.",
      to: "/inventory",
    },
    { title: "Scan a SKU", text: "Type a SKU at the register and take payment.", to: "/pos" },
    {
      title: "Review sales",
      text: "Online and in-store sales both land in Reports.",
      to: "/reports",
    },
  ],
  beauty: [
    {
      title: "Book a chair online",
      text: "Reserve a service on the Salon site.",
      to: "/marketing/salon",
    },
    {
      title: "See the appointment",
      text: "It appears first in today's appointment list.",
      to: "/appointments",
    },
    { title: "Sell a package", text: "Send a package straight to the register.", to: "/packages" },
    { title: "Open the client", text: "The new client is already in Customers.", to: "/customers" },
  ],
  automotive: [
    {
      title: "Book a car in",
      text: "Request a workshop slot on the Auto site.",
      to: "/marketing/auto",
    },
    { title: "Open the job card", text: "A new job card is waiting in the workshop.", to: "/jobs" },
    { title: "Convert a quote", text: "Turn an approved quote into an invoice.", to: "/quotes" },
    {
      title: "Check billed work",
      text: "Reports reflect what the register has settled.",
      to: "/reports",
    },
  ],
  cleaning: [
    {
      title: "Request a clean online",
      text: "Submit a request on the Cleaning site.",
      to: "/marketing/cleaning",
    },
    {
      title: "See it scheduled",
      text: "The request is at the top of the schedule.",
      to: "/scheduling",
    },
    { title: "Run recurring billing", text: "Process the next billing batch.", to: "/billing" },
    { title: "Check crew capacity", text: "Balance the day across crews.", to: "/crew" },
  ],
};

export function DemoGuide() {
  const [open, setOpen] = useState(false);
  const { niche } = useProduct();

  return (
    <div className="fixed bottom-22 right-3 z-[45] md:bottom-5 md:right-5">
      {open && (
        <div className="panel mb-2 w-[min(22rem,calc(100vw-1.5rem))] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Demo guide
              </p>
              <h2 className="mt-1 font-display text-base font-semibold">Try this walkthrough</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setOpen(false)}
              aria-label="Close guide"
            >
              <X />
            </Button>
          </div>
          <ol className="mt-3 space-y-1">
            {guides[niche].map((step, index) => (
              <li key={step.title}>
                <Link
                  to={step.to as "/"}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-secondary text-[11px] font-semibold">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{step.title}</span>
                    <span className="block text-xs text-muted-foreground">{step.text}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
            Everything you do is saved in this browser. Reset it any time in Settings.
          </p>
        </div>
      )}
      <Button
        size="sm"
        className="ml-auto flex shadow-lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <Compass />
        Demo guide
      </Button>
    </div>
  );
}
