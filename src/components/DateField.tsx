import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Month-grid date picker. A hidden input mirrors the value as yyyy-MM-dd so it works with
 * native form validation and FormData, like a normal date field.
 */
export function DateField({
  label,
  name,
  value,
  min,
  max,
  required = true,
  onChange,
}: {
  label: string;
  name?: string | undefined;
  value: Date | undefined;
  min: Date;
  max?: Date | undefined;
  required?: boolean;
  onChange: (date: Date | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-sm font-medium">
      <span>{label}</span>
      <input
        required={required}
        name={name}
        className="sr-only"
        tabIndex={-1}
        value={value ? format(value, "yyyy-MM-dd") : ""}
        onChange={() => undefined}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="mt-1.5 h-10 w-full justify-start bg-background text-left font-normal"
          >
            <CalendarIcon />
            {value ? format(value, "dd MMM yyyy") : "Choose a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="pointer-events-auto z-[80] w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              if (date) setOpen(false);
            }}
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

/** A DateField that keeps its own state, for forms read with FormData. */
export function NamedDateField({
  label,
  name,
  min,
  required = true,
}: {
  label: string;
  name: string;
  min: Date;
  required?: boolean;
}) {
  const [value, setValue] = useState<Date | undefined>();
  return (
    <DateField
      label={label}
      name={name}
      value={value}
      min={min}
      required={required}
      onChange={setValue}
    />
  );
}
