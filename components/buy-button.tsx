"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  title: string;
  price: number;
  image?: string;
  isOriginal?: boolean;
};

export function BuyButton({ id, title, price, image, isOriginal = false }: Props) {
  const { addItem, items } = useCart();

  const inCart = items.some((i) => i.id === id);
  const disabled = isOriginal && inCart;

  return (
    <Button
      onClick={() => addItem({ id, title, price, image, isOriginal })}
      disabled={disabled}
      size="sm"
      className="w-full"
      variant={inCart ? "secondary" : "default"}
    >
      {inCart ? (
        <>
          <Check className="size-4" />
          In Cart
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
