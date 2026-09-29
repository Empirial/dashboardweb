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

export type VerticalKey = "hotel" | "property" | "retail" | "salon" | "auto";

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
  managementPath: "/" | "/scheduling" | "/inventory" | "/appointments" | "/jobs";
  managementNiche: Niche;
  highlights: [string, string, string];
  offerings: Offering[];
  formTitle: string;
  formDescription: string;
  formFields: Array<{ label: string; type: string; placeholder: string }>;
};

export const verticals: VerticalConfig[] = [
  {
    key: "hotel",
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
    about: "Empirial Hotels brings together restful interiors, thoughtful hosting and the quiet of the landscape. Every stay is personal, comfortable and easy from arrival to departure.",
    promise: "A considered lodge experience with the warmth of home.",
    experienceTitle: "Arrive, exhale, and let us take care of the details",
    experience: "Start with breakfast on the terrace, spend the afternoon exploring, and return to a room prepared for a quiet evening. Your stay moves at your pace.",
    closingTitle: "Ready for your home from home?",
    closingText: "Choose your room and dates, and begin planning a restorative stay.",
    managementPath: "/",
    managementNiche: "hospitality",
    highlights: ["Breakfast included", "Private terraces", "Flexible check-in"],
    offerings: [
      { name: "Garden Room", detail: "King bed · private terrace · breakfast", price: "From R1 850 / night", tag: "2 guests" },
      { name: "Deluxe Bush Suite", detail: "Lounge · bush views · outdoor shower", price: "From R2 750 / night", tag: "2 guests" },
      { name: "Family Villa", detail: "Two bedrooms · plunge pool · full breakfast", price: "From R4 600 / night", tag: "4 guests" },
    ],
    formTitle: "Plan your stay",
    formDescription: "Choose your dates and we’ll confirm the best available room.",
    formFields: [
      { label: "Check in", type: "date", placeholder: "" },
      { label: "Check out", type: "date", placeholder: "" },
      { label: "Guests", type: "number", placeholder: "2" },
      { label: "Your name", type: "text", placeholder: "Full name" },
    ],
  },
  {
    key: "property",
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
    about: "We connect people with inviting homes and dependable property care. Local knowledge, responsive service and clear communication shape every viewing and every visit.",
    promise: "Beautiful homes, thoughtful service and people who pick up the phone.",
    experienceTitle: "See the whole picture before you make a move",
    experience: "From a private viewing to practical questions about the neighbourhood, we give you the time and local context to choose with confidence.",
    closingTitle: "Could your next place be here?",
    closingText: "Arrange a private viewing and experience the property in person.",
    managementPath: "/scheduling",
    managementNiche: "cleaning",
    highlights: ["Private viewings", "Local specialists", "Property care"],
    offerings: [
      { name: "Parkview Courtyard Home", detail: "3 bedrooms · 2 bathrooms · garden", price: "R3 850 000", tag: "For sale" },
      { name: "Rosebank City Apartment", detail: "2 bedrooms · balcony · secure parking", price: "R18 500 / month", tag: "To let" },
      { name: "Complete Home Care", detail: "Scheduled cleaning · garden · maintenance", price: "From R1 450 / visit", tag: "Property care" },
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
    about: "Empirial Living is a thoughtful edit of homeware, clothing and gifts. We choose honest materials, useful forms and pieces that become better with time.",
    promise: "A slower, more considered way to shop.",
    experienceTitle: "Objects with a place in everyday life",
    experience: "Our collection brings useful forms, honest materials and local craft together in a calm shopping experience designed around discovery.",
    closingTitle: "Find something worth keeping",
    closingText: "Browse the latest edit of homeware, clothing and thoughtful gifts.",
    managementPath: "/inventory",
    managementNiche: "retail",
    highlights: ["Local makers", "Natural materials", "Nationwide delivery"],
    offerings: [
      { name: "Stone Carafe", detail: "Hand-finished ceramic · 1.2 litre", price: "R680", tag: "Home" },
      { name: "Field Linen Shirt", detail: "Washed linen · olive · relaxed fit", price: "R1 250", tag: "Wear" },
      { name: "Woven Market Tote", detail: "Natural fibre · reinforced handles", price: "R890", tag: "Carry" },
    ],
    formTitle: "Your shopping bag",
    formDescription: "Your selected piece is ready. Complete this mock order to see the full journey.",
    formFields: [
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Email", type: "email", placeholder: "you@example.com" },
      { label: "Delivery city", type: "text", placeholder: "Johannesburg" },
      { label: "Quantity", type: "number", placeholder: "1" },
    ],
  },
  {
    key: "salon",
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
    about: "Our stylists begin by listening. From everyday maintenance to a complete new look, we protect the health of your hair while creating a finish that feels like you.",
    promise: "Expert hands, considered products and time reserved just for you.",
    experienceTitle: "Your appointment begins with listening",
    experience: "We make space for a proper consultation, a comfortable service and clear aftercare so your finished look remains healthy and easy to wear.",
    closingTitle: "Make time for your best hair day",
    closingText: "Choose your service and preferred date, and reserve your chair.",
    managementPath: "/appointments",
    managementNiche: "beauty",
    highlights: ["Natural hair specialists", "Protective styling", "Personal consultations"],
    offerings: [
      { name: "Knotless Braids", detail: "Consultation · wash · finish", price: "From R1 200", tag: "3–5 hours" },
      { name: "Silk Press", detail: "Wash · treatment · heat-protected finish", price: "From R650", tag: "90 minutes" },
      { name: "Curl Ritual", detail: "Hydration · shaping · definition", price: "From R780", tag: "2 hours" },
    ],
    formTitle: "Reserve your chair",
    formDescription: "Choose a service and preferred day. We’ll confirm the closest available time.",
    formFields: [
      { label: "Service", type: "text", placeholder: "e.g. Knotless braids" },
      { label: "Preferred date", type: "date", placeholder: "" },
      { label: "Your name", type: "text", placeholder: "Full name" },
      { label: "Phone", type: "tel", placeholder: "065 000 0000" },
    ],
  },
  {
    key: "auto",
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
    about: "Empirial Auto combines experienced technicians with careful diagnostics. We explain what your car needs, agree the work with you and keep you informed until the keys are back in your hand.",
    promise: "Professional workshop care without the guesswork.",
    experienceTitle: "Know what your car needs and why",
    experience: "We inspect carefully, explain clearly and agree the work before it begins. You stay informed from drop-off to collection.",
    closingTitle: "Keep your car ready for the road",
    closingText: "Tell us what you drive and choose a preferred workshop date.",
    managementPath: "/jobs",
    managementNiche: "automotive",
    highlights: ["Clear estimates", "Experienced technicians", "Quality parts"],
    offerings: [
      { name: "Essential Service", detail: "Oil · filters · safety inspection", price: "From R1 950", tag: "Routine care" },
      { name: "Brake Inspection", detail: "Pads · discs · fluid · road test", price: "From R650", tag: "Safety" },
      { name: "Engine Diagnostics", detail: "Electronic scan · technician assessment", price: "From R850", tag: "Diagnostics" },
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
];

export const verticalByKey = (key: string | undefined): VerticalConfig =>
  verticals.find((vertical) => vertical.key === key) ?? verticals[0] as VerticalConfig;