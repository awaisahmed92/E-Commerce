import { PrismaClient, Prisma } from "@prisma/client";

// Money columns are `Decimal` in Postgres (see prisma/schema.prisma) for exact precision, but the
// rest of the app was written against plain JS `number`s and predates the Postgres migration.
// Rather than touch every call site that reads a money field, convert Decimal -> number once,
// here, for every model that has one — the DB keeps exact decimal precision, everything above
// this file keeps working with plain numbers exactly as before. Writes need no such extension:
// Prisma already accepts a plain `number` anywhere a `Decimal` field is expected.
const dec = (v: Prisma.Decimal | null): number | null => (v == null ? v : Number(v));

function withDecimalConversion(client: PrismaClient) {
  return client.$extends({
    name: "decimal-to-number",
    result: {
      category: {
        marginValue: { needs: { marginValue: true }, compute: (c) => dec(c.marginValue) },
      },
      product: {
        originalPrice: { needs: { originalPrice: true }, compute: (p) => Number(p.originalPrice) },
        salePrice: { needs: { salePrice: true }, compute: (p) => dec(p.salePrice) },
        costPrice: { needs: { costPrice: true }, compute: (p) => dec(p.costPrice) },
        marginValue: { needs: { marginValue: true }, compute: (p) => dec(p.marginValue) },
      },
      productVariant: {
        price: { needs: { price: true }, compute: (v) => dec(v.price) },
        salePrice: { needs: { salePrice: true }, compute: (v) => dec(v.salePrice) },
      },
      cartItem: {
        priceAtAdd: { needs: { priceAtAdd: true }, compute: (i) => Number(i.priceAtAdd) },
      },
      order: {
        subtotal: { needs: { subtotal: true }, compute: (o) => Number(o.subtotal) },
        productSavings: { needs: { productSavings: true }, compute: (o) => Number(o.productSavings) },
        couponDiscount: { needs: { couponDiscount: true }, compute: (o) => Number(o.couponDiscount) },
        shippingCost: { needs: { shippingCost: true }, compute: (o) => Number(o.shippingCost) },
        taxTotal: { needs: { taxTotal: true }, compute: (o) => Number(o.taxTotal) },
        total: { needs: { total: true }, compute: (o) => Number(o.total) },
      },
      orderItem: {
        originalPrice: { needs: { originalPrice: true }, compute: (i) => Number(i.originalPrice) },
        finalPrice: { needs: { finalPrice: true }, compute: (i) => Number(i.finalPrice) },
        lineTotal: { needs: { lineTotal: true }, compute: (i) => Number(i.lineTotal) },
      },
      payment: {
        amount: { needs: { amount: true }, compute: (p) => Number(p.amount) },
      },
      promotion: {
        discountValue: { needs: { discountValue: true }, compute: (p) => Number(p.discountValue) },
      },
      coupon: {
        amount: { needs: { amount: true }, compute: (c) => Number(c.amount) },
        minOrderAmount: { needs: { minOrderAmount: true }, compute: (c) => dec(c.minOrderAmount) },
        maxDiscount: { needs: { maxDiscount: true }, compute: (c) => dec(c.maxDiscount) },
      },
      shippingMethod: {
        price: { needs: { price: true }, compute: (s) => Number(s.price) },
        freeAbove: { needs: { freeAbove: true }, compute: (s) => dec(s.freeAbove) },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof withDecimalConversion> };

export const prisma =
  globalForPrisma.prisma ??
  withDecimalConversion(
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
