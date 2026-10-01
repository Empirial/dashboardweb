import { useMemo, useState, type ReactNode } from "react";
import { TODAY, addDays, parseDay, shortDay } from "@/lib/reservations";

export type CalendarEvent = {
  id: string;
  /** yyyy-mm-dd */
  date: string;
  label: string;
  detail?: string;
  /** "done" renders muted; "default" renders solid. */
  tone?: "default" | "done";
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LONG_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * A real calendar grid (weeks as rows) covering `days` days from `start`. Days outside the
 * window are left blank, so a 30-day view reads like a month page that begins today.
 */
export function MonthCalendar({
  events,
  start = TODAY,
  days = 30,
  emptyText = "Nothing scheduled.",
  onEventClick,
  renderSelected,
}: {
  events: CalendarEvent[];
  start?: string;
  days?: number;
  emptyText?: string;
  onEventClick?: (event: CalendarEvent) => void;
  renderSelected?: (date: string, events: CalendarEvent[]) => ReactNode;
}) {
  const [selected, setSelected] = useState(start);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) map.set(event.date, [...(map.get(event.date) ?? []), event]);
    return map;
  }, [events]);

  const lead = (parseDay(start).getDay() + 6) % 7;
  const cellCount = Math.ceil((lead + days) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, i) => {
    const offset = i - lead;
    return offset >= 0 && offset < days ? addDays(start, offset) : null;
  });
  const end = addDays(start, days - 1);
  const dayEvents = byDate.get(selected) ?? [];

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        {shortDay(start)} to {shortDay(end)} · next {days} days
      </p>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="bg-secondary px-1 py-2 text-center text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) return <div key={`blank-${index}`} className="min-h-14 bg-secondary/40 sm:min-h-24" />;
          const list = byDate.get(date) ?? [];
          const dayNumber = parseDay(date).getDate();
          const showMonth = date === start || dayNumber === 1;
          const isSelected = date === selected;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelected(date)}
              aria-pressed={isSelected}
              aria-label={`${shortDay(date)}, ${list.length} item${list.length === 1 ? "" : "s"}`}
              className={`flex min-h-14 flex-col items-stretch gap-1 bg-background p-1 text-left transition-colors hover:bg-secondary sm:min-h-24 sm:p-1.5 ${
                isSelected ? "ring-2 ring-inset ring-primary" : ""
              }`}
            >
              <span className="flex items-baseline justify-between gap-1">
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs tnum ${
                    date === TODAY ? "bg-primary font-semibold text-primary-foreground" : "font-medium"
                  }`}
                >
                  {dayNumber}
                </span>
                {showMonth && (
                  <span className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                    {shortDay(date).split(" ")[1]}
                  </span>
                )}
              </span>
              {list.slice(0, 2).map((event) => (
                <span
                  key={event.id}
                  className={`hidden truncate rounded-md px-1.5 py-0.5 text-[10px] sm:block ${
                    event.tone === "done"
                      ? "bg-secondary text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {event.label}
                </span>
              ))}
              {list.length > 2 && (
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  +{list.length - 2} more
                </span>
              )}
              {list.length > 0 && (
                <span className="mx-auto mt-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground tnum sm:hidden">
                  {list.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-secondary p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-sm font-semibold">
            {LONG_WEEKDAYS[parseDay(selected).getDay()]} {shortDay(selected)}
          </h4>
          {renderSelected?.(selected, dayEvents)}
        </div>
        {dayEvents.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {dayEvents.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  disabled={!onEventClick}
                  onClick={() => onEventClick?.(event)}
                  className="flex w-full items-center justify-between gap-3 py-2 text-left disabled:cursor-default"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{event.label}</span>
                    {event.detail && (
                      <span className="block truncate text-xs text-muted-foreground">{event.detail}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
