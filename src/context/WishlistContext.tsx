'use client';

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number; // GHS
  image: string;
  originalPrice?: number;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

type WishlistAction =
  | { type: 'TOGGLE'; payload: WishlistItem }
  | { type: 'REMOVE'; payload: string }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'HYDRATE'; payload: WishlistItem[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload };
    case 'TOGGLE': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      return {
        ...state,
        items: exists
          ? state.items.filter((i) => i.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'OPEN_MODAL':
      return { ...state, isOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  isInWishlist: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gh_wishlist');
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gh_wishlist', JSON.stringify(state.items));
  }, [state.items, hydrated]);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        isInWishlist: (id) => state.items.some((i) => i.id === id),
        toggle: (item) => dispatch({ type: 'TOGGLE', payload: item }),
        remove: (id) => dispatch({ type: 'REMOVE', payload: id }),
        openWishlist: () => dispatch({ type: 'OPEN_MODAL' }),
        closeWishlist: () => dispatch({ type: 'CLOSE_MODAL' }),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
