import prisma from "@/lib/db";
import { getMeili, PRODUCTS_INDEX } from "@/lib/meilisearch";

/**
 * Meilisearch-backed product search. Falls back to nothing (callers keep their existing SQL
 * `contains`/`LIKE` search) whenever MEILISEARCH_HOST isn't configured — see
 * product.service.ts's listProducts()/autocomplete(), which only call into this module when
 * `isSearchConfigured()` is true.
 *
 * Scope: this only replaces the free-text match (`q`) with Meilisearch's typo-tolerant search,
 * returning a set of matching product ids. All the *other* filters in listProducts() (category,
 * price range, size/color, on-sale, stock, sort, pagination) stay exactly as they are today —
 * Prisma queries `where: { id: { in: matchedIds }, ...everythingElse }`. Reimplementing every one
 * of those filters (especially on-sale, which depends on live, date-scheduled promotions computed
 * in JS) as Meilisearch facets would be a much larger project than "swap the search engine."
 */

export function isSearchConfigured(): boolean {
  return getMeili() !== null;
}

type IndexedProduct = {
  id: string;
  name: string;
  sku: string;
  tags: string;
  description: string;
  shortDescription: string;
  brand: string;
};

async function ensureIndex() {
  const client = getMeili();
  if (!client) return null;
  const index = client.index<IndexedProduct>(PRODUCTS_INDEX);
  // idempotent — safe to call before every write, cheap no-op once already set
  await index.updateSearchableAttributes(["name", "sku", "tags", "brand", "shortDescription", "description"]);
  return index;
}

/** Index (or re-index) one product, or remove it from the index if it's not ACTIVE/doesn't exist. */
export async function syncProductIndex(productId: string) {
  const index = await ensureIndex();
  if (!index) return;
  const p = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, sku: true, tags: true, description: true, shortDescription: true, brand: true, status: true },
  });
  if (!p || p.status !== "ACTIVE") {
    await index.deleteDocument(productId).catch(() => {});
    return;
  }
  await index.addDocuments([
    {
      id: p.id,
      name: p.name,
      sku: p.sku,
      tags: p.tags ?? "",
      description: p.description ?? "",
      shortDescription: p.shortDescription ?? "",
      brand: p.brand,
    },
  ]);
}

export async function removeProductFromIndex(productId: string) {
  const index = await ensureIndex();
  if (!index) return;
  await index.deleteDocument(productId).catch(() => {});
}

/** Returns matching product ids for a free-text query, typo-tolerant. Empty array if unconfigured or no matches. */
export async function searchProductIds(q: string, limit = 200): Promise<string[]> {
  const index = await ensureIndex();
  if (!index || !q) return [];
  const result = await index.search(q, { limit, attributesToRetrieve: ["id"] });
  return result.hits.map((h: IndexedProduct) => h.id);
}

/** One-off full reindex — run after enabling Meilisearch for the first time on an existing catalog. */
export async function backfillSearchIndex() {
  const index = await ensureIndex();
  if (!index) return { indexed: 0 };
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, sku: true, tags: true, description: true, shortDescription: true, brand: true },
  });
  await index.addDocuments(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      tags: p.tags ?? "",
      description: p.description ?? "",
      shortDescription: p.shortDescription ?? "",
      brand: p.brand,
    }))
  );
  return { indexed: products.length };
}
