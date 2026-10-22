import { z } from "zod";
export const entryInput = z.object({
  id: z.string().min(1).max(200),
  kind: z.enum(["tour", "departure", "post", "faq", "page", "settings"]),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-zA-Z0-9:_-]+$/),
  data: z.unknown(),
  translations: z.record(z.string(), z.unknown()).default({}),
  published: z.boolean(),
  version: z.number().int().nonnegative(),
});
const text = z.string().max(100000);
const money = z
  .union([z.number(), z.string()])
  .refine(
    (value) =>
      value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0,
    "Enter a valid price",
  );
const tiers = z.record(z.string().regex(/^[1-9][0-9]*$/), money);
const tour = z
  .object({
    id: text.min(1),
    slug: text.min(1),
    title: text.min(1),
    description: text,
    blurb: text,
    image: text.min(1),
    active: z.boolean(),
    duration: text,
    locations: z.array(text),
    country: text,
    horse: z.boolean(),
    pricesEnglish: tiers,
    defaultDeposit: tiers.optional(),
    defaultMaxPeople: z.number().int().min(1).max(100).optional(),
    durationDays: z.number().int().min(1).max(365).nullable().optional(),
    optionalAddOns: z
      .array(
        z
          .object({
            name: text.min(1),
            cost: money,
            description: text,
            scope: z.enum(["group", "traveler"]).optional(),
            billing: z.enum(["perDay", "flat"]).optional(),
            chargeMode: z.enum(["perPerson", "once"]).optional(),
            days: z.number().min(1).optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();
const departure = z
  .object({
    id: text.min(1),
    tourSlug: text.min(1),
    tourName: text.min(1),
    startDate: z.iso.datetime({ offset: true }),
    endDate: z.iso.datetime({ offset: true }),
    active: z.boolean(),
    status: z.enum(["active", "completed", "cancelled"]).optional(),
    peopleBooked: z.number().int().min(0),
    maxPeople: z.number().int().min(1).max(100),
    Prices: tiers.optional(),
  })
  .passthrough()
  .refine(
    (value) => value.peopleBooked <= value.maxPeople,
    "Capacity cannot be below booked seats",
  )
  .refine(
    (value) => value.startDate.slice(0, 10) <= value.endDate.slice(0, 10),
    "End date must follow start date",
  );
export function validateContent(kind: string, data: unknown) {
  if (kind === "tour") tour.parse(data);
  if (kind === "departure") departure.parse(data);
  if (kind === "post")
    z.object({
      title: text.min(1),
      slug: text.min(1),
      summary: text,
      image: text.min(1),
      content: text,
    }).parse(data);
  if (kind === "faq")
    z.object({
      question: text.min(1),
      answer: z.union([text, z.object({ items: z.array(text) }).passthrough()]),
    }).parse(data);
  validateUrls(data);
}
function validateUrls(value: unknown, key = "") {
  if (
    typeof value === "string" &&
    /^(?:image|src|photo|url|path|href|preparationGuide|instagram|heroPoster|heroFallback)$/.test(
      key,
    ) &&
    value &&
    !/^(https?:\/\/|\/(?!\/)|#)/.test(value)
  )
    throw new Error("Use a relative path or HTTPS URL for links and images.");
  if (Array.isArray(value)) value.forEach((item) => validateUrls(item, key));
  else if (value && typeof value === "object")
    Object.entries(value).forEach(([name, item]) => validateUrls(item, name));
}
export function preserveShape(
  original: unknown,
  next: unknown,
  path = "content",
) {
  if (original === null || original === undefined) return;
  if (Array.isArray(original)) {
    if (!Array.isArray(next) || next.length < original.length)
      throw new Error(`Keep required blocks: ${path}`);
    original.forEach((item, index) =>
      preserveShape(item, next[index], `${path}.${index}`),
    );
    return;
  }
  if (typeof original === "object") {
    if (!next || typeof next !== "object" || Array.isArray(next))
      throw new Error(`Invalid section: ${path}`);
    for (const [key, value] of Object.entries(original))
      preserveShape(
        value,
        (next as Record<string, unknown>)[key],
        `${path}.${key}`,
      );
  } else if (typeof original !== typeof next)
    throw new Error(`Invalid field: ${path}`);
}
export const inquiryInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  whatsappNumber: z.string().min(7).max(30),
  date: z.iso.date(),
  tour: z.string().min(1).max(250),
  message: z.string().max(5000),
  proposal: z
    .object({
      partnerName: text.max(100),
      setting: text.max(100),
      group: text.max(100),
      extras: z.array(text.max(100)).max(20),
    })
    .optional(),
});
