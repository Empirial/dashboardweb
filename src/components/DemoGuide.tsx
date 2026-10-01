import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verticalByKey, verticals, type VerticalKey } from "@/lib/marketing-data";
import { useProduct } from "@/lib/product";
import { nicheVertical, startTour, useTour } from "@/lib/tour";

/** Starts a guided tour on a business's website. Used by the launcher and the landing page. */
export function useStartTour() {
  const navigate = useNavigate();
  return (key: VerticalKey) => {
    startTour(key);
    void navigate({ to: "/marketing/$vertical", params: { vertical: key } });
  };
}

/** Floating launcher for the guided tour. Hidden while a tour is running. */
export function DemoGuide() {
  const [open, setOpen] = useState(false);
  const { niche } = useProduct();
  const tour = useTour();
  const begin = useStartTour();
  if (tour.active) return null;

  const current = verticalByKey(nicheVertical[niche]);
  const start = (key: VerticalKey) => {
    setOpen(false);
    begin(key);
  };

  return (
    <div className="fixed bottom-22 right-3 z-[45] md:bottom-5 md:right-5">
      {open && (
        <div className="panel mb-2 w-[min(22rem,calc(100vw-1.5rem))] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Guided tour
              </p>
              <h2 className="mt-1 font-display text-base font-semibold">
                See it work, step by step
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X />
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Book as a customer, then run the business as the owner. It takes about three minutes.
          </p>
          <Button className="mt-3 w-full" onClick={() => start(current.key)}>
            Start the {current.tab} tour
            <ArrowRight />
          </Button>
          <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            Or pick a business
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {verticals
              .filter((site) => site.key !== current.key)
              .map((site) => (
                <Button key={site.key} size="sm" variant="outline" onClick={() => start(site.key)}>
                  {site.tab}
                </Button>
              ))}
          </div>
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
        Guided tour
      </Button>
    </div>
  );
}
