import Image from "next/image";
import { cn } from "@/lib/utils";

type MasonryItem = {
  src: string;
  alt: string;
};

type MasonryProps = {
  items: MasonryItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function Masonry({ items, columns = 3, className }: MasonryProps) {
  const colClass = {
    2: "columns-2",
    3: "columns-2 md:columns-3",
    4: "columns-2 md:columns-3 lg:columns-4",
  }[columns];

  return (
    <div className={cn(colClass, "gap-4", className)}>
      {items.map((item, i) => (
        <div key={i} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
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
  );
}
