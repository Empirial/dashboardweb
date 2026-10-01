import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { addDays, format } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  Check,
  LayoutDashboard,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { verticals, type VerticalConfig } from "@/lib/marketing-data";
import { submitEnquiry } from "@/lib/demo-data";
import { useProduct } from "@/lib/product";
import { TODAY, dayKey, parseDay } from "@/lib/reservations";

type PageKind = "home" | "about" | "explore";

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
  const isRetail = config.key === "retail";

  const takeAction = (name?: string) => {
    if (name) setSelected(name);
    if (isRetail) setBagCount((count) => count + 1);
    setBookingOpen(true);
  };

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
            <Link
              to="/marketing/$vertical/explore"
              params={{ vertical: config.key }}
              className="site-nav-link"
            >
              {config.exploreLabel}
            </Link>
            <Link
              to="/marketing/$vertical/about"
              params={{ vertical: config.key }}
              className="site-nav-link"
            >
              About
            </Link>
            <button type="button" className="site-nav-link" onClick={() => setBookingOpen(true)}>
              Contact
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
              <Link to={config.managementPath} onClick={() => setNiche(config.managementNiche)}>
                <LayoutDashboard />
                Management
              </Link>
            </Button>
            <Button
              className="site-button hidden xl:inline-flex"
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
            <Link to="/marketing/$vertical" params={{ vertical: config.key }}>
              Home
            </Link>
            <Link to="/marketing/$vertical/explore" params={{ vertical: config.key }}>
              {config.exploreLabel}
            </Link>
            <Link to="/marketing/$vertical/about" params={{ vertical: config.key }}>
              About
            </Link>
            <button type="button" onClick={() => setBookingOpen(true)}>
              Contact
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
              className="absolute inset-0 size-full object-cover"
            />
            <div className="business-hero-wash absolute inset-0" />
            <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-end px-5 pb-14 pt-28 lg:px-8 lg:pb-20">
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
                  <Button size="lg" className="site-button" onClick={() => setBookingOpen(true)}>
                    {config.primaryCta}
                    <ArrowRight />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
                    asChild
                  >
                    <Link to="/marketing/$vertical/explore" params={{ vertical: config.key }}>
                      {config.exploreLabel}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="border-b border-line bg-paper">
            <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
              {config.highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 py-5 sm:px-6 first:pl-0">
                  <Check className="size-4 text-site-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
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
          <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-28 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-36">
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
                  </div>
                ))}
              </div>
            </div>
          </section>
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
    <section className="site-band">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="site-kicker">Selected for you</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">{config.exploreLabel}</h2>
          </div>
          {!expanded && (
            <Button variant="ghost" asChild>
              <Link to="/marketing/$vertical/explore" params={{ vertical: config.key }}>
                View all
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {config.offerings.map((item, index) => (
            <article key={item.name} className="group overflow-hidden border border-line bg-paper">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={index === 1 ? config.hero : config.detailImage}
                  alt={item.name}
                  loading="lazy"
                  width={1200}
                  height={1200}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 bg-paper px-3 py-1.5 text-xs font-semibold">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{item.price}</span>
                  <Button
                    size="icon"
                    className="site-button"
                    onClick={() => onAction(item.name)}
                    aria-label={`Choose ${item.name}`}
                  >
                    {config.key === "retail" ? <Plus /> : <ArrowRight />}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [dates, setDates] = useState<Record<string, Date | undefined>>({});
  const sent = result?.ok === true;
  const today = parseDay(TODAY);

  const boundsFor = (label: string): { min: Date; max?: Date } => {
    if (config.key !== "hotel") return { min: today };
    if (label === "Check out")
      return { min: addDays(dates["Check in"] ?? today, 1), max: addDays(today, 30) };
    return { min: today, max: addDays(today, 29) };
  };

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
    for (const field of config.formFields) {
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
        className="business-site max-h-[90vh] overflow-y-auto border-line bg-paper p-0 sm:max-w-xl"
        data-site={config.key}
      >
        <div className="h-32 overflow-hidden">
          <img src={config.detailImage} alt="" className="size-full object-cover" />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">
              {sent ? "Thank you" : config.formTitle}
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              {sent
                ? `${result?.message ?? ""} This is a demo, so no payment or message was sent.`
                : config.formDescription}
            </DialogDescription>
          </DialogHeader>
          {sent ? (
            <div className="mt-6 grid gap-2">
              <Button variant="outline" className="h-11" asChild>
                <Link to={config.managementPath} onClick={() => setNiche(config.managementNiche)}>
                  <LayoutDashboard />
                  See it in Management
                </Link>
              </Button>
              <Button className="site-button h-11" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="border border-line bg-background p-3 text-sm">
                <span className="text-muted-foreground">Selected</span>
                <strong className="float-right">{selected}</strong>
              </div>
              {config.formFields.map((field) => {
                if (field.label === "Quantity") {
                  return (
                    <label key={field.label} className="text-sm font-medium">
                      {field.label}
                      <span className="mt-2 flex w-fit items-center border border-line">
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
                    </label>
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
                      required
                      name={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      min={field.type === "number" ? 1 : undefined}
                      className="mt-2 h-11 bg-background"
                    />
                  </label>
                );
              })}
              {result && !result.ok && (
                <p
                  role="alert"
                  className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  {result.message}
                </p>
              )}
              <Button type="submit" className="site-button mt-2 h-11">
                {config.key === "retail" ? "Complete demo order" : "Send request"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DateField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  min: Date;
  max?: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  return (
    <div className="text-sm font-medium">
      <span>{label}</span>
      <input
        required
        className="sr-only"
        tabIndex={-1}
        value={value ? format(value, "yyyy-MM-dd") : ""}
        onChange={() => undefined}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="mt-2 h-11 w-full justify-start bg-background text-left font-normal"
          >
            <CalendarIcon />
            {value ? format(value, "dd MMMM yyyy") : "Choose a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="pointer-events-auto w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            defaultMonth={value ?? min}
            disabled={(day) => day < min || (max !== undefined && day > max)}
            initialFocus
            className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
