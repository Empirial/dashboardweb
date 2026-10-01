import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Phone, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLive } from "@/lib/demo-data";
import { offer, verticalByKey } from "@/lib/marketing-data";
import { useProduct } from "@/lib/product";
import {
  advanceTour,
  buildSteps,
  calibrateTour,
  fillExample,
  stopTour,
  useTour,
  type TourContext,
} from "@/lib/tour";

type Box = { top: number; left: number; width: number; height: number };

/** The first element matching one of the selectors that is actually visible on screen. */
const findTarget = (selectors: string[]): HTMLElement | null => {
  for (const selector of selectors) {
    const visible = Array.from(document.querySelectorAll<HTMLElement>(selector)).find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (visible) return visible;
  }
  return null;
};

export function TourOverlay() {
  const tour = useTour();
  const live = useLive();
  const { cart, niche, setNiche } = useProduct();
  const navigate = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [tick, setTick] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const lastTarget = useRef<HTMLElement | null>(null);

  const config = tour.key ? verticalByKey(tour.key) : null;
  const steps = useMemo(() => (config ? buildSteps(config) : []), [config]);
  const step = steps[tour.step];

  const counts = useMemo(
    () => ({
      feed: config ? live.feed.filter((item) => item.niche === config.managementNiche).length : 0,
      sales: config ? live.sales.filter((sale) => sale.niche === config.managementNiche).length : 0,
      cart: cart.reduce((total, line) => total + line.qty, 0),
    }),
    [config, live.feed, live.sales, cart],
  );

  // Re-measure the highlighted element a few times a second so it follows scrolling and dialogs.
  useEffect(() => {
    if (!tour.active) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 250);
    return () => window.clearInterval(timer);
  }, [tour.active]);

  useEffect(() => {
    if (!tour.active || !step) return;
    const element = findTarget(step.targets);
    if (!element) {
      lastTarget.current = null;
      setBox(null);
      return;
    }
    if (lastTarget.current !== element) {
      lastTarget.current = element;
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    const rect = element.getBoundingClientRect();
    setBox((previous) =>
      previous &&
      previous.top === rect.top &&
      previous.left === rect.left &&
      previous.width === rect.width &&
      previous.height === rect.height
        ? previous
        : { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    );
  }, [tick, tour.active, step]);

  // Take the starting counts once, so "a request was sent" means "more than when we began".
  useEffect(() => {
    if (tour.active && !tour.base) calibrateTour(counts);
  }, [tour.active, tour.base, counts]);

  // Owner-side steps need the dashboard to be showing this business.
  useEffect(() => {
    if (
      tour.active &&
      config &&
      !path.startsWith("/marketing") &&
      niche !== config.managementNiche
    ) {
      setNiche(config.managementNiche);
    }
  }, [tour.active, config, path, niche, setNiche]);

  // Move on when the thing the step asked for has actually happened.
  useEffect(() => {
    if (!tour.active || !tour.base || !step || step.manual || step.final) return;
    const context: TourContext = {
      path,
      has: (selector) => findTarget([selector]) !== null,
      counts,
      base: tour.base,
    };
    if (step.done(context)) advanceTour(counts);
  }, [tour.active, tour.base, step, path, counts, tick]);

  if (!tour.active || !config || !step) return null;

  const total = steps.length;
  const mobile = window.innerWidth < 640;

  if (step.final) {
    return (
      <div
        data-tour-ui
        style={{ pointerEvents: "auto" }}
        className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/55 p-4"
      >
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 text-foreground shadow-2xl">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          <div className="mt-5 flex items-end gap-3 border-t border-border pt-4">
            <span className="font-display text-4xl font-semibold">{offer.price}</span>
            <span className="pb-1 text-muted-foreground line-through">{offer.wasPrice}</span>
            <span className="pb-1 text-xs text-muted-foreground">
              {offer.depositPercent}% deposit ({offer.deposit})
            </span>
          </div>
          <div className="mt-5 grid gap-2">
            <Button asChild size="lg">
              <a href="tel:0651859143">
                <Phone />
                Claim a spot · 065 185 9143
              </a>
            </Button>
            <Button variant="secondary" onClick={stopTour}>
              <Check />
              Finish the tour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Keep the card on the opposite side of the screen from the highlighted element.
  const style: CSSProperties = { pointerEvents: "auto" };
  const targetLow = box ? box.top + box.height / 2 > window.innerHeight * 0.5 : false;
  const targetLeft = box ? box.left + box.width / 2 < window.innerWidth / 2 : false;
  if (targetLow) style.top = 16;
  else style.bottom = mobile ? 96 : 16;
  if (mobile) {
    style.left = 12;
    style.right = 12;
  } else {
    if (targetLeft) style.right = 16;
    else style.left = 16;
    style.width = 384;
  }

  return (
    <>
      {box && (
        <div
          aria-hidden
          className="tour-spotlight pointer-events-none fixed z-[99] rounded-xl"
          style={{
            top: box.top - 6,
            left: box.left - 6,
            width: box.width + 12,
            height: box.height + 12,
          }}
        />
      )}
      <div
        data-tour-ui
        role="dialog"
        aria-label="Guided tour"
        style={style}
        className="fixed z-[100] rounded-2xl border border-border bg-background p-4 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Guided tour · Step {tour.step + 1} of {total - 1}
          </p>
          <Button variant="ghost" size="sm" className="-mr-2 h-7 px-2 text-xs" onClick={stopTour}>
            <X className="size-3.5" />
            Exit
          </Button>
        </div>
        <h2 className="mt-2 font-display text-lg font-semibold leading-snug">{step.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

        {!box && step.goto && (
          <p className="mt-3 rounded-xl bg-secondary p-2.5 text-xs text-muted-foreground">
            I can't see that button on this page.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {step.fill && (
            <Button size="sm" variant="outline" onClick={fillExample}>
              <Sparkles />
              {tour.seed > 0 ? "Filled in. Fill again" : "Fill in an example for me"}
            </Button>
          )}
          {step.manual && (
            <Button size="sm" onClick={() => advanceTour(counts)}>
              Next
              <ArrowRight />
            </Button>
          )}
          {!box && step.goto && (
            <Button size="sm" onClick={() => navigate({ to: step.goto as "/" })}>
              Take me there
            </Button>
          )}
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((tour.step + 1) / (total - 1)) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
