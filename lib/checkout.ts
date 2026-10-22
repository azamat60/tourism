import { validDate } from "./catalog";

export type Traveler = {
  firstName: string;
  lastName: string;
  pickupLocation: string;
  email: string;
  phone: string;
  phoneCountry: string;
  nationality: string;
  gender: string;
  dob: string;
  vegetarian: string;
  emergencyName: string;
  emergencyEmail: string;
  emergencyPhone: string;
  emergencyPhoneCountry: string;
  notes: string;
  addressLine: string;
  city: string;
  region: string;
  postal: string;
  addressCountry: string;
  initials: string;
  initialed: string[];
  mediaConsent: string;
  signature: string;
  guardianName: string;
  guardianRelationship: string;
  guardianSignature: string;
  extras: string[];
};
export function emptyTraveler(): Traveler {
  return {
    firstName: "",
    lastName: "",
    pickupLocation: "",
    email: "",
    phone: "",
    phoneCountry: "US",
    nationality: "",
    gender: "",
    dob: "",
    vegetarian: "",
    emergencyName: "",
    emergencyEmail: "",
    emergencyPhone: "",
    emergencyPhoneCountry: "US",
    notes: "",
    addressLine: "",
    city: "",
    region: "",
    postal: "",
    addressCountry: "",
    initials: "",
    initialed: [],
    mediaConsent: "",
    signature: "",
    guardianName: "",
    guardianRelationship: "",
    guardianSignature: "",
    extras: [],
  };
}
export function ageOnDate(dob: string, today: string) {
  if (!validDate(dob) || dob < "1900-01-01" || dob > today) return null;
  return (
    Number(today.slice(0, 4)) -
    Number(dob.slice(0, 4)) -
    (today.slice(5) < dob.slice(5) ? 1 : 0)
  );
}

export function createCheckout(
  countries: string[][],
  waiver: {
    WAIVER_CLAUSES: { key: string; text: string; subItems?: string[] }[];
  },
) {
  const countryOptions = countries.map(([name, iso, dial]) => ({
    name,
    iso,
    dial,
  }));
  const waiverClauses = waiver.WAIVER_CLAUSES;
  function validPhone(phone: string, country: string) {
    const code =
      countryOptions.find((item) => item.iso === country)?.dial || "";
    const digits = `${code}${phone}`.replace(/[\s\-()]/g, "");
    return (
      /^\+?[1-9]\d{6,14}$/.test(digits) &&
      !/^(\d)\1+$/.test(digits.replace(/^\+/, ""))
    );
  }
  function travelerError(
    traveler: Traveler,
    index: number,
    all: Traveler[],
    today: string,
    requireContact = false,
  ): string {
    const lead = index === 0 || requireContact;
    const fields: [string, string][] = [
      ["firstName", "first name"],
      ["lastName", "last name"],
      ["nationality", "nationality"],
      ["emergencyName", "emergency contact name"],
      ["emergencyEmail", "emergency contact email"],
      ["addressLine", "street address"],
      ["city", "city"],
      ["postal", "postal code"],
      ["addressCountry", "country"],
    ];
    const values = traveler as unknown as Record<string, string>;
    for (const [field, label] of fields)
      if (!String(values[field] || "").trim())
        return `Traveler ${index + 1}: enter ${label}.`;
    if (lead && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email))
      return `Traveler ${index + 1}: enter a valid email.`;
    if (lead && !validPhone(traveler.phone, traveler.phoneCountry))
      return `Traveler ${index + 1}: enter a valid WhatsApp number.`;
    if (
      !validPhone(traveler.emergencyPhone, traveler.emergencyPhoneCountry) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.emergencyEmail)
    )
      return `Traveler ${index + 1}: enter valid emergency contact details.`;
    const emergency = traveler.emergencyName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
    if (
      all.some(
        (item) =>
          `${item.firstName} ${item.lastName}`
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ") === emergency,
      )
    )
      return "Your emergency contact must be someone who is not traveling with you.";
    const age = ageOnDate(traveler.dob, today);
    if (age === null)
      return `Traveler ${index + 1}: enter a valid date of birth.`;
    if (
      !traveler.initials.trim() ||
      !waiverClauses.every((clause) => traveler.initialed.includes(clause.key))
    )
      return `Traveler ${index + 1}: acknowledge every waiver clause.`;
    if (!["yes", "no"].includes(traveler.mediaConsent))
      return `Traveler ${index + 1}: choose a photography & media option.`;
    if (!traveler.signature) return `Traveler ${index + 1}: sign the waiver.`;
    if (
      age < 18 &&
      (!traveler.guardianName.trim() ||
        !traveler.guardianRelationship.trim() ||
        !traveler.guardianSignature)
    )
      return `Traveler ${index + 1}: complete the guardian details and signature.`;
    return "";
  }

  return { countryOptions, waiverClauses, validPhone, travelerError };
}
