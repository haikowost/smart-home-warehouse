'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/products';
import { getWishlistIds, toggleWishlistItem, removeWishlistItem } from '@/lib/wishlist';

interface WishlistContextType {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType>({
  ids: [], count: 0,
  has: () => false,
  toggle: () => {},
  remove: () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => { setIds(getWishlistIds()); }, []);

  return (
    <WishlistContext.Provider value={{
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (product) => setIds(toggleWishlistItem(product.id)),
      remove: (id) => setIds(removeWishlistItem(id)),
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
