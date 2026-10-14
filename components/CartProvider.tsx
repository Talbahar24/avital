"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceAgorot: number;
  image: string;
  meaning: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: CartItem) => { ok: boolean; reason?: string };
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "avital-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const persist = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!persist.current) {
      persist.current = true;
      return;
    }
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    let reason = "";
    setItems((current) => {
      if (current.some((row) => row.productId === item.productId)) {
        reason = "הפריט כבר בסל. זה פריט יחיד.";
        return current;
      }
      return [...current, { ...item, qty: 1 }];
    });
    if (reason) return { ok: false, reason };
    setOpen(true);
    return { ok: true };
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      subtotal: items.reduce((sum, item) => sum + item.priceAgorot * item.qty, 0),
      ready,
      open,
      setOpen,
      add,
      remove,
      clear,
    }),
    [items, ready, open, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
