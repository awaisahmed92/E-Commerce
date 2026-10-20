export const site = {
  name: "Khairpur Dates House",
  short: "KDH",
  url: "https://khairpurdateshouse.com",
  email: "hello@khairpurdateshouse.com",
  /**
   * Set these before launch. Leave blank rather than inventing a number.
   * whatsapp: digits only, country code included, no plus sign.
   */
  phoneDisplay: "",
  phoneHref: "",
  whatsapp: "",
  locality: "Khairpur Mirs",
  region: "Sindh, Pakistan",
  address: "Khairpur Mirs, Sindh, Pakistan",
  coordinates: "27.53° N, 68.76° E",
} as const;

export const nav = [
  { href: "/house", label: "The House" },
  { href: "/varieties", label: "Varieties" },
  { href: "/catalog", label: "Catalog" },
  { href: "/buyers", label: "For Buyers" },
  { href: "/quality", label: "Quality" },
] as const;

export type Tone = "mahogany" | "honey" | "rust" | "leaf" | "cocoa";

export type Variety = {
  slug: string;
  code: string;
  name: string;
  arabic: string;
  tone: Tone;
  image: string;
  grade: string;
  form: string;
  origin: string;
  texture: string;
  keep: string;
  summary: string;
  story: string[];
  uses: string[];
  grades: { name: string; note: string }[];
};

export const varieties: Variety[] = [
  {
    slug: "aseel",
    code: "KDH-AS",
    name: "Aseel",
    arabic: "تمر أصيل",
    tone: "mahogany",
    image: "/images/aseel.jpg",
    grade: "Select",
    form: "Whole",
    origin: "Khairpur Mirs, Sindh",
    texture: "Semi-dry, oval, dark skin",
    keep: "The long-keeping date of Sindh",
    summary:
      "The commercial date of Khairpur. Semi-dry, dark, and oval, with a skin that travels and a sweetness that does not need gloss.",
    story: [
      "Aseel is the fruit this house is built around. It grows in the heat of Khairpur, finishes with a dark brown skin, and holds its shape in a carton better than a soft date ever will.",
      "We keep Select, GAQ, FAQ, and Industrial apart. A buyer who asks for Aseel is asking for a grade, not a mood. The lot card names which one is in the box.",
    ],
    uses: ["Retail packs", "Gift cartons", "Export programs", "Pitting and paste"],
    grades: [
      { name: "Select", note: "Table and gift fruit. The dates you would put in front of a guest." },
      { name: "GAQ", note: "Good average quality. The grade most export buyers mean." },
      { name: "FAQ", note: "Fair average. Honest fruit for a tighter price." },
      { name: "Industrial", note: "For paste, chop, powder, and any kitchen that will process it." },
    ],
  },
  {
    slug: "begum-jangi",
    code: "KDH-BJ",
    name: "Begum Jangi",
    arabic: "بيغم جانغي",
    tone: "honey",
    image: "/images/begum-jangi.jpg",
    grade: "Select",
    form: "Whole",
    origin: "Turbat, Balochistan",
    texture: "Soft, short, caramel",
    keep: "Eaten sooner than Aseel",
    summary:
      "A softer, shorter date from Turbat. We pack it because buyers who know Aseel often want this fruit beside it.",
    story: [
      "Begum Jangi is not a Khairpur date, and we will not pretend the orchard is ours. It is grown around Turbat, in Balochistan, and it eats differently: softer, shorter, darker in flavor than in color.",
      "The house carries it so a buyer can order the Sindh semi-dry and the Balochistan soft date from one desk, with the origin written on each lot.",
    ],
    uses: ["Table fruit", "Premium retail", "Ramadan packs", "Gifting"],
    grades: [
      { name: "Select", note: "Whole, soft fruit for the table." },
      { name: "GAQ", note: "A steady soft date for retail programs." },
    ],
  },
  {
    slug: "turbat-mix",
    code: "KDH-TM",
    name: "Turbat Mix",
    arabic: "خلطة تربت",
    tone: "rust",
    image: "/images/turbat-mix.jpg",
    grade: "GAQ",
    form: "Whole",
    origin: "Turbat, Balochistan",
    texture: "Soft mix, close in size",
    keep: "A blend, not a single cultivar",
    summary:
      "A selected mix of soft Turbat dates, kept close in size and bite. It is a blend, and the lot card says so.",
    story: [
      "Turbat Mix is not one cultivar with one name. It is a chosen mix of soft dates from the Turbat belt, matched so a carton does not swing from tiny to huge.",
      "We sell it as a mix. If a buyer needs a single variety, we say so and offer Begum Jangi or Aseel instead of renaming the fruit.",
    ],
    uses: ["Value retail", "Mixed gift trays", "Food service"],
    grades: [
      { name: "GAQ", note: "The usual pack: soft fruit, sorted for size." },
      { name: "FAQ", note: "A looser mix when the price has to move." },
    ],
  },
  {
    slug: "organic-aseel",
    code: "KDH-OR",
    name: "Organic Aseel",
    arabic: "أصيل عضوي",
    tone: "leaf",
    image: "/images/organic-aseel.jpg",
    grade: "Select",
    form: "Whole",
    origin: "Khairpur, when certified",
    texture: "Aseel, with paper behind it",
    keep: "Named organic only with a file",
    summary:
      "Aseel from a lot that can show an organic claim on paper. If the file is missing, this house does not print the word.",
    story: [
      "Organic is a document, not a shade of brown. Khairpur grows fine Aseel either way. We use this name only when the lot carries a certificate we can send with the sample.",
      "Ask for the scope and the year. If we cannot attach them, we will offer conventional Aseel and keep the organic word off the carton.",
    ],
    uses: ["Certified retail", "Brand programs", "Buyers who audit the file"],
    grades: [
      { name: "Select", note: "Offered when the certificate covers the lot." },
      { name: "GAQ", note: "The same rule: paper first, then the grade." },
    ],
  },
  {
    slug: "dry-dates",
    code: "KDH-DR",
    name: "Dry Dates",
    arabic: "تمر جاف",
    tone: "cocoa",
    image: "/images/dry-dates.jpg",
    grade: "GAQ",
    form: "Whole, sun-dried",
    origin: "Sindh",
    texture: "Drier chew, longer keep",
    keep: "The date that waits",
    summary:
      "Sun-dried fruit with a firmer bite and a longer shelf. Different from semi-dry Aseel, and packed as its own line.",
    story: [
      "Dry dates are what many kitchens call chuara: fruit taken further from the fresh stage, so the chew firms up and the carton can wait.",
      "They are not a failed soft date. The process is the point. We keep them in their own code so a buyer never receives them in place of semi-dry Aseel.",
    ],
    uses: ["Long-hold retail", "Snacking", "Traditional kitchens", "Export programs"],
    grades: [
      { name: "GAQ", note: "Even color, sound fruit, ready to pack." },
      { name: "FAQ", note: "A plainer dry date for price-led lines." },
    ],
  },
];

export const grades = [
  {
    name: "Select",
    note: "The fruit you would set on a table. Size, skin, and cleanliness have to agree.",
  },
  {
    name: "GAQ",
    note: "Good average quality. The working grade of an export program.",
  },
  {
    name: "FAQ",
    note: "Fair average quality. Sound fruit with a wider tolerance and a lower price.",
  },
  {
    name: "Industrial",
    note: "Destined for paste, chop, or powder. Judged on cleanliness and use, not on a gift window.",
  },
] as const;

export const processSteps = [
  {
    id: "01",
    title: "Harvest",
    body: "The fruit is cut when the skin has finished its color. We would rather wait a day than pack a date that is still deciding what it is.",
  },
  {
    id: "02",
    title: "Sort",
    body: "Hands pull out the torn, the fermented, and the undersized before a grade is even spoken.",
  },
  {
    id: "03",
    title: "Grade",
    body: "Select, GAQ, FAQ, and Industrial do not share a carton. The lot card names the one that is inside.",
  },
  {
    id: "04",
    title: "Pack",
    body: "A food-contact liner, a checked net weight, and a code that can still be read a month later.",
  },
  {
    id: "05",
    title: "Dispatch",
    body: "The sample and the shipment should be the same fruit. If they are not, the record is wrong.",
  },
] as const;

export const season = [
  {
    when: "Winter",
    title: "The plan",
    body: "The palms rest. We book cartons, labels, and the cold space a soft lot will need.",
  },
  {
    when: "Spring",
    title: "Pollination",
    body: "The crop is set. We do not sell fruit we have not seen.",
  },
  {
    when: "Summer",
    title: "Color",
    body: "The skin turns. This is when a grade starts to exist.",
  },
  {
    when: "Harvest",
    title: "Cut and move",
    body: "Heat is part of the job. A delay between the palm and the table is not.",
  },
  {
    when: "After",
    title: "Hold or ship",
    body: "Soft fruit is held with care. Semi-dry Aseel is packed for the road.",
  },
] as const;

export const protocols = [
  {
    code: "HS",
    name: "Hand sort",
    record: "Damaged fruit and foreign matter leave the line before a grade is given.",
  },
  {
    code: "MS",
    name: "Moisture",
    record: "Noted on the lot card. Not guessed inside an email.",
  },
  {
    code: "GR",
    name: "Grade lock",
    record: "One grade in the carton. Select does not travel with Industrial.",
  },
  {
    code: "PK",
    name: "Pack",
    record: "Liner, net weight, and a code printed where a buyer can find it.",
  },
  {
    code: "TR",
    name: "Trace",
    record: "Variety, grade, season, pack date, net weight, lot code.",
  },
] as const;

export const lotFields = [
  "Variety",
  "Grade",
  "Origin",
  "Crop season",
  "Pack date",
  "Net weight",
  "Lot code",
] as const;

export const stats = [
  { value: 5, label: "Fruits on the atlas" },
  { value: 4, label: "Grades kept apart" },
  { value: 1, label: "Lot card on the shipment" },
  { value: 5, label: "Steps before dispatch" },
] as const;

export type ProductCategory = "Whole" | "Pitted" | "Processed" | "Organic";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  varietySlug: string;
  variety: string;
  grade: string;
  pack: string;
  bestFor: string;
  note: string;
};

export const products: Product[] = [
  {
    slug: "aseel-select",
    name: "Aseel Select",
    category: "Whole",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "Select",
    pack: "5 kg and 10 kg cartons",
    bestFor: "Table, gift, retail",
    note: "The fruit we would put in front of a guest.",
  },
  {
    slug: "aseel-gaq",
    name: "Aseel GAQ",
    category: "Whole",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "GAQ",
    pack: "5 kg and 10 kg cartons",
    bestFor: "Export retail programs",
    note: "The grade most buyers mean when they say good dates.",
  },
  {
    slug: "aseel-faq",
    name: "Aseel FAQ",
    category: "Whole",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "FAQ",
    pack: "10 kg cartons",
    bestFor: "Value packs",
    note: "Sound fruit, wider tolerance, a price that can move.",
  },
  {
    slug: "aseel-industrial",
    name: "Aseel Industrial",
    category: "Whole",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "Industrial",
    pack: "Bulk",
    bestFor: "Factories",
    note: "Whole fruit destined to be taken apart.",
  },
  {
    slug: "aseel-pitted",
    name: "Aseel Pitted",
    category: "Pitted",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "GAQ",
    pack: "5 kg and 10 kg",
    bestFor: "Bakeries and repacking",
    note: "Seed removed. The grade is still named.",
  },
  {
    slug: "begum-jangi-soft",
    name: "Begum Jangi",
    category: "Whole",
    varietySlug: "begum-jangi",
    variety: "Begum Jangi",
    grade: "Select",
    pack: "5 kg cartons",
    bestFor: "Soft table fruit",
    note: "Turbat origin, written on the lot.",
  },
  {
    slug: "turbat-mix-pack",
    name: "Turbat Mix",
    category: "Whole",
    varietySlug: "turbat-mix",
    variety: "Turbat Mix",
    grade: "GAQ",
    pack: "10 kg cartons",
    bestFor: "Mixed retail",
    note: "Sold as a mix. We do not rename it.",
  },
  {
    slug: "organic-aseel-pack",
    name: "Organic Aseel",
    category: "Organic",
    varietySlug: "organic-aseel",
    variety: "Organic Aseel",
    grade: "Select",
    pack: "5 kg cartons",
    bestFor: "Programs with an audit",
    note: "Quoted when the certificate covers the lot.",
  },
  {
    slug: "dry-dates-pack",
    name: "Dry Dates",
    category: "Whole",
    varietySlug: "dry-dates",
    variety: "Dry Dates",
    grade: "GAQ",
    pack: "10 kg cartons",
    bestFor: "Long-hold lines",
    note: "A firmer chew. Its own code, not a substitute for Aseel.",
  },
  {
    slug: "chopped-dates",
    name: "Chopped Dates",
    category: "Processed",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "FAQ",
    pack: "10 kg",
    bestFor: "Bars, bakeries, cereals",
    note: "Cut from a named grade, not from a sweep of the floor.",
  },
  {
    slug: "date-paste",
    name: "Date Paste",
    category: "Processed",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "Industrial",
    pack: "20 kg pails",
    bestFor: "Fillings and confectionery",
    note: "A smooth paste for kitchens that need a natural sweetener.",
  },
  {
    slug: "date-powder",
    name: "Date Powder",
    category: "Processed",
    varietySlug: "aseel",
    variety: "Aseel",
    grade: "Industrial",
    pack: "10 kg bags",
    bestFor: "Clean-label sweetening",
    note: "Ground fruit for formulas that cannot take a whole date.",
  },
];

export const productCategories: Array<ProductCategory | "All"> = [
  "All",
  "Whole",
  "Pitted",
  "Processed",
  "Organic",
];

export const intents = [
  { value: "sample", label: "Request a sample" },
  { value: "quote", label: "Ask for a lot quote" },
  { value: "private-label", label: "Private label" },
  { value: "visit", label: "Visit the house" },
] as const;

export type IntentValue = (typeof intents)[number]["value"];

export const ticker = [
  "Aseel",
  "Begum Jangi",
  "Turbat Mix",
  "Organic Aseel",
  "Dry Dates",
  "Select",
  "GAQ",
  "FAQ",
  "Industrial",
  "Pitted",
  "Paste",
  "Powder",
] as const;

export function getVariety(slug: string) {
  return varieties.find((variety) => variety.slug === slug);
}
