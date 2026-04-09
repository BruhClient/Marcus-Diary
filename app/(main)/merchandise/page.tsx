import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { BuyButton } from "@/components/buy-button";

type Merchandise = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  category?: { name: string };
  images: { asset: { _ref: string } }[];
};

async function getMerchandise(): Promise<Merchandise[]> {
  return (
    (await client.fetch(
      `*[_type == "merchandise"]{ _id, title, description, price, stock, category->{ name }, images }`,
    )) ?? []
  );
}

export default async function MerchandisePage() {
  const items = await getMerchandise();

  return (
    <main className="px-4 py-6 md:px-8">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">
          No merchandise yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const heroUrl =
              item.images?.length > 0
                ? urlFor(item.images[0]).width(600).url()
                : null;
            const outOfStock = item.stock === 0;

            return (
              <div key={item._id} className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-xl bg-muted">
                  {heroUrl && (
                    <Image
                      src={heroUrl}
                      alt={item.title}
                      width={600}
                      height={600}
                      className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                  {outOfStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-sm font-medium">Sold Out</span>
                    </div>
                  )}
                  {!outOfStock && item.stock <= 5 && (
                    <span className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded-full">
                      {item.stock} left
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{item.title}</p>
                    <span className="text-sm font-semibold shrink-0">
                      S${item.price}
                    </span>
                  </div>
                  {item.category && (
                    <p className="text-xs text-muted-foreground">
                      {item.category.name}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                {!outOfStock && (
                  <div className="px-3 pb-3">
                    <BuyButton
                      id={item._id}
                      title={item.title}
                      price={item.price}
                      image={heroUrl ?? undefined}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
