export function getWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('shw-wishlist') || '[]');
  } catch {
    return [];
  }
}

export function toggleWishlistItem(productId: string): string[] {
  const ids = getWishlistIds();
  const updated = ids.includes(productId)
    ? ids.filter(id => id !== productId)
    : [...ids, productId];
  localStorage.setItem('shw-wishlist', JSON.stringify(updated));
  return updated;
}

export function removeWishlistItem(productId: string): string[] {
  const updated = getWishlistIds().filter(id => id !== productId);
  localStorage.setItem('shw-wishlist', JSON.stringify(updated));
  return updated;
}
