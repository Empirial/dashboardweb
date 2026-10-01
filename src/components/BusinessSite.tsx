import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { addDays } from "date-fns";
import {
  ArrowRight,
  Clock,
  Compass,
  LayoutDashboard,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { DateField } from "@/components/DateField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { verticals, type VerticalConfig, type VerticalKey } from "@/lib/marketing-data";
import { submitEnquiry } from "@/lib/demo-data";
import { useProduct } from "@/lib/product";
import { exampleDateOffsets, exampleFor, startTour, useTour } from "@/lib/tour";
import { TODAY, dayKey, parseDay } from "@/lib/reservations";

type PageKind = "home" | "about" | "explore";

const servicesLabel: Record<VerticalKey, string> = {
  hotel: "Rooms",
  property: "Properties",
  retail: "Shop",
  salon: "Services",
  auto: "Services",
  restaurant: "Menu",
  cleaning: "Services",
};

const highlightIcons = [ShieldCheck, Sparkles, Clock];

export function BusinessSite({
  config,
  page = "home",
}: {
  config: VerticalConfig;
  page?: PageKind;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selected, setSelected] = useState(config.offerings[0]?.name ?? config.brand);
  const [bagCount, setBagCount] = useState(0);
  const { setNiche } = useProduct();
  const navigate = useNavigate();
  const isRetail = config.key === "retail";

  const beginTour = () => {
    startTour(config.key);
    void navigate({ to: "/marketing/$vertical", params: { vertical: config.key } });
  };

  const takeAction = (name?: string) => {
    if (name) setSelected(name);
    if (isRetail) setBagCount((count) => count + 1);
    setBookingOpen(true);
  };

  // In-page anchors on the home page, and links back to those anchors from other pages.
  const anchor = (id: string) => (page === "home" ? `#${id}` : `/marketing/${config.key}#${id}`);
  const navLinks = [
    { id: "services", label: servicesLabel[config.key] },
    { id: "about", label: "About" },
    { id: "testimonials", label: "Testimonials" },
  ];

  return (
    <div className="business-site min-h-screen" data-site={config.key}>
      <header className="business-nav">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            to="/marketing/$vertical"
            params={{ vertical: config.key }}
            className="font-display text-xl font-semibold"
          >
            {config.brand}
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              to="/marketing/$vertical"
              params={{ vertical: config.key }}
              className="site-nav-link"
            >
              Home
            </Link>
            {navLinks.map((item) => (
              <a key={item.id} href={anchor(item.id)} className="site-nav-link">
                {item.label}
              </a>
            ))}
            <button type="button" className="site-nav-link" onClick={() => setBookingOpen(true)}>
              Contact
            </button>
            <button
              type="button"
              className="site-nav-link inline-flex items-center gap-1.5"
              onClick={beginTour}
            >
              <Compass className="size-3.5" />
              Take the tour
            </button>
          </nav>
          <div className="flex items-center gap-2">
            {isRetail && (
              <span className="hidden items-center gap-1 text-xs sm:flex">
                <ShoppingBag className="size-4" /> {bagCount}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="hidden border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground sm:inline-flex"
              asChild
            >
              <Link
                to={config.managementPath}
                data-tour="nav-management"
                onClick={() => setNiche(config.managementNiche)}
              >
                <LayoutDashboard />
                Management
              </Link>
            </Button>
            <Button
              className="site-button hidden xl:inline-flex"
              data-tour="nav-cta"
              onClick={() => setBookingOpen(true)}
            >
              {config.primaryCta}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="site-mobile-menu lg:hidden">
            <Link
              to="/marketing/$vertical"
              params={{ vertical: config.key }}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            {navLinks.map((item) => (
              <a key={item.id} href={anchor(item.id)} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setBookingOpen(true);
              }}
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                beginTour();
              }}
            >
              Take the tour
            </button>
            <Link
              to={config.managementPath}
              onClick={() => setNiche(config.managementNiche)}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="size-4" />
              Management
            </Link>
          </div>
        )}
      </header>

      {page === "home" && (
        <main>
          <section className="business-hero">
            <img
              src={config.hero}
              alt={`${config.brand} experience`}
              width={1600}
              height={1067}
              style={{ objectPosition: config.heroPosition }}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="business-hero-wash absolute inset-0" />
            <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-end px-5 pb-24 pt-28 lg:px-8 lg:pb-28">
              <div className="max-w-3xl text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {config.eyebrow}
                </p>
                <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
                  {config.headline}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                  {config.sub}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="site-button"
                    data-tour="hero-cta"
                    onClick={() => setBookingOpen(true)}
                  >
                    {config.primaryCta}
                    <ArrowRight />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
                    asChild
                  >
                    <a href="#services">{config.exploreLabel}</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 -mt-14 px-5 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-line bg-line shadow-xl sm:grid-cols-3">
              {config.highlights.map((item, index) => {
                const Icon = highlightIcons[index] ?? Sparkles;
                return (
                  <div key={item} className="flex gap-4 bg-paper p-6 lg:p-7">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-site-accent/10 text-site-accent">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-snug">{item}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {config.highlightText[index]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            id="about"
            className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8"
          >
            <div>
              <p className="site-kicker">Our story</p>
              <h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-tight sm:text-5xl">
                {config.aboutTitle}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                {config.about}
              </p>
              <Button variant="outline" className="mt-7" asChild>
                <Link to="/marketing/$vertical/about" params={{ vertical: config.key }}>
                  Discover our approach
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <img
              src={config.detailImage}
              alt={`${config.brand} detail`}
              loading="lazy"
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </section>

          <OfferingGrid config={config} onAction={takeAction} />

          <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <img
              src={config.hero}
              alt={`${config.brand} customer experience`}
              loading="lazy"
              width={1600}
              height={1067}
              style={{ objectPosition: config.heroPosition }}
              className="aspect-[4/3] size-full object-cover"
            />
            <div>
              <p className="site-kicker">The experience</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                {config.experienceTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {config.experience}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6">
                {config.highlights.map((item, index) => (
                  <div key={item}>
                    <span className="text-xs font-bold text-site-accent">0{index + 1}</span>
                    <p className="mt-2 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Testimonials config={config} />

          <section className="site-footer">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 sm:flex-row sm:items-end lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/55">
                  Begin here
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                  {config.closingTitle}
                </h2>
                <p className="mt-5 max-w-xl text-primary-foreground/70">{config.closingText}</p>
              </div>
              <Button
                size="lg"
                className="site-button shrink-0"
                onClick={() => setBookingOpen(true)}
              >
                {config.primaryCta}
                <ArrowRight />
              </Button>
            </div>
          </section>
        </main>
      )}

      {page === "about" && (
        <main>
          <section
            id="about"
            className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-28 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-36"
          >
            <div>
              <p className="site-kicker">About {config.brand}</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-tight sm:text-6xl">
                {config.aboutTitle}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{config.about}</p>
              <p className="mt-8 border-l-2 border-site-accent pl-5 font-display text-2xl leading-snug">
                {config.promise}
              </p>
            </div>
            <img
              src={config.detailImage}
              alt={`${config.brand} story`}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </section>
          <section className="site-band">
            <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
              <p className="site-kicker">What matters to us</p>
              <h2 className="mt-4 font-display text-4xl font-semibold">
                A personal experience, from first hello to final handover.
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {config.highlights.map((item, index) => (
                  <div key={item}>
                    <span className="text-xs font-bold text-site-accent">0{index + 1}</span>
                    <p className="mt-3 font-display text-xl font-semibold">{item}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {config.highlightText[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Testimonials config={config} />
        </main>
      )}

      {page === "explore" && (
        <main className="pt-18">
          <section className="relative h-[44vh] min-h-90 overflow-hidden">
            <img
              src={config.hero}
              alt={config.exploreLabel}
              width={1600}
              height={1067}
              style={{ objectPosition: config.heroPosition }}
              className="size-full object-cover"
            />
            <div className="business-hero-wash absolute inset-0" />
            <div className="absolute inset-0 mx-auto flex max-w-7xl items-end px-5 pb-10 text-primary-foreground lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {config.category}
                </p>
                <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">
                  {config.exploreLabel}
                </h1>
              </div>
            </div>
          </section>
          <OfferingGrid config={config} onAction={takeAction} expanded />
        </main>
      )}

      <footer className="site-footer">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-3 lg:px-8">
          <div>
            <p className="font-display text-xl font-semibold">{config.brand}</p>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/65">{config.promise}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">
              Visit another Empirial site
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {verticals
                .filter((site) => site.key !== config.key)
                .map((site) => (
                  <Link
                    key={site.key}
                    to="/marketing/$vertical"
                    params={{ vertical: site.key }}
                    className="text-sm hover:underline"
                  >
                    {site.tab}
                  </Link>
                ))}
            </div>
          </div>
          <div className="sm:text-right">
            <Link to="/marketing" className="text-sm font-semibold">
              Empirial Designs portfolio
            </Link>
            <br />
            <Link
              to={config.managementPath}
              onClick={() => setNiche(config.managementNiche)}
              className="mt-3 inline-block text-sm text-primary-foreground/65"
            >
              Client management
            </Link>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/45">
          © 2026 Empirial Designs · 065 185 9143
        </div>
      </footer>

      <ActionDialog
        config={config}
        selected={selected}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}

function OfferingGrid({
  config,
  onAction,
  expanded = false,
}: {
  config: VerticalConfig;
  onAction: (name: string) => void;
  expanded?: boolean;
}) {
  return (
    <section id="services" className="site-band">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="site-kicker">{servicesLabel[config.key]}</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {config.exploreLabel}
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {config.promise}
          </p>
          <img
            src={config.detailImage}
            alt={`${config.brand} services`}
            loading="lazy"
            width={1200}
            height={1200}
            className="mt-8 hidden aspect-[4/5] w-full max-w-sm object-cover lg:block"
          />
          {!expanded && (
            <Button variant="outline" className="mt-8" asChild>
              <Link to="/marketing/$vertical/explore" params={{ vertical: config.key }}>
                View everything
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
        <ol className="border-b border-line">
          {config.offerings.map((item, index) => (
            <li key={item.name} className="border-t border-line">
              <button
                type="button"
                onClick={() => onAction(item.name)}
                aria-label={`Choose ${item.name}`}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left transition-colors hover:bg-paper sm:gap-7 sm:px-4"
              >
                <span className="font-display text-3xl font-semibold text-site-accent/60 transition-colors group-hover:text-site-accent sm:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-xl font-semibold sm:text-2xl">
                      {item.name}
                    </span>
                    <span className="border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {item.tag}
                    </span>
                  </span>
                  <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <span className="whitespace-nowrap text-sm font-semibold">{item.price}</span>
                  <span className="grid size-10 place-items-center rounded-full border border-line transition-colors group-hover:border-transparent group-hover:bg-site-accent group-hover:text-primary-foreground">
                    {config.key === "retail" ? (
                      <Plus className="size-4" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Testimonials({ config }: { config: VerticalConfig }) {
  const [lead, ...others] = config.testimonials;
  if (!lead) return null;
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="site-kicker">Testimonials</p>
      <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        What our customers say
      </h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <figure className="flex flex-col justify-between bg-site-accent p-8 text-primary-foreground sm:p-10">
          <div>
            <Stars />
            <blockquote className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
              “{lead.quote}”
            </blockquote>
          </div>
          <figcaption className="mt-8 text-sm">
            <span className="font-semibold">{lead.name}</span>
            <span className="text-primary-foreground/70"> · {lead.role}</span>
          </figcaption>
        </figure>
        <div className="grid gap-5">
          {others.map((item) => (
            <figure key={item.name} className="border border-line bg-paper p-6 sm:p-7">
              <Stars className="text-site-accent" />
              <blockquote className="mt-4 text-base leading-relaxed">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted-foreground"> · {item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-4 fill-current" />
      ))}
    </div>
  );
}

const nameField = { label: "Your name", type: "text", placeholder: "Full name" };

function ActionDialog({
  config,
  selected,
  open,
  onOpenChange,
}: {
  config: VerticalConfig;
  selected: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setNiche } = useProduct();
  const tour = useTour();
  const prefill = tour.active && tour.seed > 0 && tour.key === config.key;
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [dates, setDates] = useState<Record<string, Date | undefined>>({});
  const sent = result?.ok === true;
  const today = parseDay(TODAY);
  // Every request needs a name, so add the field when a form does not define one.
  const fields = config.formFields.some((field) => field.label === nameField.label)
    ? config.formFields
    : [nameField, ...config.formFields];

  const boundsFor = (label: string): { min: Date; max?: Date } => {
    if (config.key !== "hotel") return { min: today };
    if (label === "Check out")
      return { min: addDays(dates["Check in"] ?? today, 1), max: addDays(today, 30) };
    return { min: today, max: addDays(today, 29) };
  };

  // "Fill in an example for me" in the guided tour pre-fills the dates (text fields below).
  useEffect(() => {
    if (!prefill || !open) return;
    const offsets = exampleDateOffsets(config.key);
    setDates(
      Object.fromEntries(
        Object.entries(offsets).map(([label, days]) => [label, addDays(today, days)]),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill, tour.seed, open, config.key]);

  const changeDate = (label: string, date: Date | undefined) =>
    setDates((current) => {
      const next = { ...current, [label]: date };
      const checkOut = next["Check out"];
      if (label === "Check in" && date && checkOut && checkOut <= date)
        next["Check out"] = undefined;
      return next;
    });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    for (const field of fields) {
      if (field.type === "date") {
        const date = dates[field.label];
        values[field.label] = date ? dayKey(date) : "";
      } else if (field.label === "Quantity") {
        values[field.label] = String(quantity);
      } else {
        values[field.label] = String(form.get(field.label) ?? "");
      }
    }
    setResult(submitEnquiry(config, selected, values));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) window.setTimeout(() => setResult(null), 200);
      }}
    >
      <DialogContent
        className="business-site max-h-[94vh] gap-0 overflow-y-auto border-line bg-paper p-0 sm:max-w-3xl"
        data-site={config.key}
        data-tour="form"
        onInteractOutside={(event) => {
          // Pressing the tour card must not close the form.
          if ((event.target as HTMLElement | null)?.closest?.("[data-tour-ui]")) {
            event.preventDefault();
          }
        }}
      >
        <div className="grid md:grid-cols-[0.8fr_1.4fr]">
          <div className="relative hidden md:block">
            <img
              src={config.detailImage}
              alt=""
              style={{ objectPosition: config.heroPosition }}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="business-hero-wash absolute inset-0" />
            <div className="relative flex h-full flex-col justify-end p-6 text-primary-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                {config.category}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">{config.brand}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-2xl sm:text-3xl">
                {sent ? "Thank you" : config.formTitle}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {sent
                  ? `${result?.message ?? ""} This is a demo, so no payment or message was sent.`
                  : config.formDescription}
              </DialogDescription>
            </DialogHeader>

            {sent ? (
              <div className="mt-5 grid gap-2">
                <Button variant="outline" className="h-11" asChild>
                  <Link
                    to={config.managementPath}
                    data-tour="see-management"
                    onClick={() => setNiche(config.managementNiche)}
                  >
                    <LayoutDashboard />
                    See it in Management
                  </Link>
                </Button>
                <Button className="site-button h-11" onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              </div>
            ) : (
              <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
                <div className="flex items-center justify-between border border-line bg-background px-3 py-2 text-sm sm:col-span-2">
                  <span className="text-muted-foreground">Selected</span>
                  <strong className="truncate pl-3">{selected}</strong>
                </div>
                {fields.map((field) => {
                  if (field.label === "Quantity") {
                    return (
                      <div key={field.label} className="text-sm font-medium">
                        {field.label}
                        <span className="mt-1.5 flex h-10 w-fit items-center border border-line">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                          >
                            <Minus />
                          </Button>
                          <span className="w-10 text-center">{quantity}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuantity((value) => value + 1)}
                          >
                            <Plus />
                          </Button>
                        </span>
                      </div>
                    );
                  }
                  if (field.type === "date") {
                    const { min, max } = boundsFor(field.label);
                    return (
                      <DateField
                        key={field.label}
                        label={field.label}
                        value={dates[field.label]}
                        min={min}
                        max={max}
                        onChange={(date) => changeDate(field.label, date)}
                      />
                    );
                  }
                  return (
                    <label key={field.label} className="text-sm font-medium">
                      {field.label}
                      <Input
                        key={`${field.label}-${tour.seed}`}
                        defaultValue={prefill ? exampleFor(config.key, field.label) : undefined}
                        required
                        name={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        min={field.type === "number" ? 1 : undefined}
                        className="mt-1.5 h-10 bg-background"
                      />
                    </label>
                  );
                })}
                {result && !result.ok && (
                  <p
                    role="alert"
                    className="border border-destructive/40 bg-destructive/5 p-2.5 text-sm text-destructive sm:col-span-2"
                  >
                    {result.message}
                  </p>
                )}
                <Button
                  type="submit"
                  data-tour="form-submit"
                  className="site-button h-11 sm:col-span-2"
                >
                  {config.key === "retail" ? "Complete demo order" : "Send request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
