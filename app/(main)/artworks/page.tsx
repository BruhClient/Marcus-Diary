import { client, urlFor } from "@/lib/sanity";
import { Masonry } from "@/components/masonry";

type Artwork = {
  _id: string;
  title?: string;
  description?: string;
  price: number;
  sold: boolean;
  images: { asset: { _ref: string } }[];
};

async function getArtworks(): Promise<Artwork[]> {
  return (
    (await client.fetch(
      `*[_type == "artwork"]{ _id, title, description, price, sold, images }`
    )) ?? []
  );
}

export default async function ArtworksPage() {
  const artworks = await getArtworks();

  const masonryItems = artworks
    .filter((a) => a.images?.length > 0)
    .sort((a, b) => Number(a.sold) - Number(b.sold))
    .map((a, i) => ({
      id: a._id,
      src: urlFor(a.images[0]).width(1200).url(),
      images: a.images.map((img) => urlFor(img).width(1200).url()),
      alt: a.title ?? `Artwork ${i + 1}`,
      title: a.title,
      description: a.description,
      price: a.price,
      sold: a.sold,
      isOriginal: true,
    }));

  return (
    <main className="px-4 py-6 md:px-8">
      {masonryItems.length > 0 ? (
        <Masonry items={masonryItems} columns={4} />
      ) : (
        <p className="text-muted-foreground text-center py-20">No artworks yet.</p>
      )}
    </main>
  );
}
