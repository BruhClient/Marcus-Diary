import { client, urlFor } from "@/lib/sanity";
import { Masonry } from "@/components/masonry";

type PressFeature = {
  publication: string;
  date: string;
  chinese: string;
  english: string;
  images: { asset: { _ref: string } }[];
};

async function getPressFeature(): Promise<PressFeature | null> {
  return client.fetch(
    `*[_type == "pressFeature"] | order(date desc) [0]{
      publication, date, chinese, english,
      images[]{ asset }
    }`
  );
}

export async function StraitsTimes() {
  const data = await getPressFeature();

  if (!data) return null;

  const masonryItems = data.images?.map((img, i) => ({
    src: urlFor(img).width(900).url(),
    alt: `${data.publication} image ${i + 1}`,
  })) ?? [];

  const formatted = new Date(data.date).toLocaleDateString("en-SG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">As featured in</p>
        <h2 className="text-2xl font-bold">{data.publication}</h2>
        <p className="text-sm text-muted-foreground mt-1">{formatted}</p>
      </div>

      <p className="text-lg leading-relaxed text-foreground">{data.chinese}</p>

      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-sm">✦</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-lg leading-relaxed text-foreground">{data.english}</p>

      {masonryItems.length > 0 && (
        <div className="mt-14">
          <Masonry items={masonryItems} columns={2} />
        </div>
      )}
    </section>
  );
}
