"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SlideImage = {
  src: string;
  alt: string;
};

type SlideshowProps = {
  images: SlideImage[];
};

const INTERVAL = 5000;

export function Slideshow({ images }: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, images.length]);

  if (!images.length) return null;

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Bottom text */}
      <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 text-white">
        <h1 className="text-4xl whitespace-nowrap">Goh Wei Yu Marcus</h1>
        <Button variant="striking" size="xl">
          View Gallery
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`size-2 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
