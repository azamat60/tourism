import { tourAliases } from './route-aliases';
import type {
  AddOn,
  BlogPost,
  Departure,
  ItineraryDay,
  PriceTiers,
  PublicDeparture,
  Tour,
} from "./types";

export function tierValue(
  tiers: PriceTiers | undefined,
  people: number,
): number | null {
  const keys = Object.keys(tiers || {})
    .map(Number)
    .filter((value) => value > 0)
    .sort((a, b) => a - b);
  const key = keys.includes(people)
    ? people
    : (keys.filter((value) => value <= people).pop() ?? keys[0]);
  const value = tiers?.[String(key)];
  return value != null && value !== "" && Number.isFinite(Number(value))
    ? Number(value)
    : null;
}

export function startingPrice(tour: Tour) {
  const largestTier = Math.max(...Object.keys(tour.pricesEnglish).map(Number));
  return Number.isFinite(largestTier)
    ? tierValue(tour.pricesEnglish, largestTier)
    : null;
}

export function dayKey(date = new Date(), timeZone = "Asia/Bishkek") {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function shiftDate(value: string, days: number) {
  if (!validDate(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatDate(value: string, locale = "en") {
  return new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString(
    locale === "ge" ? "de" : locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Bishkek",
    },
  );
}

export function durationDays(tour: Tour) {
  return tour.durationDays || Number(tour.duration.match(/^(\d+)/)?.[1]) || 0;
}

export function normalizedDescription(value: string) {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

export function introduction(tour: Tour) {
  return normalizedDescription(tour.description)
    .split(/\bDay\s*\d+\s*:/i)[0]
    .trim();
}

export function itineraryFor(tour: Tour): ItineraryDay[] {
  if (tour.itinerary?.length) return tour.itinerary;
  const pieces = normalizedDescription(tour.description)
    .split(/Day\s*\d+\s*:/i)
    .slice(1);
  return pieces.map((piece) => {
    const [title, ...notes] = piece
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    return { title: title.trim(), notes: notes.join("\n"), images: [] };
  });
}

export function inSeason(tour: Tour, date: string) {
  if (!tour.seasonStart || !tour.seasonEnd) return true;
  const monthDay = date.slice(5);
  return tour.seasonStart <= tour.seasonEnd
    ? monthDay >= tour.seasonStart && monthDay <= tour.seasonEnd
    : monthDay >= tour.seasonStart || monthDay <= tour.seasonEnd;
}

export function addOnPrice(addOn: AddOn, tour: Tour) {
  return (
    addOn.cost *
    (addOn.billing === "perDay" ? addOn.days || durationDays(tour) || 1 : 1)
  );
}

export function quote(
  tour: Tour,
  departure: Departure,
  travelerExtras: string[][],
  groupExtras: string[],
) {
  const count = travelerExtras.length;
  const totalPeople = departure.booked + count;
  const perPerson = tierValue(departure.prices, totalPeople) ?? 0;
  const extras = (tour.optionalAddOns || []).reduce((sum, addOn) => {
    const quantity =
      addOn.scope === "group"
        ? groupExtras.includes(addOn.name)
          ? addOn.chargeMode === "perPerson"
            ? count
            : 1
          : 0
        : travelerExtras.filter((selected) => selected.includes(addOn.name))
            .length;
    return sum + addOnPrice(addOn, tour) * quantity;
  }, 0);
  const depositPerPerson =
    departure.customDeposit && departure.customDeposit > 0
      ? departure.customDeposit
      : (tierValue(tour.defaultDeposit, totalPeople) ?? 50 * totalPeople) /
        totalPeople;
  const subtotal = Math.round((perPerson * count + extras) * 100) / 100;
  const deposit = Math.min(
    subtotal,
    Math.round(depositPerPerson * count * 100) / 100,
  );
  return {
    perPerson,
    count,
    totalPeople,
    base: perPerson * count,
    extras,
    subtotal,
    deposit,
    remaining: Math.max(0, subtotal - deposit),
  };
}

export function createCatalog(data: {
  tours: Tour[];
  publicDepartures: PublicDeparture[];
  blogPosts: BlogPost[];
  assets: Record<string, string>;
}) {
  const { tours, publicDepartures, blogPosts, assets } = data;
  const activeTours = tours.filter((tour) => tour.active !== false);

  const locationCoordinates: Record<string, [number, number]> = {
    "Song-Kul": [41.822, 75.137],
    "Kel-Suu": [40.598, 76.365],
    "Issyk-Kul": [42.44, 77.26],
    Karakol: [42.49, 78.394],
    Skazka: [42.12, 77.49],
    "Altyn Arashan": [42.44, 78.574],
    Bishkek: [42.871, 74.594],
    Kochkor: [42.216, 75.76],
    Naryn: [41.429, 76.001],
    "Issyk Kul": [42.44, 77.26],
    "Skazka Canyon": [42.12, 77.49],
    "Song Kul": [41.822, 75.137],
    "Jeti-Oguz": [42.355, 78.127],
    "Ala-Kul": [42.317414, 78.534787],
  };

  function asset(source: string) {
    const key = source.startsWith("/")
      ? `https://ecovalleytours.com${source}`
      : source;
    const saved = assets[key];
    return (
      saved ||
      (source.startsWith("http") || source.startsWith("/")
        ? source
        : `/images/${source}`)
    );
  }

  function getTour(slug: string) {
    return activeTours.find(
      (tour) => tour.slug === (tourAliases[slug] || slug),
    );
  }

  function normalizeDeparture(record: PublicDeparture): Departure {
    const tour =
      getTour(record.tourSlug || record.moreInfo || "") ||
      activeTours.find((item) => item.title === record.tourName);
    return {
      id: record.id,
      slug: tour?.slug || record.tourSlug || record.moreInfo || "",
      title: record.tourName,
      description: record.minorDescription || "",
      start: dayKey(new Date(record.startDate)),
      end: dayKey(new Date(record.endDate)),
      booked: record.peopleBooked || 0,
      capacity: record.maxPeople || tour?.defaultMaxPeople || 6,
      prices: record.Prices || tour?.pricesEnglish || {},
      customDeposit: record.customDeposit,
      locations: record.Locations || tour?.locations || [],
      image: asset(record.image || tour?.image || "/images/hero.jpg"),
      manual: false,
    };
  }

  function openDepartures(now = new Date()) {
    const today = dayKey(now);
    return publicDepartures
      .filter((record) => record.active && record.status !== "completed")
      .map(normalizeDeparture)
      .filter((record) => record.start > today)
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  function departuresFor(tour: Tour, now = new Date()): Departure[] {
    const today = dayKey(now, tour.timeZone);
    const live = publicDepartures
      .filter(
        (record) =>
          record.active !== false &&
          (!record.status || record.status === "active"),
      )
      .filter(
        (record) =>
          record.tourSlug === tour.slug ||
          record.moreInfo === tour.slug ||
          record.tourName === tour.title,
      )
      .map(normalizeDeparture);
    const liveDates = new Set(live.map((record) => record.start));
    const manual: Departure[] = [];
    for (const start of tour.manualJoinableDates || []) {
      const end = shiftDate(start, Math.max(1, durationDays(tour)) - 1);
      if (
        !liveDates.has(start) &&
        validDate(start) &&
        inSeason(tour, start) &&
        inSeason(tour, end)
      ) {
        manual.push({
          id: `manual:${tour.slug}:${start}`,
          slug: tour.slug,
          title: tour.title,
          description: "",
          start,
          end,
          booked: 0,
          capacity: tour.defaultMaxPeople || 6,
          prices: tour.pricesEnglish,
          locations: tour.locations,
          image: asset(tour.image),
          manual: true,
        });
      }
    }
    return [...live, ...manual]
      .filter((record) => {
        const cutoff =
          tour.bookingCutoffDays && tour.bookingCutoffDays > 0
            ? tour.bookingCutoffDays
            : record.booked > 0
              ? 1
              : 2;
        return record.start >= shiftDate(today, cutoff);
      })
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  return {
    tours,
    activeTours,
    publicDepartures,
    blogPosts,
    asset,
    getTour,
    normalizeDeparture,
    openDepartures,
    departuresFor,
    locationCoordinates,
    tourAliases,
  };
}
