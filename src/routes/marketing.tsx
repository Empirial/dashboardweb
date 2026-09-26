import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, KeyRound, Phone, Mail, Scissors, ShoppingBasket, SprayCan, Wrench, X } from "lucide-react";
import { verticals, verticalByKey, type VerticalKey } from "@/lib/marketing-data";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Empirial Designs · Point of sale built for your kind of business" },
      { name: "description", content: "One system for hotels, property services, shops, salons and workshops. Pick your business and see how Empirial runs its day." },
      { property: "og:title", content: "Empirial Designs · Point of sale built for your kind of business" },
      { property: "og:description", content: "One system for hotels, property services, shops, salons and workshops. Pick your business and see how Empirial runs its day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketingPage,
});

const icons: Record<VerticalKey, typeof KeyRound> = {
  hotel: KeyRound,
  property: SprayCan,
  retail: ShoppingBasket,
  salon: Scissors,
  auto: Wrench,
};

function MarketingPage() {
  const [active, setActive] = useState<VerticalKey>("hotel");
  const [fade, setFade] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const config = verticalByKey(active);
  const Icon = icons[active];

  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "");
    if (verticals.some((vertical) => vertical.key === fromHash)) setActive(fromHash as VerticalKey);
  }, []);

  const pick = (key: VerticalKey) => {
    if (key === active) return;
    setFade(true);
    window.history.replaceState(null, "", `#${key}`);
    window.setTimeout(() => {
      setActive(key);
      setFade(false);
    }, 140);
  };

  const accent = config.accent;

  return (
    <div className="market min-h-screen bg-[#FBF9F5] text-[#1B1A17] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[#E7E1D6] bg-[#FBF9F5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Empirial<span className="text-[#8A857A]"> Designs</span>
            </span>
            <Link to="/" className="rounded-full px-4 py-2 text-[13px] font-semibold text-white lg:hidden" style={{ background: accent }}>
              Management
            </Link>
          </div>
          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1">
            {verticals.map((vertical) => {
              const on = vertical.key === active;
              return (
                <button
                  key={vertical.key}
                  onClick={() => pick(vertical.key)}
                  className="shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
                  style={on ? { background: vertical.accent, color: "#fff" } : { color: "#5C584F" }}
                >
                  {vertical.tab}
                </button>
              );
            })}
          </nav>
          <Link to="/" className="hidden rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 lg:inline-block" style={{ background: accent }}>
            Management
          </Link>
        </div>
      </header>

      <div className={`transition-opacity duration-150 ${fade ? "opacity-0" : "opacity-100"}`}>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ background: config.accentSoft, color: config.accentInk }}>
              <Icon className="size-3.5" /> {config.brand}
            </span>
            <h1 className="mt-5 font-display text-[34px] leading-[1.08] font-semibold tracking-tight sm:text-[46px]">
              {config.headline} <span style={{ color: accent }}>{config.headlineAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#514D45]">{config.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setDemoOpen(true)} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: accent }}>
                Book a demo <ArrowRight className="size-4" />
              </button>
              <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-[#D8D2C6] px-6 py-3 text-sm font-semibold text-[#1B1A17] transition-colors hover:bg-[#F2EEE6]">
                See how it works
              </a>
            </div>
            <p className="mt-6 text-[13px] text-[#8A857A]">{config.represents}</p>
          </div>

          {/* Product preview */}
          <div className="rounded-3xl border border-[#E4DED2] bg-white p-3 shadow-[0_24px_60px_-40px_rgba(27,26,23,0.5)]">
            <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: config.accentSoft }}>
              <span className="font-display text-[13px] font-semibold" style={{ color: config.accentInk }}>{config.preview.label}</span>
              <span className="text-[11px] font-medium" style={{ color: config.accentInk }}>Live</span>
            </div>
            <div className="divide-y divide-[#F0ECE3]">
              {config.preview.rows.map((row) => (
                <div key={row.left} className="flex items-center gap-3 px-3 py-3.5">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: row.tone === "accent" ? accent : row.tone === "muted" ? "#D6D0C3" : "#9C978B" }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{row.left}</span>
                    <span className="block truncate text-[11.5px] text-[#8A857A]">{row.mid}</span>
                  </span>
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={row.tone === "accent" ? { background: config.accentSoft, color: config.accentInk } : { background: "#F4F1EA", color: "#5C584F" }}>
                    {row.right}
                  </span>
                </div>
              ))}
            </div>
            <p className="px-4 pb-2 pt-1 text-[11.5px] text-[#8A857A]">{config.preview.caption}</p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-[#E7E1D6] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="font-display text-[26px] font-semibold tracking-tight sm:text-[32px]">How a day runs on Empirial</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {(["Sell", "Manage", "Report"] as const).map((step, index) => (
                <div key={step} className="border-t-2 pt-5" style={{ borderColor: index === 0 ? accent : "#E4DED2" }}>
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
                    0{index + 1} · {step}
                  </span>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[#514D45]">{config.steps[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-display text-[26px] font-semibold tracking-tight sm:text-[32px]">What {config.brand} actually does</h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-[#E4DED2] bg-[#E4DED2] sm:grid-cols-2">
            {config.features.map((feature) => (
              <div key={feature.title} className="bg-[#FBF9F5] p-6">
                <h3 className="font-display text-[16px] font-semibold">{feature.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#514D45]">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="border-y border-[#E7E1D6] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-[26px] font-semibold tracking-tight sm:text-[32px]">Pricing</h2>
              <span className="text-[13px] text-[#8A857A]">Once-off setup, then monthly · scaled {config.pricingUnit}</span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {config.tiers.map((tier, index) => {
                const featured = index === 1;
                return (
                  <div key={tier.name} className="rounded-3xl border p-6" style={featured ? { borderColor: accent, background: config.accentSoft } : { borderColor: "#E4DED2" }}>
                    <span className="font-display text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: featured ? config.accentInk : "#8A857A" }}>{tier.name}</span>
                    <p className="mt-4 font-display text-[24px] font-semibold tracking-tight">{tier.monthly}</p>
                    <p className="mt-1 text-[13px] text-[#8A857A]">{tier.setup}</p>
                    <ul className="mt-5 space-y-2.5">
                      {tier.includes.map((line) => (
                        <li key={line} className="flex gap-2 text-[13.5px] text-[#514D45]">
                          <Check className="mt-0.5 size-4 shrink-0" style={{ color: accent }} /> {line}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setDemoOpen(true)} className="mt-6 w-full rounded-full py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90" style={featured ? { background: accent, color: "#fff" } : { border: "1px solid #D8D2C6" }}>
                      Book a demo
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social proof */}
        {config.proof.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="font-display text-[22px] font-semibold tracking-tight">Already running on Empirial</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {config.proof.map((client) => (
                <div key={client.name} className="rounded-2xl border border-[#E4DED2] bg-white px-5 py-4">
                  <p className="font-display text-[15px] font-semibold">{client.name}</p>
                  <p className="mt-1 text-[12.5px] text-[#8A857A]">{client.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E7E1D6] bg-[#1B1A17] text-[#EDE9E0]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-[16px] font-semibold">Empirial Designs</span>
            <p className="mt-3 text-[13px] leading-relaxed text-[#A9A49A]">Point of sale and operations software built around how your business actually works.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E7A71]">Business types</p>
            <ul className="mt-3 space-y-2">
              {verticals.map((vertical) => (
                <li key={vertical.key}>
                  <button onClick={() => pick(vertical.key)} className="text-[13.5px] text-[#EDE9E0] hover:underline">{vertical.brand}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E7A71]">Contact</p>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li className="flex items-center gap-2"><Phone className="size-3.5" /> 065 185 9143</li>
              <li className="flex items-center gap-2"><Mail className="size-3.5" /> info@empirialdesigns.co.za</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E7A71]">Existing clients</p>
            <Link to="/" className="mt-3 inline-block rounded-full px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: accent }}>Management</Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-[12px] text-[#7E7A71]">© 2026 Empirial Designs</div>
      </footer>

      {/* Demo modal */}
      {demoOpen && <DemoDialog brand={config.brand} accent={accent} onClose={() => setDemoOpen(false)} />}
    </div>
  );
}

function DemoDialog({ brand, accent, onClose }: { brand: string; accent: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-[#E4DED2] bg-[#FBF9F5] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[19px] font-semibold tracking-tight">Book a demo</h3>
            <p className="mt-1 text-[13px] text-[#8A857A]">Tagged for {brand}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full border border-[#D8D2C6] p-2"><X className="size-4" /></button>
        </div>
        {sent ? (
          <div className="mt-6 rounded-2xl border border-[#E4DED2] bg-white p-5 text-[14px] leading-relaxed text-[#514D45]">
            Thanks — your details are captured for {brand}. Someone will call you on the number you left to set a time.
            <button onClick={onClose} className="mt-5 w-full rounded-full py-2.5 text-[13px] font-semibold text-white" style={{ background: accent }}>Close</button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {[
              { label: "Business name", type: "text", placeholder: "e.g. Empirial Hotel" },
              { label: "Your name", type: "text", placeholder: "Full name" },
              { label: "Phone", type: "tel", placeholder: "065 000 0000" },
              { label: "Email", type: "email", placeholder: "you@business.co.za" },
            ].map((field) => (
              <label key={field.label} className="block">
                <span className="text-[12px] font-medium text-[#514D45]">{field.label}</span>
                <input required type={field.type} placeholder={field.placeholder} className="mt-1.5 w-full rounded-xl border border-[#D8D2C6] bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-[#1B1A17]" />
              </label>
            ))}
            <button type="submit" className="mt-2 w-full rounded-full py-3 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: accent }}>
              Request a demo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
