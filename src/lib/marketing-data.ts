import hotelHero from "@/assets/empirial-hotel-hero.jpg";
import hotelDetail from "@/assets/empirial-hotel-detail.jpg";
import propertyHero from "@/assets/empirial-property-hero.jpg";
import propertyDetail from "@/assets/empirial-property-detail.jpg";
import retailHero from "@/assets/empirial-retail-hero.jpg";
import retailDetail from "@/assets/empirial-retail-detail.jpg";
import salonHero from "@/assets/empirial-salon-hero.jpg";
import salonDetail from "@/assets/empirial-salon-detail.jpg";
import autoHero from "@/assets/empirial-auto-hero.jpg";
import autoDetail from "@/assets/empirial-auto-detail.jpg";
import type { Niche } from "@/lib/product";

export type VerticalKey =
  "hotel" | "property" | "retail" | "salon" | "auto" | "restaurant" | "cleaning";

export type Offering = {
  name: string;
  detail: string;
  price: string;
  tag: string;
};

export type VerticalConfig = {
  key: VerticalKey;
  tab: string;
  brand: string;
  category: string;
  hero: string;
  detailImage: string;
  eyebrow: string;
  headline: string;
  sub: string;
  primaryCta: string;
  exploreLabel: string;
  aboutTitle: string;
  about: string;
  promise: string;
  experienceTitle: string;
  experience: string;
  closingTitle: string;
  closingText: string;
  managementPath: "/overview" | "/scheduling" | "/inventory" | "/appointments" | "/jobs" | "/floor-plan";
  managementNiche: Niche;
  highlights: [string, string, string];
  /** One line per highlight, shown on the strip under the hero. */
  highlightText: [string, string, string];
  /** The problem this system solves for the business. Shown on the portfolio card. */
  solves: string;
  testimonials: Array<{ quote: string; name: string; role: string }>;
  /** CSS object-position for the hero photo, to keep faces in frame. */
  heroPosition?: string;
  offerings: Offering[];
  formTitle: string;
  formDescription: string;
  formFields: Array<{ label: string; type: string; placeholder: string }>;
};

export const verticals: VerticalConfig[] = [
  {
    key: "hotel",
    solves:
      "Keeps every room, booking and meal bill in one place. Guests book on your website and the reservation lands on your room calendar, with no double bookings.",
    highlightText: [
      "A full breakfast on the terrace every morning.",
      "Spacious rooms with terraces and views of the bush.",
      "Early and late arrival options to suit your travel day.",
    ],
    testimonials: [
      {
        quote: "We arrived tired and left rested. The terrace breakfast alone was worth the drive.",
        name: "Naledi M.",
        role: "Weekend guest",
      },
      {
        quote: "Booking took two minutes and our room was exactly as pictured.",
        name: "Johan & Elmarie V.",
        role: "Anniversary stay",
      },
      {
        quote: "Warm, quiet and effortless. We have already booked again for December.",
        name: "Sipho K.",
        role: "Returning guest",
      },
    ],
    tab: "Hotel",
    brand: "Empirial Hotels",
    category: "Boutique lodge",
    hero: hotelHero,
    detailImage: hotelDetail,
    eyebrow: "Stay close to what matters",
    headline: "Your home from home, set against the wild.",
    sub: "Slow mornings, generous rooms and warm South African hospitality. Come for a night, stay for the feeling.",
    primaryCta: "Book your stay",
    exploreLabel: "Explore rooms",
    aboutTitle: "Made for unhurried stays",
    about:
      "Empirial Hotels brings together restful interiors, thoughtful hosting and the quiet of the landscape. Every stay is personal, comfortable and easy from arrival to departure.",
    promise: "A considered lodge experience with the warmth of home.",
    experienceTitle: "Arrive, exhale, and let us take care of the details",
    experience:
      "Start with breakfast on the terrace, spend the afternoon exploring, and return to a room prepared for a quiet evening. Your stay moves at your pace.",
    closingTitle: "Ready for your home from home?",
    closingText: "Choose your room and dates, and begin planning a restorative stay.",
    managementPath: "/overview",
    managementNiche: "hospitality",
    highlights: ["Breakfast included", "Private terraces", "Flexible check-in"],
    offerings: [
      {
        name: "Garden Room",
        detail: "King bed, private terrace and a full breakfast each morning.",
        price: "From R1 840 / night",
        tag: "2 guests",
      },
      {
        name: "Bush Suite",
        detail: "Separate lounge, outdoor shower and views across the bush.",
        price: "From R3 400 / night",
        tag: "2 guests",
      },
      {
        name: "Twin Room",
        detail: "Two comfortable beds, ideal for friends or colleagues travelling together.",
        price: "From R1 450 / night",
        tag: "2 guests",
      },
      {
        name: "Single Retreat",
        detail: "A quiet, well-priced room for the solo traveller.",
        price: "From R980 / night",
        tag: "1 guest",
      },
      {
        name: "Family Villa",
        detail: "Two bedrooms, a plunge pool and breakfast for the whole family.",
        price: "From R4 600 / night",
        tag: "4 guests",
      },
    ],
    formTitle: "Plan your stay",
    formDescription:
      "Choose your dates within the next 30 nights and we’ll hold the best available room.",
    formFields: [
      { label: "Check in", type: "date", placeholder: "" },
      { label: "Check out", type: "date", placeholder: "" },
      { label: "Guests", type: "number", placeholder: "2" },
      { label: "Your name", type: "text", placeholder: "Full name" },
    ],
  },
  {
    key: "property",
    solves:
      "Tracks viewings, listings and property-care visits in one schedule. Enquiries from your website go straight onto the right calendar, so no lead goes cold.",
    highlightText: [
      "Visit homes on your schedule with a local specialist.",
      "Agents who know the streets, schools and prices.",
      "Cleaning, garden and maintenance after you move in.",
    ],
    testimonials: [
      {
        quote: "They arranged a viewing the same week and answered every question about the area.",
        name: "Thandi N.",
        role: "Home buyer",
      },
      {
        quote: "Our rental is spotless and the tenants are always sorted. We never chase anyone.",
        name: "Mark P.",
        role: "Landlord",
      },
      {
        quote: "The home care team have become part of our household. Reliable every visit.",
        name: "Ayesha D.",
        role: "Homeowner",
      },
    ],
    tab: "Property",
    brand: "Empirial Property",
    category: "Homes & property care",
    hero: propertyHero,
    detailImage: propertyDetail,
    eyebrow: "Find your place",
    headline: "A better way to find a home you love.",
    sub: "Explore considered homes, arrange a private viewing and get practical help caring for your property.",
    primaryCta: "Arrange a viewing",
    exploreLabel: "View properties",
    aboutTitle: "Property, handled personally",
    about:
      "We connect people with inviting homes and dependable property care. Local knowledge, responsive service and clear communication shape every viewing and every visit.",
    promise: "Beautiful homes, thoughtful service and people who pick up the phone.",
    experienceTitle: "See the whole picture before you make a move",
    experience:
      "From a private viewing to practical questions about the neighbourhood, we give you the time and local context to choose with confidence.",
    closingTitle: "Could your next place be here?",
    closingText: "Arrange a private viewing and experience the property in person.",
    managementPath: "/scheduling",
    managementNiche: "cleaning",
    highlights: ["Private viewings", "Local specialists", "Property care"],
    offerings: [
      {
        name: "Parkview Courtyard Home",
        detail: "3 bedrooms, 2 bathrooms and a private garden in a quiet street.",
        price: "R3 850 000",
        tag: "For sale",
      },
      {
        name: "Rosebank City Apartment",
        detail: "2 bedrooms, a balcony and secure parking close to transport.",
        price: "R18 500 / month",
        tag: "To let",
      },
      {
        name: "Garden Cottage",
        detail: "A bright 1-bedroom cottage with its own entrance and patio.",
        price: "R9 500 / month",
        tag: "To let",
      },
      {
        name: "Studio Office Suite",
        detail: "Open-plan office space with meeting room and fibre ready.",
        price: "R12 800 / month",
        tag: "Commercial",
      },
      {
        name: "Complete Home Care",
        detail: "Scheduled cleaning, garden and maintenance after you move in.",
        price: "From R1 450 / visit",
        tag: "Property care",
      },
    ],
    formTitle: "Arrange a private viewing",
    formDescription: "Tell us what caught your eye and when you would like to visit.",
    formFields: [
      { label: "Property", type: "text", placeholder: "Property or service" },
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
  {
    key: "retail",
    solves:
      "Connects your online shop and your till to one stock list. An online order updates inventory straight away and every sale shows up in your reports.",
    highlightText: [
      "Every piece is made by South African makers we know.",
      "Linen, ceramic and fibre that age beautifully.",
      "Tracked delivery to your door, anywhere in the country.",
    ],
    testimonials: [
      {
        quote: "Everything is beautifully made and arrived wrapped like a gift.",
        name: "Lindiwe S.",
        role: "Online customer",
      },
      {
        quote: "The linen shirt gets better with every wash. I keep coming back for gifts.",
        name: "Chris B.",
        role: "Regular",
      },
      {
        quote: "Fast delivery, and a real person helped when I needed to swap a size.",
        name: "Zodwa M.",
        role: "Customer",
      },
    ],
    tab: "Retail",
    brand: "Empirial Living",
    category: "Home & lifestyle shop",
    hero: retailHero,
    detailImage: retailDetail,
    eyebrow: "The considered collection",
    headline: "Everyday pieces, chosen to live beautifully.",
    sub: "Natural textures, useful objects and effortless clothing from makers we admire. Made to be used, kept and loved.",
    primaryCta: "Shop the collection",
    exploreLabel: "Browse new arrivals",
    aboutTitle: "Fewer, better things",
    about:
      "Empirial Living is a thoughtful edit of homeware, clothing and gifts. We choose honest materials, useful forms and pieces that become better with time.",
    promise: "A slower, more considered way to shop.",
    experienceTitle: "Objects with a place in everyday life",
    experience:
      "Our collection brings useful forms, honest materials and local craft together in a calm shopping experience designed around discovery.",
    closingTitle: "Find something worth keeping",
    closingText: "Browse the latest edit of homeware, clothing and thoughtful gifts.",
    managementPath: "/inventory",
    managementNiche: "retail",
    highlights: ["Local makers", "Natural materials", "Nationwide delivery"],
    offerings: [
      {
        name: "Stone Carafe",
        detail: "Hand-finished ceramic carafe, 1.2 litre.",
        price: "R540",
        tag: "Home",
      },
      {
        name: "Linen Shirt",
        detail: "Washed linen in olive with a relaxed, easy fit.",
        price: "R890",
        tag: "Wear",
      },
      {
        name: "Field Tote",
        detail: "Natural fibre tote with reinforced handles.",
        price: "R680",
        tag: "Carry",
      },
      {
        name: "Candle No. 04",
        detail: "Slow-burning soy candle in a hand-poured ceramic cup.",
        price: "R280",
        tag: "Home",
      },
      {
        name: "Leather Wallet",
        detail: "Vegetable-tanned leather that softens with every year.",
        price: "R420",
        tag: "Carry",
      },
    ],
    formTitle: "Your shopping bag",
    formDescription:
      "Your selected piece is ready. Complete this demo order to see the full journey.",
    formFields: [
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Email", type: "email", placeholder: "you@example.com" },
      { label: "Delivery city", type: "text", placeholder: "Johannesburg" },
      { label: "Quantity", type: "number", placeholder: "1" },
    ],
  },
  {
    key: "salon",
    heroPosition: "52% 40%",
    solves:
      "Fills your chairs and ends diary chaos. Clients book online, appointments appear on your calendar and the register knows exactly what they had done.",
    highlightText: [
      "Stylists who understand textured and natural hair.",
      "Braids, twists and styles that protect your hair.",
      "A proper chat about your hair before we start.",
    ],
    testimonials: [
      {
        quote:
          "Finally a stylist who listened. My braids lasted six weeks and my edges are healthy.",
        name: "Zanele K.",
        role: "Regular client",
      },
      {
        quote: "The silk press was flawless and nothing was rushed.",
        name: "Nadia P.",
        role: "Client",
      },
      {
        quote: "Booking online was easy and they remembered exactly what I like.",
        name: "Amara S.",
        role: "Client",
      },
    ],
    tab: "Salon",
    brand: "Empirial Salon",
    category: "Hair & beauty studio",
    hero: salonHero,
    detailImage: salonDetail,
    eyebrow: "Made for your best hair days",
    headline: "Beautiful hair, shaped around you.",
    sub: "Protective styles, natural hair care and restorative treatments delivered with time, skill and a genuinely personal touch.",
    primaryCta: "Book an appointment",
    exploreLabel: "Explore the menu",
    aboutTitle: "Care is part of the service",
    about:
      "Our stylists begin by listening. From everyday maintenance to a complete new look, we protect the health of your hair while creating a finish that feels like you.",
    promise: "Expert hands, considered products and time reserved just for you.",
    experienceTitle: "Your appointment begins with listening",
    experience:
      "We make space for a proper consultation, a comfortable service and clear aftercare so your finished look remains healthy and easy to wear.",
    closingTitle: "Make time for your best hair day",
    closingText: "Choose your service and preferred date, and reserve your chair.",
    managementPath: "/appointments",
    managementNiche: "beauty",
    highlights: ["Natural hair specialists", "Protective styling", "Personal consultations"],
    offerings: [
      {
        name: "Knotless Braids",
        detail: "Consultation, wash, braiding and a finish that lasts weeks.",
        price: "From R1 200",
        tag: "3 to 5 hours",
      },
      {
        name: "Silk Press",
        detail: "Wash, treatment and a heat-protected, glossy finish.",
        price: "From R650",
        tag: "90 minutes",
      },
      {
        name: "Curl Ritual",
        detail: "Deep hydration, shaping and definition for natural curls.",
        price: "From R780",
        tag: "2 hours",
      },
      {
        name: "Protective Twists",
        detail: "Neat twists that protect your ends and save you styling time.",
        price: "From R950",
        tag: "2 to 3 hours",
      },
      {
        name: "Wash & Blow-dry",
        detail: "A relaxed wash and smooth blow-dry for any day or event.",
        price: "From R320",
        tag: "1 hour",
      },
    ],
    formTitle: "Reserve your chair",
    formDescription:
      "Choose a service and preferred day. We’ll confirm the closest available time.",
    formFields: [
      { label: "Service", type: "text", placeholder: "e.g. Knotless braids" },
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
  {
    key: "auto",
    solves:
      "Runs your workshop from drop-off to collection. Job cards, quotes, parts and customer contacts live in one place, and bookings arrive from your website.",
    highlightText: [
      "A written quote before any work starts, with no surprises.",
      "Qualified technicians with years on the same makes.",
      "Genuine and approved parts, backed by warranty.",
    ],
    testimonials: [
      {
        quote:
          "They explained the brake problem, showed me the old pads and quoted before starting. Honest work.",
        name: "Peter M.",
        role: "Toyota Fortuner owner",
      },
      {
        quote:
          "Booked online at night and the car was ready when they said. I won't go anywhere else.",
        name: "Grace A.",
        role: "VW Polo owner",
      },
      {
        quote:
          "Our fleet of four has been serviced here for a year. No surprises on the invoice, ever.",
        name: "Greenway Ltd",
        role: "Fleet customer",
      },
    ],
    heroPosition: "62% 12%",
    tab: "Auto",
    brand: "Empirial Auto",
    category: "Vehicle care & repair",
    hero: autoHero,
    detailImage: autoDetail,
    eyebrow: "Confidence in every kilometre",
    headline: "Car care that keeps you moving.",
    sub: "Straight answers, careful workmanship and dependable repairs for the car that carries your life.",
    primaryCta: "Book a service",
    exploreLabel: "See our services",
    aboutTitle: "Good work, clearly explained",
    about:
      "Empirial Auto combines experienced technicians with careful diagnostics. We explain what your car needs, agree the work with you and keep you informed until the keys are back in your hand.",
    promise: "Professional workshop care without the guesswork.",
    experienceTitle: "Know what your car needs and why",
    experience:
      "We inspect carefully, explain clearly and agree the work before it begins. You stay informed from drop-off to collection.",
    closingTitle: "Keep your car ready for the road",
    closingText: "Tell us what you drive and choose a preferred workshop date.",
    managementPath: "/jobs",
    managementNiche: "automotive",
    highlights: ["Clear estimates", "Experienced technicians", "Quality parts"],
    offerings: [
      {
        name: "Essential Service",
        detail: "Oil and filter change, fluid top-ups and a 40-point safety inspection.",
        price: "From R1 950",
        tag: "Routine care",
      },
      {
        name: "Brake Inspection",
        detail: "Pads, discs and fluid checked, with a road test and a written report.",
        price: "From R650",
        tag: "Safety",
      },
      {
        name: "Engine Diagnostics",
        detail: "Electronic fault scan and a technician's assessment explained in plain language.",
        price: "From R850",
        tag: "Diagnostics",
      },
      {
        name: "Tyres & Alignment",
        detail: "Fitting, balancing and wheel alignment to stop uneven wear.",
        price: "From R520",
        tag: "Handling",
      },
      {
        name: "Full Workshop Repair",
        detail:
          "Suspension, clutch, cooling and gearbox work, quoted and approved before we start.",
        price: "Quoted per job",
        tag: "Repairs",
      },
    ],
    formTitle: "Book your car in",
    formDescription: "Tell us about your car and we’ll confirm a workshop time.",
    formFields: [
      { label: "Vehicle", type: "text", placeholder: "e.g. 2021 VW Polo" },
      { label: "Service needed", type: "text", placeholder: "Service or concern" },
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
  {
    key: "restaurant",
    solves:
      "Takes reservations online, shows every table and kitchen ticket live, and splits and settles bills at the register, so service stays calm on a full night.",
    highlightText: [
      "Menus that change with what is fresh and in season.",
      "Candlelit tables outside, with views over the valley.",
      "Space for celebrations and business dinners up to 20.",
    ],
    testimonials: [
      {
        quote:
          "The kingklip was perfect and the sunset made the evening. Best table in the valley.",
        name: "Nomsa D.",
        role: "Diner",
      },
      {
        quote: "We hosted twenty guests and the team handled everything calmly.",
        name: "David H.",
        role: "Private dining",
      },
      {
        quote: "Easy to reserve, quick to seat and careful about my allergies.",
        name: "Priya N.",
        role: "Guest",
      },
    ],
    tab: "Restaurant",
    brand: "Empirial Table",
    category: "Restaurant & bar",
    hero: hotelDetail,
    detailImage: hotelHero,
    eyebrow: "Dinner, slowly",
    headline: "A table with a view worth staying for.",
    sub: "Seasonal South African cooking, a thoughtful wine list and golden-hour dinners on the terrace.",
    primaryCta: "Reserve a table",
    exploreLabel: "See the menu",
    aboutTitle: "Cooked with care, served without fuss",
    about:
      "Empirial Table is a relaxed restaurant built around local produce, open-fire cooking and generous hosting. Every plate is made to be shared and every evening is paced to suit you.",
    promise: "Seasonal food, honest service and a table that waits for you.",
    experienceTitle: "From the first glass to the last spoonful",
    experience:
      "Arrive for sundowners, settle into the terrace and let the kitchen guide the evening. We look after dietary needs, celebrations and late tables.",
    closingTitle: "Your table is waiting",
    closingText: "Choose your evening and party size, and we will hold the best table for you.",
    managementPath: "/floor-plan",
    managementNiche: "food",
    highlights: ["Seasonal menu", "Terrace tables", "Private dining"],
    offerings: [
      {
        name: "Grilled Kingklip",
        detail: "Cape Malay butter, charred greens and crisp potatoes.",
        price: "R245",
        tag: "Main",
      },
      {
        name: "Short Rib",
        detail: "Slow braised, with smoked mash and a rich jus.",
        price: "R275",
        tag: "Main",
      },
      {
        name: "Burrata",
        detail: "Creamy burrata, roasted tomatoes and warm focaccia.",
        price: "R125",
        tag: "Starter",
      },
      {
        name: "Malva Pudding",
        detail: "Warm apricot sponge with vanilla custard.",
        price: "R82",
        tag: "Dessert",
      },
      {
        name: "Chenin Glass",
        detail: "A crisp local Chenin, poured by the glass.",
        price: "R78",
        tag: "Wine",
      },
    ],
    formTitle: "Reserve a table",
    formDescription: "Tell us when you would like to dine and we will confirm your table.",
    formFields: [
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Guests", type: "number", placeholder: "2" },
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
  {
    key: "cleaning",
    solves:
      "Schedules crews, handles recurring billing and captures every request from your website, so no job and no invoice slips through the cracks.",
    highlightText: [
      "Background-checked, trained and insured teams.",
      "Weekly, fortnightly or monthly, with the same crew.",
      "Products that are safe for children, pets and the planet.",
    ],
    testimonials: [
      {
        quote: "The office feels brand new after the deep clean. They even did inside the oven.",
        name: "Rosebank Dental",
        role: "Weekly office clean",
      },
      {
        quote: "The same friendly crew every fortnight, and one simple invoice at month end.",
        name: "S. Naidoo",
        role: "Home client",
      },
      {
        quote: "I booked online in minutes and the team arrived on time with everything.",
        name: "Lerato K.",
        role: "Once-off clean",
      },
    ],
    tab: "Cleaning",
    brand: "Empirial Clean",
    category: "Home & office cleaning",
    hero: propertyDetail,
    detailImage: propertyHero,
    eyebrow: "A calmer place to come home to",
    headline: "Spotless spaces, without the effort.",
    sub: "Reliable, vetted crews for homes and offices. Book a once-off clean or a regular schedule that runs itself.",
    primaryCta: "Request a clean",
    exploreLabel: "View our services",
    aboutTitle: "Trusted crews, consistent results",
    about:
      "Empirial Clean sends trained, vetted teams on time with the right equipment. We agree the scope up front, keep you updated and invoice simply, so you can get on with your day.",
    promise: "Clean spaces, reliable people and no surprises on the invoice.",
    experienceTitle: "Booked in minutes, done properly",
    experience:
      "Tell us about your space and we schedule a crew that suits you. Recurring clients get the same team each visit and a single tidy monthly invoice.",
    closingTitle: "Ready for a fresh start?",
    closingText: "Choose a service and date, and we will confirm a crew.",
    managementPath: "/scheduling",
    managementNiche: "cleaning",
    highlights: ["Vetted crews", "Recurring plans", "Eco-friendly products"],
    offerings: [
      {
        name: "2-bed Home Clean",
        detail: "Kitchen, bathrooms, floors and dusting throughout.",
        price: "From R680",
        tag: "Residential",
      },
      {
        name: "Deep Clean",
        detail: "A top-to-bottom reset, including inside appliances.",
        price: "From R1 850",
        tag: "Deep clean",
      },
      {
        name: "Office Half-day",
        detail: "Workstations, kitchenette and common areas, four hours.",
        price: "From R1 450",
        tag: "Commercial",
      },
      {
        name: "Carpet Treatment",
        detail: "Deep extraction and stain treatment for carpets and rugs.",
        price: "From R480",
        tag: "Add-on",
      },
      {
        name: "Move-out Clean",
        detail: "A thorough clean to hand a property over spotless.",
        price: "From R2 200",
        tag: "Once-off",
      },
    ],
    formTitle: "Request a clean",
    formDescription: "Choose a service and day. We will confirm your crew and arrival time.",
    formFields: [
      { label: "Service", type: "text", placeholder: "e.g. Deep clean" },
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
];

export const verticalByKey = (key: string | undefined): VerticalConfig =>
  verticals.find((vertical) => vertical.key === key) ?? (verticals[0] as VerticalConfig);

/** The Empirial Designs launch offer shown on the portfolio page (rand, excl. VAT). */
export const offer = {
  name: "Complete business system",
  price: "R3 000",
  wasPrice: "R7 500",
  deposit: "R1 200",
  depositPercent: 40,
  totalSpots: 8,
  spotsLeft: 5,
  blurb: "Your own website and a back-office system working together, built for your industry.",
  features: [
    "A custom website with your branding, photos and services",
    "Online bookings and enquiries that land in your dashboard",
    "Register for card and cash sales",
    "Customers, stock, jobs or appointments for your industry",
    "Sales reports and staff roles",
    "Works on your phone, tablet and laptop",
  ],
};
