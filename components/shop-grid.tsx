"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";

function formatPrice(amount: string, currencyCode: string) {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const variants = product.variants.edges.map((e) => e.node);
  const hasMultipleVariants =
    variants.length > 1 || variants[0]?.title !== "Default Title";
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? "");

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const images = product.images.edges.map((e) => e.node);
  const hero = images[0];

  const priceLabel =
    product.priceRange.minVariantPrice.amount ===
    product.priceRange.maxVariantPrice.amount
      ? formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )
      : `From ${formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )}`;

  async function handleAddToCart() {
    if (!selectedVariant?.availableForSale) return;
    setLoading(true);
    await addItem(selectedVariant.id);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-muted">
        {hero ? (
          <Image
            src={hero.url}
            alt={hero.altText ?? product.title}
            width={600}
            height={600}
            className="w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="aspect-square w-full bg-muted" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-snug">{product.title}</p>
          <span className="text-sm font-semibold shrink-0">{priceLabel}</span>
        </div>

        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {hasMultipleVariants && (
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="text-xs border border-border rounded-md px-2 py-1.5 bg-background w-full"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                {v.title}
                {!v.availableForSale ? " — Sold out" : ""}
              </option>
            ))}
          </select>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale || loading}
          size="sm"
          className="w-full"
        >
          {loading
            ? "Adding..."
            : !selectedVariant?.availableForSale
            ? "Sold Out"
            : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

export function ShopGrid({ products }: { products: ShopifyProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
