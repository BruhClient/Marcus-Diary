import { getProducts } from "@/lib/shopify";
import { ShopGrid } from "@/components/shop-grid";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="px-4 py-6 md:px-8">
      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">
          Failed to fetch products.
        </p>
      ) : (
        <ShopGrid products={products} />
      )}
    </main>
  );
}
