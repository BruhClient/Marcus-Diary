import { client } from "@/lib/sanity";

type BackstoryData = {
  chinese: string;
  english: string;
};

async function getBackstory(): Promise<BackstoryData | null> {
  return client.fetch(`*[_type == "backstory"][0]{ chinese, english }`);
}

export async function Backstory() {
  const data = await getBackstory();

  if (!data) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-lg leading-relaxed text-foreground">{data.chinese}</p>

      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-sm">✦</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-lg leading-relaxed text-foreground">{data.english}</p>
    </section>
  );
}
