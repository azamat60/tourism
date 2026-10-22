export type PriceTiers = Record<string, string | number>;

export type Waypoint = { name: string; lat: number | null; lng: number | null; time?: string | null; note?: string };
export type ItineraryDay = {
  title: string; place?: string; notes: string; images?: string[];
  lat?: number | null; lng?: number | null; maxAltitude?: number | null; sleepAltitude?: number | null;
  distanceKm?: number | null; durationHours?: number | null; waypoints?: Waypoint[];
};
export type AddOn = {
  name: string; description: string; cost: number; days?: number;
  billing?: string; scope?: string; chargeMode?: string;
};
export type Tour = {
  id: string; slug: string; title: string; description: string; blurb: string;
  image: string; images?: string[]; carousel_images?: string[]; imageCaptions?: Record<string, string>;
  carouselOffsets?: Record<string, number>; duration: string; durationDays?: number | null;
  distance?: string; locations: string[]; category?: string; country: string; horse: boolean;
  reception?: string; active: boolean; season?: string; seasonStart?: string; seasonEnd?: string;
  timeZone?: string; bookingCutoffDays?: number | null; manualJoinableDates?: string[];
  pricesEnglish: PriceTiers; pricesNonEnglish?: PriceTiers; defaultDeposit?: PriceTiers;
  defaultMaxPeople?: number; startingPoint?: string; endingPoint?: string;
  passportNeeded?: boolean; importantNotes?: string; inclusions?: string[]; exclusions?: string[];
  optionalAddOns?: AddOn[]; itinerary?: ItineraryDay[]; updatedAt?: string;
};
export type PublicDeparture = {
  id: string; tourName: string; tourSlug?: string; moreInfo?: string; startDate: string; endDate: string;
  active: boolean; status?: string; peopleBooked: number; maxPeople: number; Prices?: PriceTiers;
  customDeposit?: number; Locations?: string[]; image?: string; minorDescription?: string;
};
export type Departure = {
  id: string; slug: string; title: string; description: string; start: string; end: string;
  booked: number; capacity: number; prices: PriceTiers; customDeposit?: number;
  locations: string[]; image: string; manual: boolean;
};
export type BlogPost = { title: string; slug: string; summary: string; image: string; content: string };
