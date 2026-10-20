import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  "products.view", "products.create", "products.update", "products.delete",
  "categories.manage", "inventory.view", "inventory.manage",
  "orders.view", "orders.update", "orders.cancel", "orders.refund",
  "customers.view", "customers.manage", "promotions.manage", "coupons.manage",
  "cms.manage", "reviews.manage", "reports.view", "shipping.manage",
  "payments.manage", "users.manage", "settings.manage", "audit.view",
];

type SeedVariant = {
  size: string;
  sku: string;
  price: number;
  stock: number;
  weight: number;
};

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  category: string;
  shortDescription: string;
  description: string;
  tags: string;
  image: string;
  gallery?: string;
  price: number;
  salePrice?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  variants: SeedVariant[];
};

const products: SeedProduct[] = [
  {
    name: "Aseel Select Dates",
    slug: "aseel-select-dates",
    sku: "KDH-AS-SELECT",
    category: "aseel-dates",
    shortDescription: "Premium semi-dry Aseel, selected for the table and gifting.",
    description: "Khairpur Aseel with an even dark skin, firm bite and balanced sweetness. Hand sorted as Select grade. Store in a cool, dry place and refrigerate after opening.",
    tags: "aseel,khairpur,select,semi-dry,whole dates,gifting",
    image: "/images/aseel.jpg",
    gallery: "/images/card-aseel.jpg",
    price: 850,
    featured: true,
    bestSeller: true,
    variants: [
      { size: "500 g", sku: "KDH-AS-S-500", price: 850, stock: 60, weight: 0.5 },
      { size: "1 kg", sku: "KDH-AS-S-1K", price: 1550, stock: 48, weight: 1 },
      { size: "5 kg", sku: "KDH-AS-S-5K", price: 7200, stock: 20, weight: 5 },
    ],
  },
  {
    name: "Aseel GAQ Dates",
    slug: "aseel-gaq-dates",
    sku: "KDH-AS-GAQ",
    category: "aseel-dates",
    shortDescription: "Good average quality Aseel for everyday tables and retail packs.",
    description: "The working grade of Khairpur Aseel: sound semi-dry fruit, sorted and packed with its grade clearly named.",
    tags: "aseel,gaq,khairpur,whole dates,retail",
    image: "/images/card-golden.jpg",
    gallery: "/images/gallery-dates.jpg",
    price: 650,
    featured: true,
    variants: [
      { size: "500 g", sku: "KDH-AS-G-500", price: 650, stock: 75, weight: 0.5 },
      { size: "1 kg", sku: "KDH-AS-G-1K", price: 1200, stock: 55, weight: 1 },
      { size: "5 kg", sku: "KDH-AS-G-5K", price: 5500, stock: 24, weight: 5 },
      { size: "10 kg", sku: "KDH-AS-G-10K", price: 10500, stock: 12, weight: 10 },
    ],
  },
  {
    name: "Aseel FAQ Dates",
    slug: "aseel-faq-dates",
    sku: "KDH-AS-FAQ",
    category: "aseel-dates",
    shortDescription: "Sound Aseel fruit with a wider size tolerance and accessible price.",
    description: "Fair average quality Aseel for value packs, food service and buyers who need dependable fruit at a tighter price.",
    tags: "aseel,faq,value,whole dates,khairpur",
    image: "/images/card-dry.jpg",
    price: 500,
    variants: [
      { size: "1 kg", sku: "KDH-AS-F-1K", price: 950, stock: 65, weight: 1 },
      { size: "5 kg", sku: "KDH-AS-F-5K", price: 4300, stock: 30, weight: 5 },
      { size: "10 kg", sku: "KDH-AS-F-10K", price: 8200, stock: 18, weight: 10 },
    ],
  },
  {
    name: "Begum Jangi Dates",
    slug: "begum-jangi-dates",
    sku: "KDH-BJ-SELECT",
    category: "soft-dates",
    shortDescription: "A soft, caramel-toned table date from Turbat, Balochistan.",
    description: "Begum Jangi is softer and shorter than Aseel, with a rich caramel character. Its Turbat origin is kept clear on every pack.",
    tags: "begum jangi,turbat,soft dates,table fruit",
    image: "/images/begum-jangi.jpg",
    gallery: "/images/card-soft.jpg",
    price: 950,
    featured: true,
    newArrival: true,
    variants: [
      { size: "500 g", sku: "KDH-BJ-500", price: 950, stock: 35, weight: 0.5 },
      { size: "1 kg", sku: "KDH-BJ-1K", price: 1750, stock: 28, weight: 1 },
      { size: "5 kg", sku: "KDH-BJ-5K", price: 8100, stock: 10, weight: 5 },
    ],
  },
  {
    name: "Turbat Mix Dates",
    slug: "turbat-mix-dates",
    sku: "KDH-TM-GAQ",
    category: "soft-dates",
    shortDescription: "A selected mix of soft Turbat dates, kept close in size and bite.",
    description: "A named blend rather than a single cultivar. Soft fruit from the Turbat belt, selected for an even retail pack.",
    tags: "turbat,mix,soft dates,gaq,value",
    image: "/images/turbat-mix.jpg",
    price: 700,
    variants: [
      { size: "500 g", sku: "KDH-TM-500", price: 700, stock: 42, weight: 0.5 },
      { size: "1 kg", sku: "KDH-TM-1K", price: 1300, stock: 34, weight: 1 },
      { size: "5 kg", sku: "KDH-TM-5K", price: 5900, stock: 15, weight: 5 },
    ],
  },
  {
    name: "Sindh Dry Dates",
    slug: "sindh-dry-dates",
    sku: "KDH-DR-GAQ",
    category: "dry-dates",
    shortDescription: "Sun-dried dates with a firmer chew and longer keeping quality.",
    description: "Traditional dry dates, also known as chuara, packed separately from semi-dry Aseel for a firm bite and longer hold.",
    tags: "dry dates,chuara,sindh,gaq,long shelf life",
    image: "/images/dry-dates.jpg",
    gallery: "/images/card-dry.jpg",
    price: 600,
    featured: true,
    variants: [
      { size: "500 g", sku: "KDH-DR-500", price: 600, stock: 55, weight: 0.5 },
      { size: "1 kg", sku: "KDH-DR-1K", price: 1100, stock: 45, weight: 1 },
      { size: "5 kg", sku: "KDH-DR-5K", price: 5000, stock: 16, weight: 5 },
    ],
  },
  {
    name: "Organic Aseel Dates",
    slug: "organic-aseel-dates",
    sku: "KDH-OR-SELECT",
    category: "organic-dates",
    shortDescription: "Aseel from certified lots, offered only when the supporting file is available.",
    description: "Select-grade Aseel from a lot covered by organic documentation. Certification scope and season are confirmed before dispatch.",
    tags: "organic,aseel,certified,khairpur,select",
    image: "/images/organic-aseel.jpg",
    price: 1050,
    featured: true,
    variants: [
      { size: "500 g", sku: "KDH-OR-500", price: 1050, stock: 20, weight: 0.5 },
      { size: "1 kg", sku: "KDH-OR-1K", price: 1950, stock: 16, weight: 1 },
      { size: "5 kg", sku: "KDH-OR-5K", price: 9200, stock: 6, weight: 5 },
    ],
  },
  {
    name: "Pitted Aseel Dates",
    slug: "pitted-aseel-dates",
    sku: "KDH-PT-GAQ",
    category: "pitted-dates",
    shortDescription: "Khairpur Aseel with the seed removed, ready for snacking and kitchens.",
    description: "GAQ Aseel, pitted and packed for bakeries, breakfast bowls, bars and convenient everyday use.",
    tags: "pitted dates,aseel,bakery,snacking,processed",
    image: "/images/card-aseel.jpg",
    price: 800,
    newArrival: true,
    variants: [
      { size: "500 g", sku: "KDH-PT-500", price: 800, stock: 38, weight: 0.5 },
      { size: "1 kg", sku: "KDH-PT-1K", price: 1480, stock: 30, weight: 1 },
      { size: "5 kg", sku: "KDH-PT-5K", price: 6800, stock: 12, weight: 5 },
    ],
  },
  {
    name: "Chopped Aseel Dates",
    slug: "chopped-aseel-dates",
    sku: "KDH-CH-FAQ",
    category: "processed-dates",
    shortDescription: "Chopped Aseel for cereals, bakeries and snack production.",
    description: "A named FAQ-grade Aseel lot, pitted and chopped for food service and manufacturing.",
    tags: "chopped dates,aseel,bakery,cereal,ingredient",
    image: "/images/sorting.jpg",
    price: 1350,
    variants: [
      { size: "1 kg", sku: "KDH-CH-1K", price: 1350, stock: 22, weight: 1 },
      { size: "5 kg", sku: "KDH-CH-5K", price: 6200, stock: 10, weight: 5 },
      { size: "10 kg", sku: "KDH-CH-10K", price: 11800, stock: 8, weight: 10 },
    ],
  },
  {
    name: "Aseel Date Paste",
    slug: "aseel-date-paste",
    sku: "KDH-PASTE",
    category: "processed-dates",
    shortDescription: "Smooth Aseel date paste for fillings, confectionery and natural sweetening.",
    description: "A smooth date paste made from a named industrial Aseel grade for commercial kitchens and clean-label recipes.",
    tags: "date paste,aseel,natural sweetener,confectionery,ingredient",
    image: "/images/film-bowls.jpg",
    price: 1250,
    variants: [
      { size: "1 kg", sku: "KDH-PASTE-1K", price: 1250, stock: 25, weight: 1 },
      { size: "5 kg", sku: "KDH-PASTE-5K", price: 5700, stock: 12, weight: 5 },
      { size: "20 kg", sku: "KDH-PASTE-20K", price: 21000, stock: 5, weight: 20 },
    ],
  },
  {
    name: "Premium Aseel Gift Box",
    slug: "premium-aseel-gift-box",
    sku: "KDH-GIFT-ASEEL",
    category: "gift-boxes",
    shortDescription: "Select Aseel arranged in a presentation box for thoughtful gifting.",
    description: "A premium gift presentation filled with hand-sorted Select Aseel from Khairpur. Suitable for family, corporate and Ramadan gifting.",
    tags: "gift box,aseel,premium,ramadan,corporate gifts",
    image: "/images/gift-still.jpg",
    gallery: "/images/card-golden.jpg",
    price: 2200,
    salePrice: 1990,
    featured: true,
    bestSeller: true,
    variants: [
      { size: "1 kg", sku: "KDH-GIFT-1K", price: 2200, stock: 24, weight: 1 },
      { size: "2 kg", sku: "KDH-GIFT-2K", price: 4100, stock: 18, weight: 2 },
    ],
  },
];

async function seedRolesAndAdmin() {
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
  }
  const roleDefinitions = [
    { name: "super_admin", label: "Super Admin", permissions: PERMISSIONS },
    { name: "admin", label: "Admin", permissions: PERMISSIONS.filter((key) => !["users.manage", "audit.view"].includes(key)) },
    { name: "staff", label: "Staff / Operations", permissions: ["products.view", "inventory.view", "inventory.manage", "orders.view", "orders.update", "customers.view"] },
    { name: "customer", label: "Customer", permissions: [] },
  ];
  for (const definition of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { name: definition.name },
      update: { label: definition.label },
      create: { name: definition.name, label: definition.label },
    });
    for (const key of definition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "super_admin" } });
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@khairpurdateshouse.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!password) {
      console.warn("Skipping admin creation: set SEED_ADMIN_PASSWORD to create the initial admin securely.");
    } else {
      await prisma.user.create({
        data: {
          email: adminEmail,
          firstName: "Store",
          lastName: "Admin",
          passwordHash: bcrypt.hashSync(password, 12),
          roleId: adminRole.id,
        },
      });
    }
  }
}

async function seedCatalog() {
  const categories = [
    { name: "Whole Dates", slug: "whole-dates", image: "/images/gallery-dates.jpg", order: 1 },
    { name: "Processed Dates", slug: "processed-dates", image: "/images/film-bowls.jpg", order: 2 },
    { name: "Gift Boxes", slug: "gift-boxes", image: "/images/gift-still.jpg", order: 3 },
    { name: "Organic Dates", slug: "organic-dates", image: "/images/organic-aseel.jpg", order: 4 },
  ];
  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, image: category.image, displayOrder: category.order, isActive: true, parentId: null },
      create: { name: category.name, slug: category.slug, image: category.image, displayOrder: category.order },
    });
    categoryIds[category.slug] = row.id;
  }
  const children = [
    { name: "Aseel Dates", slug: "aseel-dates", parent: "whole-dates", order: 1 },
    { name: "Soft Dates", slug: "soft-dates", parent: "whole-dates", order: 2 },
    { name: "Dry Dates", slug: "dry-dates", parent: "whole-dates", order: 3 },
    { name: "Pitted Dates", slug: "pitted-dates", parent: "processed-dates", order: 1 },
  ];
  for (const category of children) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, parentId: categoryIds[category.parent], displayOrder: category.order, isActive: true },
      create: { name: category.name, slug: category.slug, parentId: categoryIds[category.parent], displayOrder: category.order },
    });
    categoryIds[category.slug] = row.id;
  }
  const activeSlugs = [...categories.map((item) => item.slug), ...children.map((item) => item.slug)];
  await prisma.category.updateMany({ where: { slug: { notIn: activeSlugs } }, data: { isActive: false } });
  await prisma.product.updateMany({ where: { brand: { not: "Khairpur Dates House" } }, data: { status: "ARCHIVED" } });

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        sku: item.sku,
        brand: "Khairpur Dates House",
        categoryId: categoryIds[item.category],
        tags: item.tags,
        originalPrice: item.price,
        salePrice: item.salePrice ?? null,
        status: "ACTIVE",
        isFeatured: item.featured ?? false,
        isBestSeller: item.bestSeller ?? false,
        isNewArrival: item.newArrival ?? false,
        seoTitle: `${item.name} from Khairpur`,
        seoDescription: item.shortDescription,
      },
      create: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        sku: item.sku,
        brand: "Khairpur Dates House",
        categoryId: categoryIds[item.category],
        tags: item.tags,
        originalPrice: item.price,
        salePrice: item.salePrice ?? null,
        status: "ACTIVE",
        isFeatured: item.featured ?? false,
        isBestSeller: item.bestSeller ?? false,
        isNewArrival: item.newArrival ?? false,
        seoTitle: `${item.name} from Khairpur`,
        seoDescription: item.shortDescription,
      },
    });
    if ((await prisma.productImage.count({ where: { productId: product.id } })) === 0) {
      await prisma.productImage.createMany({
        data: [
          { productId: product.id, url: item.image, alt: item.name, sortOrder: 0 },
          ...(item.gallery ? [{ productId: product.id, url: item.gallery, alt: `${item.name} pack`, sortOrder: 1 }] : []),
        ],
      });
    }
    for (const variant of item.variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: { productId: product.id, size: variant.size, price: variant.price, stock: variant.stock, weight: variant.weight, isActive: true },
        create: { productId: product.id, size: variant.size, sku: variant.sku, price: variant.price, stock: variant.stock, weight: variant.weight },
      });
    }
  }
}

async function seedStoreConfiguration() {
  const settings: Record<string, string> = {
    storeName: "Khairpur Dates House",
    storeEmail: "hello@khairpurdateshouse.com",
    storePhone: "",
    storeAddress: "Khairpur Mirs, Sindh, Pakistan",
    currency: "Rs.",
    taxRatePercent: "0",
    announcement: "Premium dates from Khairpur — nationwide delivery across Pakistan",
    instagramUrl: "",
    facebookUrl: "",
    whatsappNumber: "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "Premium Khajoor from Khairpur",
        subtitle: "Aseel and selected dates, graded and packed at the source.",
        desktopImage: "/images/hero-studio.jpg",
        mobileImage: "/images/hero-dates.jpg",
        linkUrl: "/shop",
        buttonText: "Shop Dates",
        position: "HOME_HERO",
        displayOrder: 1,
      },
      {
        title: "Dates for gifting",
        subtitle: "Select Aseel, packed for the table.",
        desktopImage: "/images/gift-still.jpg",
        linkUrl: "/shop?category=gift-boxes",
        buttonText: "View Gift Packs",
        position: "HOME_MIDDLE",
        displayOrder: 1,
      },
    ],
  });
  await prisma.homepageSection.deleteMany();
  await prisma.homepageSection.createMany({
    data: [
      { type: "HERO", title: "Premium Khajoor from Khairpur", subtitle: "Khairpur Dates House", buttonText: "Shop Dates", buttonLink: "/shop", displayOrder: 0 },
      { type: "CATEGORY_GRID", title: "Shop by Type", subtitle: "Whole, processed, organic and gift packs", configJson: "{\"maxItems\":4}", displayOrder: 1 },
      { type: "FEATURED_PRODUCTS", title: "Featured Dates", subtitle: "Packed for your table", configJson: "{\"maxItems\":8}", displayOrder: 2 },
      { type: "BEST_SELLERS", title: "Most Ordered", subtitle: "The packs customers return for", configJson: "{\"maxItems\":4}", displayOrder: 3 },
      { type: "NEWSLETTER", title: "Harvest Notes", subtitle: "Seasonal availability and offers from the house.", displayOrder: 4 },
    ],
  });
  await prisma.shippingMethod.deleteMany();
  await prisma.shippingMethod.createMany({
    data: [
      { name: "Standard — Sindh", description: "Tracked delivery within Sindh", zone: "Sindh", price: 220, freeAbove: 5000, minDays: 1, maxDays: 3, sortOrder: 1 },
      { name: "Standard — Nationwide", description: "Tracked delivery across Pakistan", zone: null, price: 320, freeAbove: 6000, minDays: 3, maxDays: 6, sortOrder: 2 },
      { name: "Express Delivery", description: "Priority courier where available", zone: null, price: 550, minDays: 1, maxDays: 3, sortOrder: 3 },
    ],
  });
  await prisma.paymentMethodConfig.upsert({
    where: { key: "cod" },
    update: { name: "Cash on Delivery", description: "Pay in cash when your dates arrive.", isEnabled: true, sortOrder: 1 },
    create: { key: "cod", name: "Cash on Delivery", description: "Pay in cash when your dates arrive.", isEnabled: true, sortOrder: 1 },
  });
  await prisma.paymentMethodConfig.upsert({
    where: { key: "bank_transfer" },
    update: { name: "Bank Transfer", description: "Transfer after order confirmation.", isEnabled: true, sortOrder: 2 },
    create: { key: "bank_transfer", name: "Bank Transfer", description: "Transfer after order confirmation.", isEnabled: true, sortOrder: 2 },
  });
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: { description: "10% off your first Dates House order", type: "PERCENTAGE", amount: 10, usagePerCustomer: 1, isActive: true },
    create: { code: "WELCOME10", description: "10% off your first Dates House order", type: "PERCENTAGE", amount: 10, usagePerCustomer: 1, isActive: true },
  });
}

async function main() {
  console.log("Seeding Khairpur Dates House...");
  await seedRolesAndAdmin();
  await seedCatalog();
  await seedStoreConfiguration();
  console.log(`Seeded ${products.length} date products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
