# Build Empirial POS from the v2 PRD

## Goal
Turn the existing hotel dashboard into the complete mock-data Empirial POS platform described in the uploaded PRD. Preserve the working hospitality booking, shared availability calendar, and card/cash checkout flows while making the product configurable across all six listed industries.

## Product foundation
- Add a shared in-session product store for the active industry, light/dark appearance, catalog, customers, checks, and each industry's operational records.
- Keep Hospitality active by default so the current Empirial Hotel experience remains immediately usable.
- Make industry switching update navigation, dashboard metrics, register terminology/catalog, customer details, and reports without separate codebases.
- Keep all data mock and session-only; no login, database, or payment processor.

## Design system
- Replace the current flat blue-accent styling with the PRD's strictly monochrome glass system.
- Use translucent light/dark surfaces, 20px blur, hairline borders, no shadows, large continuous corner radii, Space Grotesk, DM Sans, and tabular Rand amounts.
- Add light and dark themes with an iOS-style switch.
- Standardize reusable controls: glass panel, segmented control, switch, list row, numeric stepper, mobile sheet/desktop modal, and checkout keypad.
- Keep the desktop sidebar floating with an inset margin; add a fixed glass mobile tab bar.

## Shared pages
- **Overview:** render industry-specific KPIs, revenue snapshot, and recent activity.
- **Register:** render the active catalog and industry action, editable quantities, subtotal/service charge/total, Card, Cash with keypad/quick amounts/change, and charge-to-account where relevant.
- **Customers:** replace the hotel-only guest page with `/customers`, preserving `/guests` as a redirect, and show industry-specific customer fields and search.
- **Reports:** render a seven-day split revenue view and category/location performance for the active industry.
- **Settings:** add industry switching, light/dark mode, and mock staff/role management.

## Industry modules
- **Hospitality:** retain and restyle Rooms and Bookings; add booking detail/status/folio interactions and room status controls.
- **Food & Restaurant:** add Floor Plan and Kitchen pages, table checks, ticket status cycling, and split-bill checkout flow.
- **Retail:** add Inventory and Catalog pages, restock interaction, product/variant creation, and barcode entry in Register.
- **Beauty & Grooming:** add Appointments, Staff, and Packages pages with slot booking, availability switches, and package-to-register actions.
- **Automotive:** add Jobs, Parts, and Quotes pages with job details/status, parts allocation, and quote-to-invoice/job conversion.
- **Cleaning & Property:** add Scheduling, Billing, and Crew pages with job details/completion, recurring billing batches, and crew assignment.

## Routing and navigation
- Create every PRD route and show only the routes relevant to the active industry, alongside the five shared pages.
- Make active-industry actions carry context into the Register through shared in-session state.
- Give every page unique Empirial-specific title, description, Open Graph title/description, `og:type`, and Twitter card metadata.

## Validation
- Verify the app compiles cleanly.
- Test industry switching, conditional navigation, representative interactions in every module, Hospitality booking/calendar sharing, and card/cash checkout.
- Check desktop and mobile layouts for clipping, overlapping controls, readable glass contrast, and working bottom navigation.

## Defaults resolved from the PRD
- Service charge appears for Hospitality and Food only.
- Theme choice and active industry are session-level settings.
- Split payment is implemented for Food's split-bill flow; standard checkout remains card or cash elsewhere.
- Staff roles stay representative mock labels until authentication is introduced.
