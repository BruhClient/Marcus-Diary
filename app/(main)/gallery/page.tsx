import { client, urlFor } from "@/lib/sanity";
import { Masonry } from "@/components/masonry";

type GalleryImage = {
  asset: { _ref: string };
  title?: string;
  year?: number;
};

async function getGallery(): Promise<GalleryImage[]> {
  const data = await client.fetch(
    `*[_type == "gallery"][0]{ images[]{ asset, title, year } }`
  );
  return data?.images ?? [];
}

export default async function GalleryPage() {
  const images = await getGallery();

  const masonryItems = images.map((img, i) => ({
    src: urlFor(img).width(1200).url(),
    alt: img.title ?? `Artwork ${i + 1}`,
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
