import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Boxes,
  CalendarDays,
  CalendarRange,
  CarFront,
  ChevronLeft,
  ClipboardList,
  Globe,
  LayoutDashboard,
  LineChart,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Store,
  TableProperties,
  Users,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { nicheConfigs, type ModuleKey } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { DemoGuide } from "@/components/DemoGuide";
import { TODAY, shortDay } from "@/lib/reservations";

// Guided-tour targets for the navigation links.
const navTourId: Record<string, string> = { "/": "nav-overview", "/pos": "nav-register" };

const core = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/pos", label: "Register", icon: Receipt },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reports", label: "Reports", icon: LineChart },
  { to: "/website", label: "Website", icon: Globe },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const moduleIcons: Record<ModuleKey, typeof Boxes> = {
  rooms: Store,
  bookings: CalendarRange,
  "floor-plan": TableProperties,
  kitchen: UtensilsCrossed,
  inventory: Boxes,
  catalog: ShoppingBag,
  appointments: CalendarDays,
  staff: Users,
  packages: Sparkles,
  jobs: CarFront,
  parts: Wrench,
  quotes: ClipboardList,
  scheduling: CalendarRange,
  billing: Receipt,
  crew: SprayCan,
};

const modulePath = (key: ModuleKey) => `/${key}` as "/rooms";

export function AppShell({
  children,
  title,
  eyebrow,
  workspace = false,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  workspace?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const moduleNav = config.modules.map((module) => ({
    ...module,
    to: modulePath(module.key),
    icon: moduleIcons[module.key],
  }));
  const allNav = [...core.slice(0, 2), ...moduleNav, ...core.slice(2)];
  const mobileNav = [...core.slice(0, 2), ...moduleNav.slice(0, 1), core[2], core[5]];

  return (
    <div
      className={`min-h-screen bg-background text-foreground md:p-3 ${workspace ? "md:h-screen md:overflow-hidden" : ""}`}
    >
      <aside
        className={`fixed inset-y-3 left-3 z-40 hidden flex-col panel transition-[width] duration-300 md:flex ${collapsed ? "w-16" : "w-60"}`}
      >
        <div className="flex h-17 items-center gap-3 border-b border-border px-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            E
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold">{config.business}</div>
              <div className="mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {config.descriptor}
              </div>
            </div>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2.5">
          {allNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-tour={navTourId[item.to]}
              activeOptions={{ exact: item.to === "/" }}
              title={item.label}
              className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
            >
              <item.icon className="size-4 shrink-0" strokeWidth={1.7} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((value) => !value)}
            className="w-full justify-start"
          >
            <ChevronLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && "Collapse"}
          </Button>
        </div>
      </aside>

      <div
        className={`min-w-0 transition-[padding] duration-300 ${collapsed ? "md:pl-19" : "md:pl-63"}`}
      >
        <header className="sticky top-0 z-30 mx-2 mt-2 flex h-16 items-center justify-between panel px-4 md:top-3 md:mx-0 md:mt-0 md:px-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow ?? config.shortLabel}
            </div>
            <h1 className="font-display text-base font-semibold">{title ?? config.business}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/marketing"
              className="hidden rounded-xl border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
            >
              Marketing site
            </Link>
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground sm:inline">
              Demo data
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {shortDay(TODAY)} {TODAY.slice(0, 4)}
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-border bg-secondary text-[11px] font-semibold">
              RM
            </span>
          </div>
        </header>
        <main
          className={
            workspace
              ? "space-y-3 px-3 pb-28 pt-3 md:h-[calc(100vh-5.5rem)] md:overflow-hidden md:px-0 md:pb-0"
              : "space-y-4 px-3 pb-28 pt-4 md:px-0 md:pb-8"
          }
        >
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-2 bottom-2 z-50 flex h-16 items-center justify-around panel px-1 md:hidden">
        {mobileNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            data-tour={navTourId[item.to]}
            activeOptions={{ exact: item.to === "/" }}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-medium text-muted-foreground"
            activeProps={{ className: "bg-primary text-primary-foreground" }}
          >
            <item.icon className="size-4" />
            <span className="max-w-full truncate px-1">{item.label}</span>
          </Link>
        ))}
      </nav>
      <DemoGuide />
    </div>
  );
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
  tour,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Marks the panel as a guided-tour target. */
  tour?: string | undefined;
}) {
  return (
    <section data-tour={tour} className={`panel rise ${className}`}>
      {(title || action) && (
        <div className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          {title && <h3 className="font-display text-sm font-semibold">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  subTone: _subTone,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  subTone?: "muted" | "positive";
}) {
  return (
    <div className="panel-sm p-4 sm:p-5">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-3 font-display text-2xl font-semibold tnum sm:text-[28px]">{value}</div>
      {sub && <div className="mt-1.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-border bg-secondary p-1 backdrop-blur-xl">
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={value === option ? "default" : "ghost"}
          onClick={() => onChange(option)}
          className="shrink-0 rounded-xl px-3 text-[11px]"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
