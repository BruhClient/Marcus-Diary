"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeItem, updateItem } = useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const total = cart?.cost.totalAmount;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-background shadow-xl flex flex-col transition-transform duration-300",
          cartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-lg">Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingBag className="size-10 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {lines.map((line) => {
                const image =
                  line.merchandise.product.images.edges[0]?.node.url;
                const isDefault = line.merchandise.title === "Default Title";
                return (
                  <li key={line.id} className="flex gap-4">
                    {image && (
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={image}
                          alt={line.merchandise.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="text-sm font-medium leading-snug">
                        {line.merchandise.product.title}
                      </p>
                      {!isDefault && (
                        <p className="text-xs text-muted-foreground">
                          {line.merchandise.title}
                        </p>
                      )}
                      <p className="text-sm font-semibold">
                        {line.merchandise.price.currencyCode}{" "}
                        {parseFloat(line.merchandise.price.amount).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            line.quantity === 1
                              ? removeItem(line.id)
                              : updateItem(line.id, line.quantity - 1)
                          }
                          className="rounded border border-border p-0.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-sm w-4 text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          className="rounded border border-border p-0.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && total && (
          <div className="border-t border-border px-6 py-4 flex flex-col gap-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>
                {total.currencyCode} {parseFloat(total.amount).toFixed(2)}
              </span>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full"
            >
              <a href={cart?.checkoutUrl} target="_blank" rel="noopener noreferrer">
                Checkout
              </a>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
