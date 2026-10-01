import type { Niche } from "./product";

/** Industry wording for the customer forms and profile pop-up. */
export const customerCopy: Record<
  Niche,
  {
    detail: string;
    detailHint: string;
    notes: string;
    notesHint: string;
    current: string;
    noCurrent: string;
  }
> = {
  hospitality: {
    detail: "Room or stay",
    detailHint: "e.g. Room 209 · 2 nights",
    notes: "Preferences",
    notesHint: "e.g. Late check-in, quiet room",
    current: "Current or next stay",
    noCurrent: "No stay booked",
  },
  food: {
    detail: "Party or table",
    detailHint: "e.g. Table 7 · 4 covers",
    notes: "Dietary notes",
    notesHint: "e.g. Shellfish allergy",
    current: "Reservation",
    noCurrent: "No reservation",
  },
  retail: {
    detail: "Customer type",
    detailHint: "e.g. Loyalty member",
    notes: "Notes",
    notesHint: "Sizes, favourite brands, gift ideas",
    current: "Latest order",
    noCurrent: "No recent orders",
  },
  beauty: {
    detail: "Preferred service",
    detailHint: "e.g. Knotless braids",
    notes: "Hair or skin notes",
    notesHint: "e.g. Sensitive scalp",
    current: "Next appointment",
    noCurrent: "Nothing booked",
  },
  automotive: {
    detail: "Vehicle",
    detailHint: "e.g. 2021 VW Polo",
    notes: "Problem",
    notesHint: "e.g. Brakes squealing",
    current: "Current job",
    noCurrent: "No job in the workshop",
  },
  cleaning: {
    detail: "Address",
    detailHint: "e.g. 14 Oxford Rd, Rosebank",
    notes: "Access notes",
    notesHint: "e.g. Key under the mat, dog on site",
    current: "Next visit",
    noCurrent: "No visit scheduled",
  },
};
