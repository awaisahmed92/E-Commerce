import { Meilisearch } from "meilisearch";

const globalForMeili = globalThis as unknown as { meili?: Meilisearch | null };

/** Lazily-created singleton. Returns null when MEILISEARCH_HOST isn't configured — callers fall back to SQL search. */
export function getMeili(): Meilisearch | null {
  if (!process.env.MEILISEARCH_HOST) return null;
  if (globalForMeili.meili === undefined) {
    globalForMeili.meili = new Meilisearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
    });
  }
  return globalForMeili.meili;
}

export const PRODUCTS_INDEX = "products";
