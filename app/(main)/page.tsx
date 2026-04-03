import { client, urlFor } from "@/lib/sanity";
import { Slideshow } from "@/components/slideshow";
import { Backstory } from "@/components/backstory";
import { StraitsTimes } from "@/components/straits-times-section";
import { FadeIn } from "@/components/fade-in";

async function getSlideshowImages() {
  const data = await client.fetch(
    `*[_type == "slideshow"][0]{ images[]{ asset, alt } }`
  );
  if (!data?.images) return [];
  return data.images.map((img: { asset: { _ref: string }; alt?: string }) => ({
    src: urlFor(img).width(1920).url(),
    alt: img.alt ?? "Slideshow image",
  }));
}

export default async function Home() {
  const slideshowImages = await getSlideshowImages();

  return (
    <>
      <Slideshow images={slideshowImages} />
      <FadeIn><Backstory /></FadeIn>
      <FadeIn><StraitsTimes /></FadeIn>
    </>
  );
}
