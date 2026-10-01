import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NamedDateField } from "@/components/DateField";
import { Input } from "@/components/ui/input";
import {
  addCustomer,
  addFeed,
  addJob,
  addModuleRecord,
  addPart,
  addQuote,
  initialsOf,
  numberIn,
} from "@/lib/demo-data";
import { customerCopy } from "@/lib/customer-copy";
import { moduleForms } from "@/lib/module-forms";
import type { ModuleKey, ModuleRecord } from "@/lib/platform-data";
import { useProduct, type Niche } from "@/lib/product";
import { TODAY, parseDay } from "@/lib/reservations";

export function FormDialog({
  open,
  onClose,
  title,
  description,
  submitLabel,
  onSubmit,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (data: FormData) => void;
  children: ReactNode;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  };
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[94vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
          {children}
          <div className="flex gap-2 pt-1 sm:col-span-2">
            <Button type="submit" className="flex-1">
              {submitLabel}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Field({
  label,
  name,
  wide = false,
  required = true,
  ...props
}: {
  label: string;
  name: string;
  wide?: boolean;
  required?: boolean;
} & Omit<React.ComponentProps<"input">, "name">) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <Input name={name} required={required} {...props} />
    </label>
  );
}

export const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export type NewJob = {
  id: string;
  customer: string;
  vehicle: string;
  work: string;
  estimate: number;
};

/** Opens a workshop job card. Used from Job cards and from the register. */
export function JobDialog({
  open,
  onClose,
  onCreated,
  title = "Add a new job",
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (job: NewJob) => void;
  title?: string;
}) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      description="Capture the customer, their vehicle and the work to be done."
      submitLabel="Create job card"
      onSubmit={(data) => {
        const job = {
          customer: text(data, "customer"),
          vehicle: text(data, "vehicle"),
          phone: text(data, "phone"),
          work: text(data, "work"),
          estimate: numberIn(text(data, "estimate")),
        };
        const id = addJob(job);
        onCreated?.({ id, ...job });
        onClose();
      }}
    >
      <Field label="Customer name" name="customer" placeholder="Full name" />
      <Field label="Contact number" name="phone" type="tel" placeholder="082 000 0000" />
      <Field label="Vehicle" name="vehicle" placeholder="e.g. 2021 VW Polo" />
      <Field
        label="Estimate (R)"
        name="estimate"
        type="number"
        min={0}
        required={!!onCreated}
        placeholder="0"
      />
      <Field label="Work required / problem" name="work" wide placeholder="e.g. Brakes squealing" />
    </FormDialog>
  );
}

export function QuoteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="New quote"
      description="Add the customer and the issues the vehicle is facing."
      submitLabel="Create quote"
      onSubmit={(data) => {
        addQuote({
          customer: text(data, "customer"),
          vehicle: text(data, "vehicle"),
          issue: text(data, "issue"),
          amount: numberIn(text(data, "amount")),
        });
        onClose();
      }}
    >
      <Field label="Customer name" name="customer" placeholder="Full name" />
      <Field label="Vehicle" name="vehicle" required={false} placeholder="e.g. BMW X3" />
      <Field
        label="Issues facing the vehicle"
        name="issue"
        wide
        placeholder="e.g. Overheating, coolant leak"
      />
      <Field
        label="Quoted amount (R)"
        name="amount"
        type="number"
        min={0}
        required={false}
        placeholder="0"
      />
    </FormDialog>
  );
}

export function PartDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [kind, setKind] = useState<"stock" | "customer">("stock");
  const close = () => {
    setKind("stock");
    onClose();
  };
  return (
    <FormDialog
      open={open}
      onClose={close}
      title="Add a part"
      description="Record workshop stock, or a part that belongs to a customer."
      submitLabel="Add part"
      onSubmit={(data) => {
        addPart({
          kind,
          name: text(data, "name"),
          qty: Math.max(1, numberIn(text(data, "qty"))),
          supplier: text(data, "supplier"),
          customer: text(data, "customer"),
        });
        close();
      }}
    >
      <div
        className="grid grid-cols-2 gap-2 sm:col-span-2"
        role="radiogroup"
        aria-label="Part type"
      >
        {(
          [
            ["stock", "Stock part", "Part we keep on the shelf"],
            ["customer", "Customer part", "Part ordered or supplied for one customer"],
          ] as const
        ).map(([value, label, hint]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={kind === value}
            onClick={() => setKind(value)}
            className={`rounded-2xl border p-3 text-left transition-colors ${
              kind === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary hover:bg-accent"
            }`}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="mt-0.5 block text-[11px] opacity-75">{hint}</span>
          </button>
        ))}
      </div>
      <Field label="Part name" name="name" placeholder="e.g. Brake pad set" />
      <Field label="Quantity" name="qty" type="number" min={1} defaultValue={1} />
      <Field
        label="Supplier / part number"
        name="supplier"
        required={false}
        placeholder="e.g. BP-442 · Midas"
      />
      {kind === "customer" && (
        <Field label="Customer" name="customer" placeholder="Whose part is this?" />
      )}
    </FormDialog>
  );
}

export function CustomerDialog({
  open,
  onClose,
  niche,
}: {
  open: boolean;
  onClose: () => void;
  niche: Niche;
}) {
  const auto = niche === "automotive";
  const copy = customerCopy[niche];
  const [openJob, setOpenJob] = useState(true);
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Add a new customer"
      description="Capture their contact details and what they need."
      submitLabel="Add customer"
      onSubmit={(data) => {
        const name = text(data, "name");
        const phone = text(data, "phone");
        const detail = text(data, "detail");
        const notes = text(data, "notes");
        if (auto && openJob) {
          addJob({ customer: name, vehicle: detail, phone, work: notes, estimate: 0 });
        } else {
          addCustomer({
            niche,
            name,
            initials: initialsOf(name),
            detail: detail || "New customer",
            meta: "Added just now",
            value: "New",
            phone,
            ...(auto ? { vehicle: detail } : {}),
            problem: notes,
          });
        }
        onClose();
      }}
    >
      <Field label="Customer name" name="name" placeholder="Full name" />
      <Field label="Contact number" name="phone" type="tel" placeholder="082 000 0000" />
      <Field label={copy.detail} name="detail" wide placeholder={copy.detailHint} />
      <Field label={copy.notes} name="notes" wide required={auto} placeholder={copy.notesHint} />
      {auto && (
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={openJob}
            onChange={(event) => setOpenJob(event.target.checked)}
            className="size-4"
          />
          Open a job card for this vehicle
        </label>
      )}
    </FormDialog>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  wide = false,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string | undefined;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? options[0]}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

/** The add form for any module that has an entry in the form registry. */
export function ModuleFormDialog({
  moduleKey,
  open,
  onClose,
  existing,
}: {
  moduleKey: ModuleKey;
  open: boolean;
  onClose: () => void;
  existing: ModuleRecord[];
}) {
  const { niche } = useProduct();
  const form = moduleForms[moduleKey];
  if (!form) return null;
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={form.title}
      description={form.description}
      submitLabel={form.submit}
      onSubmit={(data) => {
        const values = Object.fromEntries(
          form.fields.map((field) => [field.name, text(data, field.name)]),
        );
        addModuleRecord(moduleKey, form.build(values, existing));
        const [title, detail] = form.feed(values);
        addFeed(niche, title, detail);
        onClose();
      }}
    >
      {form.fields.map((field) =>
        field.type === "date" ? (
          <NamedDateField
            key={field.name}
            label={field.label}
            name={field.name}
            min={parseDay(TODAY)}
            required={field.required ?? true}
          />
        ) : field.type === "select" ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            options={field.options ?? []}
            defaultValue={field.defaultValue}
            wide={field.wide ?? false}
          />
        ) : (
          <Field
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            required={field.required ?? true}
            wide={field.wide ?? false}
            defaultValue={field.defaultValue}
            min={field.type === "date" ? TODAY : field.type === "number" ? 0 : undefined}
          />
        ),
      )}
    </FormDialog>
  );
}

/** A one-off line for the register: a custom item, a service or a once-off job. */
export function CustomItemDialog({
  open,
  onClose,
  onAdd,
  title,
  itemLabel,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; price: number; customer: string }) => void;
  title: string;
  itemLabel: string;
}) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      description="Add a line that is not on the catalog to the current check."
      submitLabel="Add to check"
      onSubmit={(data) => {
        onAdd({
          name: text(data, "name"),
          price: numberIn(text(data, "price")),
          customer: text(data, "customer"),
        });
        onClose();
      }}
    >
      <Field
        label={itemLabel}
        name="name"
        wide
        placeholder={`Name of the ${itemLabel.toLowerCase()}`}
      />
      <Field label="Price (R)" name="price" type="number" min={1} placeholder="0" />
      <Field label="Customer (optional)" name="customer" required={false} placeholder="Name" />
    </FormDialog>
  );
}
