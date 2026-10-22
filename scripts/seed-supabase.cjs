const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { translate } = require("../lib/i18n.ts");
const { site } = require("../lib/mocks/site.mock.ts");
const { createCatalog } = require("../lib/catalog.ts");
const read = (name) =>
  JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../lib/mocks", name + ".mock.json"),
      "utf8",
    ),
  );
const locales = ["es", "fr", "it", "ge", "ru", "zh", "ar"];
function translated(value, locale) {
  if (typeof value === "string") return translate(locale, value);
  if (Array.isArray(value))
    return value.map((item) => translated(item, locale));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        translated(item, locale),
      ]),
    );
  return value;
}
const rows = [];
function add(id, kind, slug, data) {
  rows.push({
    id,
    kind,
    slug,
    data,
    published: true,
    translations: Object.fromEntries(
      locales.map((locale) => [locale, translated(data, locale)]),
    ),
  });
}
const tours = read("tours");
const departures = read("departures");
tours.forEach((tour) => add("tour:" + tour.slug, "tour", tour.slug, tour));
departures.forEach((departure) =>
  add(departure.id, "departure", departure.id, departure),
);
const catalog = createCatalog({
  tours,
  publicDepartures: departures,
  blogPosts: [],
  assets: {},
});
for (const tour of tours) {
  for (const departure of catalog
    .departuresFor(tour, new Date("2000-01-01T00:00:00Z"))
    .filter((item) => item.manual)) {
    add(departure.id, "departure", departure.id, {
      id: departure.id,
      tourName: tour.title,
      tourSlug: tour.slug,
      startDate: departure.start + "T00:00:00+06:00",
      endDate: departure.end + "T23:59:00+06:00",
      active: true,
      status: "active",
      peopleBooked: 0,
      maxPeople: departure.capacity,
      Prices: departure.prices,
      Locations: departure.locations,
      image: departure.image,
      minorDescription: "",
    });
  }
}
read("blog").forEach((post) =>
  add("post:" + post.slug, "post", post.slug, post),
);
read("faq").forEach((faq, index) =>
  add(
    "faq:" + String(index + 1).padStart(2, "0"),
    "faq",
    "faq-" + (index + 1),
    faq,
  ),
);
Object.entries(read("pages")).forEach(([slug, page]) =>
  add("page:" + slug, "page", slug, page),
);
const liveSite = {
  ...site,
  mockNotice:
    "Your request is saved securely. Our team will contact you by email or WhatsApp. No online payment is taken.",
};
add("settings:site", "settings", "site", liveSite);
for (const [id, file] of [
  ["checkout", "checkout"],
  ["countries", "countries"],
  ["tour-page", "tour-page"],
  ["assets", "assets"],
])
  add("settings:" + id, "settings", id, read(file));
const literal = (value) =>
  "'" + JSON.stringify(value).replaceAll("'", "''") + "'::jsonb";
const sql = `insert into public.tourism_content(id,kind,slug,data,translations,published) select x.id,x.kind,x.slug,x.data,x.translations,x.published from jsonb_to_recordset(${literal(rows)}) as x(id text,kind text,slug text,data jsonb,translations jsonb,published boolean) on conflict(id) do nothing;`;
const output = process.argv[2];
if (!output)
  throw new Error("Usage: node scripts/seed-supabase.cjs /absolute/output.sql");
fs.writeFileSync(output, sql);
fs.writeFileSync(output + ".json", JSON.stringify(rows));
console.log(
  JSON.stringify({
    records: rows.length,
    kinds: Object.fromEntries(
      [...new Set(rows.map((row) => row.kind))].map((kind) => [
        kind,
        rows.filter((row) => row.kind === kind).length,
      ]),
    ),
  }),
);
