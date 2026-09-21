import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BedDouble,
  CalendarRange,
  ChevronLeft,
  LayoutDashboard,
  LineChart,
  Receipt,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Desk", icon: LayoutDashboard },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/bookings", label: "Bookings", icon: CalendarRange },
  { to: "/pos", label: "POS", icon: Receipt },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/reports", label: "Reports", icon: LineChart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-paper transition-[width] duration-150 md:flex ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-3">
          <div className="grid size-7 shrink-0 place-items-center rounded-md bg-ink">
            <span className="font-display text-xs font-semibold text-paper">E</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-none">
              <div className="truncate font-display text-[13px] font-semibold tracking-tight">
                Empirial Hotel
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Property Ops
              </div>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              title={item.label}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-100 hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 border-t border-border px-3 py-3 text-[11px] font-medium text-muted-foreground transition-colors duration-100 hover:text-foreground"
        >
          <ChevronLeft
            className={`size-4 transition-transform duration-150 ${collapsed ? "rotate-180" : ""}`}
            strokeWidth={1.75}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2.5 md:hidden">
              <div className="grid size-7 place-items-center rounded-md bg-ink">
                <span className="font-display text-xs font-semibold text-paper">E</span>
              </div>
              <span className="font-display text-[13px] font-semibold tracking-tight">
                Empirial Hotel
              </span>
            </div>
            <div className="hidden text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:block">
              Front Desk
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-[12px] font-medium tnum">14:32</span>
              <span className="text-[11px] text-muted-foreground">Tue 12 Mar</span>
              <span className="grid size-7 place-items-center rounded-full bg-secondary font-display text-[10px] font-medium">
                RM
              </span>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-paper px-3 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 space-y-4 px-4 py-5 md:px-6 md:py-6">{children}</main>

        <footer className="px-4 pb-6 pt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:px-6">
          Empirial Hotel · Property Ops v2.4
        </footer>
      </div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title && (
            <h2 className="font-display text-[13px] font-semibold tracking-tight">{title}</h2>
          )}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  subTone = "muted",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  subTone?: "muted" | "positive";
}) {
  return (
    <div className="panel-sm p-4">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-[28px] font-medium leading-none tracking-tight tnum">
        {value}
      </div>
      {sub && (
        <div
          className={`mt-2 text-[11px] ${subTone === "positive" ? "text-positive" : "text-muted-foreground"}`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
