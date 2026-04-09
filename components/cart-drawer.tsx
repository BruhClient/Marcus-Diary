"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAuth, SignIn } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/checkout-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isSignedIn } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

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
          <h2 className="font-semibold text-lg">
            Cart {itemCount > 0 && <span className="text-muted-foreground font-normal text-sm">({itemCount})</span>}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingBag className="size-10 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  {item.image && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="text-sm font-semibold">S${item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {!item.isOriginal && (
                        <>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded border border-border p-0.5 hover:bg-muted transition-colors"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded border border-border p-0.5 hover:bg-muted transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 flex flex-col gap-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>S${total.toFixed(2)}</span>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                if (!isSignedIn) {
                  setSignInOpen(true);
                  return;
                }
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent aria-describedby={undefined} className="p-0 w-auto border-none bg-transparent shadow-none">
          <VisuallyHidden.Root>
            <DialogTitle>Sign in to checkout</DialogTitle>
          </VisuallyHidden.Root>
          <SignIn routing="hash" />
        </DialogContent>
      </Dialog>
    </>
  );
}
