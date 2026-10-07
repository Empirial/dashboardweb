import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AppShell, PageIntro, Panel } from "@/components/AppShell";
import { Field, FormDialog, text } from "@/components/WorkshopDialogs";
import { Button } from "@/components/ui/button";
import { addFeed } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct, type Niche } from "@/lib/product";
import type { Offering } from "@/lib/marketing-data";
import {
  addSiteOffering,
  editBuiltInOffering,
  removeSiteOffering,
  resetBuiltInOffering,
  setBuiltInHidden,
  sitesForNiche,
  updateSiteOffering,
  useOfferings,
} from "@/lib/site-offerings";

export const Route = createFileRoute("/website")({
  head: () =>
    pageMeta(
      "Website · Empirial POS",
      "Add services and products that appear on your marketing website.",
    ),
  component: WebsitePage,
});

const noun = (niche: Niche) => (niche === "retail" ? "product" : "service");

/** What the edit dialog is changing: a published item (by id) or a built-in (by original name). */
type Editing = { kind: "published" | "builtIn"; id: string; offering: Offering };

function WebsitePage() {
  const { niche } = useProduct();
  const sites = sitesForNiche(niche);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const site = sites.find((candidate) => candidate.key === siteKey) ?? sites[0];
  if (!site) return null;
  return (
    <AppShell title="Website" eyebrow={nicheConfigs[niche].shortLabel}>
      <WebsiteManager
        key={site.key}
        site={site}
        sites={sites}
        niche={niche}
        open={open}
        setOpen={setOpen}
        onSite={setSiteKey}
      />
    </AppShell>
  );
}

function WebsiteManager({
  site,
  sites,
  niche,
  open,
  setOpen,
  onSite,
}: {
  site: ReturnType<typeof sitesForNiche>[number];
  sites: ReturnType<typeof sitesForNiche>;
  niche: Niche;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSite: (key: string) => void;
}) {
  const { builtIn, published } = useOfferings(site);
  const [editing, setEditing] = useState<Editing | null>(null);
  const word = noun(niche);
  const shown = builtIn.filter((entry) => !entry.hidden).length;
  return (
    <>
      <PageIntro
        title="Website"
        description={`Add, edit, price or hide ${word}s here and ${site.brand}'s marketing site updates straight away.`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link to="/marketing/$vertical" params={{ vertical: site.key }} target="_blank">
                <ExternalLink />
                View website
              </Link>
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus />
              New {word}
            </Button>
          </div>
        }
      />
      {sites.length > 1 && (
        <div className="flex gap-2 px-1">
          {sites.map((candidate) => (
            <Button
              key={candidate.key}
              size="sm"
              variant={candidate.key === site.key ? "default" : "secondary"}
              onClick={() => onSite(candidate.key)}
            >
              {candidate.brand}
            </Button>
          ))}
        </div>
      )}
      <Panel title={`Added by you · ${published.length}`}>
        {published.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing added yet. Use "New {word}" to publish your first one.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {published.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.tag} · {item.detail}
                  </div>
                </div>
                <span className="text-sm font-semibold">{item.price}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Edit ${item.name}`}
                  onClick={() => setEditing({ kind: "published", id: item.id, offering: item })}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => {
                    removeSiteOffering(site.key, item.id);
                    addFeed(niche, "Removed from website", item.name);
                  }}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title={`Already on the website · ${shown} of ${builtIn.length} showing`}>
        <ul className="divide-y divide-border">
          {builtIn.map(({ id, offering, hidden, edited }) => (
            <li key={id} className={`flex items-center gap-3 py-3 ${hidden ? "opacity-55" : ""}`}>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {offering.name}
                  {hidden && (
                    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Hidden
                    </span>
                  )}
                  {edited && !hidden && (
                    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      Edited
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-muted-foreground">{offering.detail}</div>
              </div>
              <span className="text-sm font-semibold">{offering.price}</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Edit ${offering.name}`}
                onClick={() => setEditing({ kind: "builtIn", id, offering })}
              >
                <Pencil />
              </Button>
              {edited && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Restore ${id} to the original`}
                  onClick={() => {
                    resetBuiltInOffering(site.key, id);
                    addFeed(niche, "Restored on website", id);
                  }}
                >
                  <RotateCcw />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                aria-label={`${hidden ? "Show" : "Hide"} ${offering.name} on the website`}
                onClick={() => {
                  setBuiltInHidden(site.key, id, !hidden);
                  addFeed(
                    niche,
                    hidden ? "Shown on website" : "Hidden from website",
                    offering.name,
                  );
                }}
              >
                {hidden ? <Eye /> : <EyeOff />}
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Add a ${word} to your website`}
        description="It shows on the marketing site and in its enquiry form."
        submitLabel="Publish"
        onSubmit={(data) => {
          const name = text(data, "name");
          addSiteOffering(site.key, {
            name,
            detail: text(data, "detail"),
            price: Number(text(data, "price")) || 0,
            tag: text(data, "tag") || (word === "product" ? "Product" : "Service"),
          });
          addFeed(niche, "Published to website", name);
          setOpen(false);
        }}
      >
        <Field label="Name" name="name" wide placeholder="e.g. Deep tissue massage" />
        <Field label="Description" name="detail" wide placeholder="One line customers will read" />
        <Field label="Price (R)" name="price" type="number" min={0} required={false} />
        <Field label="Label" name="tag" required={false} placeholder="e.g. 60 min" />
      </FormDialog>
      {editing && (
        <FormDialog
          key={`${editing.kind}:${editing.id}`}
          open
          onClose={() => setEditing(null)}
          title={`Edit ${editing.offering.name}`}
          description="Changes show on the marketing site and in its enquiry form straight away."
          submitLabel="Save changes"
          onSubmit={(data) => {
            const input = {
              name: text(data, "name"),
              detail: text(data, "detail"),
              price: text(data, "price"),
              tag: text(data, "tag"),
            };
            if (editing.kind === "published") updateSiteOffering(site.key, editing.id, input);
            else editBuiltInOffering(site.key, editing.id, input);
            addFeed(niche, "Updated on website", input.name);
            setEditing(null);
          }}
        >
          <Field label="Name" name="name" wide defaultValue={editing.offering.name} />
          <Field label="Description" name="detail" wide defaultValue={editing.offering.detail} />
          <Field
            label="Price"
            name="price"
            required={false}
            defaultValue={editing.offering.price}
            placeholder="e.g. R850 or From R1 200 / night"
          />
          <Field
            label="Label"
            name="tag"
            required={false}
            defaultValue={editing.offering.tag}
            placeholder="e.g. 60 min"
          />
        </FormDialog>
      )}
    </>
  );
}
