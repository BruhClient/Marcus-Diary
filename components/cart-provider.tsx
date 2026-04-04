"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  createCart,
  getCart,
  addToCart,
  removeFromCart,
  updateCartLine,
  type Cart,
} from "@/lib/shopify";

type CartContext = {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  itemCount: number;
};

const CartCtx = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Restore or create cart on mount
  useEffect(() => {
    async function init() {
      const storedId = localStorage.getItem("shopify_cart_id");
      if (storedId) {
        const existing = await getCart(storedId);
        if (existing) {
          setCart(existing);
          return;
        }
      }
      const fresh = await createCart();
      if (!fresh) return;
      localStorage.setItem("shopify_cart_id", fresh.id);
      setCart(fresh);
    }
    init();
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart) return;
      const updated = await addToCart(cart.id, variantId, quantity);
      setCart(updated);
      setCartOpen(true);
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      const updated = await removeFromCart(cart.id, lineId);
      setCart(updated);
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      const updated = await updateCartLine(cart.id, lineId, quantity);
      setCart(updated);
    },
    [cart]
  );

  const itemCount =
    cart?.lines.edges.reduce((sum, { node }) => sum + node.quantity, 0) ?? 0;

  return (
    <CartCtx.Provider
      value={{ cart, cartOpen, setCartOpen, addItem, removeItem, updateItem, itemCount }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
