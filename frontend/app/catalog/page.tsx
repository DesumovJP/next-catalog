import CatalogClient from "@/components/CatalogClient";
import { fetchSneakers } from "@/lib/api";

export default async function CatalogPage() {
  const sneakers = await fetchSneakers();
  const initialSneakers = sneakers ?? [];

  return (
    <main className="p-4">
      <CatalogClient initialSneakers={initialSneakers} />
    </main>
  );
}
