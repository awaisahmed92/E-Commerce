import { backfillSearchIndex } from "@/services/search.service";

backfillSearchIndex()
  .then((r) => {
    console.log(`Indexed ${r.indexed} products.`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
