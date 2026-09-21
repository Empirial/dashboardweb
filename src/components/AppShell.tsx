import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Desk" },
  { to: "/rooms", label: "Rooms" },
  { to: "/bookings", label: "Bookings" },
  { to: "/pos", label: "POS" },
  { to: "/guests", label: "Guests" },
  { to: "/reports", label: "Reports" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <header className="sticky top-0 z-30 border-b border-line bg-popover/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-brass">
              <span className="bell font-display text-sm font-bold text-brass-foreground">E</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-[15px] font-bold tracking-tight">Empirial Hotel</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Front Desk · Ops
              </div>
            </div>
          </div>
          <div className="text-right leading-none">
            <div className="font-mono text-[11px] tnum">14:32</div>
            <div className="text-[10px] text-muted-foreground">Tue 12 Mar</div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors"
              activeProps={{ className: "bg-ink text-paper" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-4">{children}</main>

      <footer className="pb-6 pt-1 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Empirial Hotel · Property Ops v2.4
      </footer>
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
    <section className={`panel rise p-3 ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between">
          {title && <h2 className="font-display text-sm font-bold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
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
    <div className="panel-sm rise p-3">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold tnum">{value}</div>
      {sub && (
        <div
          className={`mt-0.5 text-[10px] ${subTone === "positive" ? "text-positive" : "text-muted-foreground"}`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
