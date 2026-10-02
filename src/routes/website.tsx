import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { AppShell, PageIntro, Panel } from "@/components/AppShell";
import { Field, FormDialog, text } from "@/components/WorkshopDialogs";
import { Button } from "@/components/ui/button";
import { addFeed } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct, type Niche } from "@/lib/product";
import {
  addSiteOffering,
  removeSiteOffering,
  sitesForNiche,
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
  const word = noun(niche);
  return (
    <>
      <PageIntro
        title="Website"
        description={`Add ${word}s here and they appear on ${site.brand}'s marketing site straight away.`}
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
      <Panel title={`Already on the website · ${builtIn.length}`}>
        <ul className="divide-y divide-border">
          {builtIn.map((item) => (
            <li key={item.name} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{item.name}</div>
                <div className="truncate text-xs text-muted-foreground">{item.detail}</div>
              </div>
              <span className="text-sm font-semibold">{item.price}</span>
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
    </>
  );
}
