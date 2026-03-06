'use client';

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;     // selling price (GHS)
  costPrice: number; // actual cost price (GHS)
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; size?: string; color?: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR' }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload };
    case 'ADD_ITEM': {
      const key = `${action.payload.id}-${action.payload.size ?? ''}-${action.payload.color ?? ''}`;
      const existing = state.items.find(
        (i) => `${i.id}-${i.size ?? ''}-${i.color ?? ''}` === key
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            `${i.id}-${i.size ?? ''}-${i.color ?? ''}` === key
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      const key = `${action.payload.id}-${action.payload.size ?? ''}-${action.payload.color ?? ''}`;
      return { ...state, items: state.items.filter((i) => `${i.id}-${i.size ?? ''}-${i.color ?? ''}` !== key) };
    }
    case 'UPDATE_QTY': {
      const key = `${action.payload.id}-${action.payload.size ?? ''}-${action.payload.color ?? ''}`;
      return {
        ...state,
        items: state.items.map((i) =>
          `${i.id}-${i.size ?? ''}-${i.color ?? ''}` === key
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN_MODAL':
      return { ...state, isOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQty: (id: string, quantity: number, size?: string, color?: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gh_cart');
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem('gh_cart', JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        total,
        totalItems,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (id, size, color) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size, color } }),
        updateQty: (id, quantity, size, color) =>
          dispatch({ type: 'UPDATE_QTY', payload: { id, quantity, size, color } }),
        clear: () => dispatch({ type: 'CLEAR' }),
        openCart: () => dispatch({ type: 'OPEN_MODAL' }),
        closeCart: () => dispatch({ type: 'CLOSE_MODAL' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
