import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { DateField } from "@/components/DateField";
import { rand, rooms as allRooms, type Room } from "@/lib/hotel-data";
import {
  TODAY,
  addDays,
  dayKey,
  freeRooms,
  isRoomFree,
  parseDay,
  shortDay,
  useReservations,
  type Reservation,
} from "@/lib/reservations";

const roomTypes: Room["type"][] = ["Single", "Twin", "Deluxe", "Suite"];

export type BookingDraft = {
  room: string;
  roomType: Room["type"];
  guest: string;
  start: string;
  nights: number;
  rate: number;
  total: number;
};

export function BookRoomDialog({
  open,
  onClose,
  onConfirm,
  presetRoom,
  presetStart,
  confirmLabel = "Confirm booking",
  source = "Front desk",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (draft: BookingDraft) => void;
  presetRoom?: string | undefined;
  presetStart?: string | undefined;
  confirmLabel?: string | undefined;
  source?: Reservation["source"] | undefined;
}) {
  const reservations = useReservations();
  const [guest, setGuest] = useState("");
  const [start, setStart] = useState(presetStart ?? TODAY);
  const [nights, setNights] = useState(1);
  const [type, setType] = useState<Room["type"]>(
    allRooms.find((r) => r.number === presetRoom)?.type ?? "Deluxe",
  );
  const [room, setRoom] = useState(presetRoom ?? "");

  const available = useMemo(
    () => freeRooms(reservations, start, nights, type),
    [reservations, start, nights, type],
  );

  const chosen =
    allRooms.find((r) => r.number === room) ??
    available[0] ??
    allRooms.find((r) => r.type === type);

  const conflict = chosen ? !isRoomFree(reservations, chosen.number, start, nights) : true;
  const total = (chosen?.rate ?? 0) * nights;
  const valid = guest.trim().length > 1 && !!chosen && !conflict;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border border-border bg-paper sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-[13px] font-semibold tracking-tight">Book a room</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground">
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <Field label="Guest name">
            <input
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              placeholder="e.g. N. Maseko"
              className="w-full rounded-md border border-border bg-secondary px-2.5 py-2 text-[12px] outline-none focus:border-primary"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <DateField
              label="Check-in"
              value={parseDay(start)}
              min={parseDay(TODAY)}
              onChange={(date) => setStart(date ? dayKey(date) : TODAY)}
            />
            <Field label="Nights">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNights((n) => Math.max(1, n - 1))}
                  className="grid size-8 place-items-center rounded-md border border-border bg-secondary text-[13px]"
                  aria-label="Fewer nights"
                >
                  −
                </button>
                <span className="flex-1 text-center font-mono text-[13px] tnum">{nights}</span>
                <button
                  onClick={() => setNights((n) => Math.min(21, n + 1))}
                  className="grid size-8 place-items-center rounded-md border border-border bg-secondary text-[13px]"
                  aria-label="More nights"
                >
                  +
                </button>
              </div>
            </Field>
          </div>

          <Field label="Room type">
            <div className="flex gap-1">
              {roomTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setRoom("");
                  }}
                  className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    type === t
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label={`Available ${type.toLowerCase()} rooms · ${shortDay(start)} → ${shortDay(addDays(start, nights))}`}
          >
            {available.length === 0 ? (
              <p className="rounded-md border border-border bg-secondary px-2.5 py-2 text-[11px] text-muted-foreground">
                Nothing free for those dates. Try other dates or another room type.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {available.map((r) => (
                  <button
                    key={r.number}
                    onClick={() => setRoom(r.number)}
                    className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] tnum transition-colors ${
                      chosen?.number === r.number
                        ? "bg-ink text-paper"
                        : "border border-border bg-secondary text-muted-foreground"
                    }`}
                  >
                    {r.number}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <div className="flex items-end justify-between border-t border-border pt-3">
            <div className="text-[11px] text-muted-foreground">
              {chosen ? `Rm ${chosen.number} · ${rand(chosen.rate)} / night` : "No room selected"}
            </div>
            <div className="font-mono text-lg font-semibold tnum">{rand(total)}</div>
          </div>

          <button
            disabled={!valid}
            onClick={() => {
              if (!chosen) return;
              onConfirm({
                room: chosen.number,
                roomType: chosen.type,
                guest: guest.trim(),
                start,
                nights,
                rate: chosen.rate,
                total,
              });
              setGuest("");
            }}
            className="w-full rounded-lg bg-primary py-2.5 text-[12px] font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {confirmLabel} · {source}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
