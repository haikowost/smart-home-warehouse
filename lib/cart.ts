'use client';
import { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'shw-cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Product, qty = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find((i) => i.product.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ product, quantity: qty });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((i) => i.product.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateQty(productId: string, qty: number): CartItem[] {
  const cart = getCart();
  const item = cart.find((i) => i.product.id === productId);
  if (item) item.quantity = Math.max(1, qty);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
