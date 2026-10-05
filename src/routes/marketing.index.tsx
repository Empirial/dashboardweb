import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import { useStartTour } from "@/components/DemoGuide";
import { Button } from "@/components/ui/button";
import { offer, verticals } from "@/lib/marketing-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/marketing/")({
  head: () =>
    pageMeta(
      "Empirial Designs · Get a complete business system",
      "A demo of a website and back-office system built for hotels, restaurants, retail, salons, auto workshops, property and cleaning businesses.",
      "summary_large_image",
    ),
  component: MarketingPortfolio,
});

const benefits = [
  "Customers book or buy on your own website",
  "Every booking lands in your dashboard automatically",
  "Take card and cash payments at the register",
  "Track stock, jobs, appointments and staff in one place",
  "See sales and customers in simple reports",
  "Runs on your phone, tablet or laptop, whenever you need it",
];

function MarketingPortfolio() {
  const begin = useStartTour();
  return (
    <div className="portfolio min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <span className="font-display text-xl font-semibold">Empirial Designs</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" asChild>
              <a href="#pricing">Pricing</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/overview">
                <LayoutDashboard />
                Management
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-6 lg:px-8 lg:pb-12 lg:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Our portfolio
          </p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
                Get a complete business system
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                This is a demo of how you could run your business in your own time. Pick an industry
                below, book or buy as a customer would, then press Management to watch the request
                arrive in the back office.
              </p>
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Take the guided tour
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {verticals.map((site) => (
                    <Button
                      key={site.key}
                      size="sm"
                      variant="outline"
                      onClick={() => begin(site.key)}
                    >
                      {site.tab}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <ul className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm leading-snug">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-background">
                    <Check className="size-3" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 md:grid-cols-2 lg:px-8">
          {verticals.map((site, index) => (
            <Link
              key={site.key}
              to="/marketing/$vertical"
              params={{ vertical: site.key }}
              className={`group relative min-h-[440px] overflow-hidden ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <img
                src={site.hero}
                alt={site.brand}
                width={1600}
                height={1067}
                style={{ objectPosition: site.heroPosition }}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="portfolio-card-wash absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-primary-foreground sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-primary-foreground/70">
                    {site.category}
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-semibold">{site.brand}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
                    <span className="font-semibold text-primary-foreground">
                      The problem it solves:{" "}
                    </span>
                    {site.solves}
                  </p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary transition-transform group-hover:translate-x-1">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>
        <section id="pricing" className="border-t border-line bg-secondary/40">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pricing
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              One complete system. One launch price.
            </h2>
            <article className="mt-10 grid overflow-hidden border border-foreground bg-background lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-foreground p-8 text-background sm:p-10">
                <span className="inline-block border border-background/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
                  First {offer.totalSpots} businesses · only {offer.spotsLeft} spots left
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold">{offer.name}</h3>
                <p className="mt-6 flex items-end gap-4">
                  <span className="font-display text-6xl font-semibold leading-none sm:text-7xl">
                    {offer.price}
                  </span>
                  <span className="pb-1 text-xl text-background/55 line-through">
                    {offer.wasPrice}
                  </span>
                </p>
                <p className="mt-3 text-sm text-background/70">
                  Launch price in rand. Normally {offer.wasPrice}.
                </p>
                <p className="mt-6 text-sm">
                  Secure your spot with a {offer.depositPercent}% deposit of{" "}
                  <strong>{offer.deposit}</strong>.
                </p>
                <div
                  className="mt-6"
                  aria-label={`${offer.spotsLeft} of ${offer.totalSpots} spots left`}
                >
                  <div className="flex gap-1.5">
                    {Array.from({ length: offer.totalSpots }, (_, index) => (
                      <span
                        key={index}
                        className={`h-2 flex-1 ${index < offer.totalSpots - offer.spotsLeft ? "bg-background/25" : "bg-background"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-background/70">
                    {offer.totalSpots - offer.spotsLeft} of {offer.totalSpots} spots taken
                  </p>
                </div>
              </div>
              <div className="flex flex-col p-8 sm:p-10">
                <p className="text-base leading-relaxed">{offer.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 self-start">
                  <a href="tel:0651859143">
                    Claim a spot · 065 185 9143
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </section>
      </main>
      <footer className="border-t border-line px-5 py-8 text-center text-sm text-muted-foreground">
        Empirial Designs · 065 185 9143 · info@empirialdesigns.co.za
      </footer>
    </div>
  );
}
