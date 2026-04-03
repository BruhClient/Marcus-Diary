"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type MasonryItem = {
  src: string;
  images?: string[];
  alt: string;
  title?: string;
  description?: string;
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

  function prev() {
    setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setSlideIndex((i) => (i + 1) % slides.length);
  }

  return (
    <>
      <div className={cn(colClass, "gap-4", className)}>
        {items.map((item, i) => (
          <div
            key={i}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
            onClick={() => open(item)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
          {selected && (
            <div className="flex flex-col">
              <div className="relative w-full bg-black">
                <Image
                  src={slides[slideIndex]}
                  alt={selected.alt}
                  width={800}
                  height={600}
                  className="w-full object-contain max-h-[60vh]"
                />
                {hasMultiple && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
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
              {(selected.title || selected.description) && (
                <div className="p-6 flex flex-col gap-2">
                  {selected.title && (
                    <DialogTitle className="text-xl font-bold">
                      {selected.title}
                    </DialogTitle>
                  )}
                  {selected.description && (
                    <p className="text-muted-foreground text-sm">
                      {selected.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
