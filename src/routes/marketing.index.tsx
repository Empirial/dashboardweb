import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verticals } from "@/lib/marketing-data";

export const Route = createFileRoute("/marketing/")({
  head: () => ({ meta: [
    { title: "Empirial Designs · Five customer experiences" },
    { name: "description", content: "Explore customer-facing websites for Empirial Hotels, Property, Living, Salon and Auto." },
    { property: "og:title", content: "Empirial Designs · Five customer experiences" },
    { property: "og:description", content: "Five distinctive customer websites designed for stays, homes, shopping, beauty and vehicle care." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: MarketingPortfolio,
});

function MarketingPortfolio() {
  return <div className="portfolio min-h-screen bg-background text-foreground">
    <header className="border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <span className="font-display text-xl font-semibold">Empirial Designs</span>
        <Button variant="outline" asChild><Link to="/"><LayoutDashboard />Management</Link></Button>
      </div>
    </header>
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-8 lg:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Our portfolio</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">Five businesses. Five distinct ways to welcome a customer.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Choose an Empirial business to enter its complete customer experience, from first impression to booking or purchase.</p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 md:grid-cols-2 lg:px-8">
        {verticals.map((site, index) => <Link key={site.key} to="/marketing/$vertical" params={{ vertical: site.key }} className={`group relative min-h-[420px] overflow-hidden ${index === 0 ? "md:col-span-2" : ""}`}>
          <img src={site.hero} alt={site.brand} width={1600} height={1067} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
          <div className="portfolio-card-wash absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-primary-foreground sm:p-8">
            <div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-primary-foreground/70">{site.category}</p><h2 className="mt-2 font-display text-4xl font-semibold">{site.brand}</h2><p className="mt-2 max-w-lg text-sm text-primary-foreground/80">{site.sub}</p></div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary transition-transform group-hover:translate-x-1"><ArrowRight className="size-4" /></span>
          </div>
        </Link>)}
      </section>
    </main>
    <footer className="border-t border-line px-5 py-8 text-center text-sm text-muted-foreground">Empirial Designs · 065 185 9143 · info@empirialdesigns.co.za</footer>
  </div>;
}