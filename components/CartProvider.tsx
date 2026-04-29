'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, getCart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount } from '@/lib/cart';
import { Product } from '@/lib/products';

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => { setItems(getCart()); }, []);

  const add = useCallback((product: Product, qty = 1) => {
    setItems(addToCart(product, qty));
  }, []);

  const remove = useCallback((id: string) => {
    setItems(removeFromCart(id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems(updateQty(id, qty));
  }, []);

  const clear = useCallback(() => {
    clearCart();
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, count: cartCount(items), total: cartTotal(items), add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
