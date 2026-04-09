"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BuyButton } from "@/components/buy-button";

export type MasonryItem = {
  id?: string;
  src: string;
  images?: string[];
  alt: string;
  title?: string;
  description?: string;
  price?: number;
  sold?: boolean;
  isOriginal?: boolean;
};

type MasonryProps = {
  items: MasonryItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function Masonry({ items, columns = 3, className }: MasonryProps) {
  const [selected, setSelected] = useState<MasonryItem | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const colClass = {
    2: "columns-1 sm:columns-2",
    3: "columns-1 sm:columns-2 md:columns-3",
    4: "columns-1 sm:columns-2 md:columns-3 lg:columns-4",
  }[columns];

  function open(item: MasonryItem) {
    setSelected(item);
    setSlideIndex(0);
  }

  const slides = selected?.images ?? (selected ? [selected.src] : []);
  const hasMultiple = slides.length > 1;

  return (
    <>
      <div className={cn(colClass, "gap-4", className)}>
        {items.map((item, i) => (
          <div
            key={i}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => open(item)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Sold ribbon */}
            {item.sold && (
              <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
                <span className="absolute top-7 -right-7 w-36 rotate-45 bg-red-600 text-white text-xs font-bold text-center py-1 shadow-md tracking-wide uppercase">
                  Sold
                </span>
              </div>
            )}

            {/* Price tag */}
            {item.price != null && !item.sold && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                S${item.price}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden gap-0 rounded-2xl">
          {selected && (
            <div className="flex flex-col md:flex-row">
              {/* Image side */}
              <div className="relative md:w-2/3 bg-neutral-900 shrink-0">
                <Image
                  src={slides[slideIndex]}
                  alt={selected.alt}
                  width={800}
                  height={800}
                  className="w-full h-72 md:h-full object-cover"
                />

                {/* Carousel controls */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideIndex(i)}
                          className={cn(
                            "size-1.5 rounded-full transition-colors",
                            i === slideIndex ? "bg-white" : "bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Details side */}
              <div className="flex flex-col flex-1 p-6 md:p-8 relative">
                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="size-4" />
                </button>

                <div className="flex flex-col gap-4 flex-1">
                  <DialogTitle className={selected.title ? "text-xl font-bold pr-6 leading-tight" : "sr-only"}>
                    {selected.title ?? "Artwork"}
                  </DialogTitle>

                  {selected.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selected.description}
                    </p>
                  )}
                </div>

                {/* Price + action */}
                <div className="mt-6 pt-4 border-t border-border">
                  {selected.sold ? (
                    <p className="text-sm text-muted-foreground">This artwork has been sold.</p>
                  ) : selected.price != null && selected.id ? (
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Price</p>
                        <p className="text-2xl font-bold">S${selected.price}</p>
                      </div>
                      <BuyButton
                        id={selected.id}
                        title={selected.title ?? selected.alt}
                        price={selected.price}
                        image={selected.src}
                        isOriginal={selected.isOriginal}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
