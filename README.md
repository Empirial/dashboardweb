# Empirial: POS, back office and customer websites (demo)

A clickable prototype for selling websites plus point-of-sale systems to small businesses.
One registry-driven product covers seven industries, so every business gets its own public
website and a matching management dashboard without separate apps.

| Industry        | Public website          | Management lands on |
| --------------- | ----------------------- | ------------------- |
| Hotel (default) | `/marketing/hotel`      | Overview            |
| Restaurant      | `/marketing/restaurant` | Floor plan          |
| Retail          | `/marketing/retail`     | Inventory           |
| Salon           | `/marketing/salon`      | Appointments        |
| Auto            | `/marketing/auto`       | Job cards           |
| Property        | `/marketing/property`   | Scheduling          |
| Cleaning        | `/marketing/cleaning`   | Scheduling          |

The portfolio and pricing page lives at `/marketing`; the dashboard is at `/`.

## What is connected

Everything is mock data stored in the browser (`localStorage`), so it persists across reloads.

- A booking, order or enquiry on a public site appears in that business's dashboard
  (room board and bookings, floor plan, inventory, appointments, job cards, schedule), in the
  Overview activity feed and in Customers.
- A retail order reduces stock. A register sale adds to Overview and Reports revenue.
- **Settings → Reset demo** clears all saved demo data. The floating **Demo guide** walks a
  prospect through a suggested path for the active industry.

## Run it

```sh
npm install   # or: bun install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run format`.

## Where things live

| Path                              | Purpose                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `src/lib/platform-data.ts`        | Dashboard registry: modules, catalog, customers and records per industry          |
| `src/lib/marketing-data.ts`       | Public-site registry (copy, offerings, forms, management route) and pricing plans |
| `src/lib/demo-data.ts`            | Live store: sales, activity feed, module records, enquiry routing                 |
| `src/lib/persisted-store.ts`      | `localStorage`-backed store helper and demo reset                                 |
| `src/lib/reservations.ts`         | Hotel reservations shared by Rooms, Bookings, POS and the hotel site              |
| `src/components/BusinessSite.tsx` | The one marketing-site template used by every industry                            |
| `src/components/ModulePage.tsx`   | The one list/detail page template used by every dashboard module                  |

## Adding an industry

Add an entry to `nicheConfigs` (and `moduleRecords`) in `platform-data.ts`, then an entry to
`verticals` in `marketing-data.ts` with its `managementPath` and `managementNiche`, and handle
its `key` in `submitEnquiry` in `demo-data.ts`.

## Deployment

Builds with the Nitro **Vercel** preset (`vite.config.ts`). The project is also connected to
[Lovable](https://lovable.dev); avoid rewriting pushed git history.

## Known limits (it is a demo)

No real backend, authentication or payments. Data is per browser. The restaurant and cleaning
sites reuse hotel and property photography until their own images are added.
