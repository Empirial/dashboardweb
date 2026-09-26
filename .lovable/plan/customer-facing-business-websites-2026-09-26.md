# Customer-facing business websites

## Goal
Replace the POS-focused marketing page with five polished customer websites inside one Empirial Designs portfolio: Hotel, Property, Retail, Salon, and Auto. Each site will sell or book the business itself, not explain its management software.

## Pages and customer journeys
- Keep `/marketing` as the portfolio switcher and entry point.
- Add shareable customer-facing pages for each business, driven by one shared business registry rather than separate applications.
- Give every business a distinctive home, about, and offering view with its own navigation and metadata.
- Hotel: browse rooms, inspect rates and amenities, choose dates and guests, then complete a mock booking enquiry.
- Property: browse homes and services, inspect a listing, and submit a mock viewing or service enquiry.
- Retail: browse products, filter collections, add items to a mock bag, and complete a mock checkout.
- Salon: browse hairstyles and treatments, choose a service and stylist, and complete a mock appointment request.
- Auto: browse repair services, select a vehicle/service, and complete a mock workshop booking.

## Visual direction
- Generate a cohesive, high-quality image set grounded in each business: welcoming hotel interiors, attractive properties, real retail products, salon styles/treatments, and workshop/car-repair scenes.
- Give each business its own visual character and accent colour while keeping Empirial Designs as the parent brand.
- Use editorial, image-led layouts with clear customer actions; remove POS screenshots, software pricing, operational copy, and unnecessary icons.
- Keep the current warm, premium typography and use restrained motion with strong mobile layouts.

## Prototype behavior
- Make navigation, galleries, filters, selection controls, booking/enquiry forms, bag, and confirmation states functional with in-session mock data only.
- Preserve the existing Management link back to the POS.
- Keep Hospitality as the default business when opening the portfolio.

## Technical details
- Extend the registry so content, imagery, routes, forms, and calls to action change by business without duplicated site code.
- Add route files for every shareable page and unique title, description, Open Graph title/description, `og:type`, and Twitter card metadata.
- Store generated website imagery in the project and import it directly.
- Record the registry-driven website architecture in `AGENTS.md`.

## Validation
- Test all five business switches and their primary customer journey.
- Check desktop and mobile for readable overlays, image crops, navigation, and form completion.
- Confirm the project builds without errors and no POS-management language remains on customer pages.
