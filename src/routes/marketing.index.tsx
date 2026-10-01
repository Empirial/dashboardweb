import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, verticals } from "@/lib/marketing-data";
import { pageMeta } from "@/lib/page-meta";

const numberWords = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const count = numberWords[verticals.length] ?? String(verticals.length);

export const Route = createFileRoute("/marketing/")({
  head: () =>
    pageMeta(
      `Empirial Designs · ${count} customer experiences`,
      "Customer-facing websites and back-office systems for hotels, restaurants, retail, salons, auto workshops, property and cleaning businesses.",
      "summary_large_image",
    ),
  component: MarketingPortfolio,
});

function MarketingPortfolio() {
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
              <Link to="/">
                <LayoutDashboard />
                Management
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-8 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Our portfolio
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
            {count} businesses. {count} distinct ways to welcome a customer.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Choose an Empirial business to enter its complete customer experience. Book, buy or
            enquire, then press Management to watch the request arrive in that business's back
            office.
          </p>
        </section>
        <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 md:grid-cols-2 lg:px-8">
          {verticals.map((site, index) => (
            <Link
              key={site.key}
              to="/marketing/$vertical"
              params={{ vertical: site.key }}
              className={`group relative min-h-[420px] overflow-hidden ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <img
                src={site.hero}
                alt={site.brand}
                width={1600}
                height={1067}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="portfolio-card-wash absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-primary-foreground sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-primary-foreground/70">
                    {site.category}
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-semibold">{site.brand}</h2>
                  <p className="mt-2 max-w-lg text-sm text-primary-foreground/80">{site.sub}</p>
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
              Start with a website. Grow into a complete system.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Once-off build price plus a simple monthly fee. Every package is tailored to your
              business, and prices exclude VAT.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex flex-col border bg-background p-7 ${plan.featured ? "border-foreground" : "border-line"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                    {plan.featured && (
                      <span className="bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-background">
                        Most chosen
                      </span>
                    )}
                  </div>
                  <p className="mt-5 font-display text-4xl font-semibold">{plan.price}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.monthly}</p>
                  <p className="mt-5 text-sm leading-relaxed">{plan.blurb}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={plan.featured ? "default" : "outline"} className="mt-8">
                    <a href="tel:0651859143">Call 065 185 9143</a>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line px-5 py-8 text-center text-sm text-muted-foreground">
        Empirial Designs · 065 185 9143 · info@empirialdesigns.co.za
      </footer>
    </div>
  );
}
