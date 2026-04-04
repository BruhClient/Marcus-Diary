import { getProducts } from "@/lib/shopify";
import { Masonry } from "@/components/masonry";

export default async function GalleryPage() {
  const products = await getProducts();

  const galleryItems = products
    .filter((p) => p.images.edges.length > 0)
    .map((product) => ({
      src: product.images.edges[0].node.url,
      images: product.images.edges.map((e) => e.node.url),
      alt: product.images.edges[0].node.altText ?? product.title,
      title: product.title,
      description: product.description,
    }));

  return (
    <main className="px-4 py-6 md:px-8">
      {galleryItems.length > 0 ? (
        <Masonry items={galleryItems} columns={4} />
      ) : (
        <p className="text-muted-foreground text-center py-20">Failed to fetch artworks.</p>
      )}
    </main>
  );
}
