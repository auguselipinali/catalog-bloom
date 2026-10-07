import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { Business } from "../types";
import {
  cartLines,
  cartStorageKey,
  normalizeCart,
  setCartQuantity,
  type CartEntry,
} from "../lib/cart";
interface CartSnapshot {
  entries: CartEntry[];
  ready: boolean;
  revision: number;
  storageError: boolean;
}
const empty: CartSnapshot = { entries: [], ready: false, revision: 0, storageError: false };
function createCartStore(business: Business) {
  let snapshot = empty;
  let initialized = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  const persist = () => {
    try {
      window.localStorage.setItem(cartStorageKey(business.slug), JSON.stringify(snapshot.entries));
      return false;
    } catch {
      return true;
    }
  };
  const commit = (entries: CartEntry[], added = false) => {
    snapshot = { ...snapshot, entries, revision: snapshot.revision + (added ? 1 : 0) };
    snapshot = { ...snapshot, storageError: persist() };
    emit();
  };
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    hydrate: () => {
      if (initialized) return;
      initialized = true;
      let entries: CartEntry[] = [];
      let storageError = false;
      try {
        const raw = window.localStorage.getItem(cartStorageKey(business.slug));
        entries = normalizeCart(raw ? JSON.parse(raw) : [], business.products);
      } catch {
        storageError = true;
      }
      snapshot = { ...snapshot, entries, ready: true, storageError };
      emit();
    },
    sync: (raw: string | null) => {
      try {
        snapshot = {
          ...snapshot,
          entries: normalizeCart(raw ? JSON.parse(raw) : [], business.products),
        };
        emit();
      } catch {}
    },
    add: (id: string, quantity = 1) => {
      const product = business.products.find((p) => p.id === id);
      const current = snapshot.entries.find((e) => e.productId === id)?.quantity ?? 0;
      if (
        !snapshot.ready ||
        !product ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        current + quantity > product.stock
      )
        return false;
      commit(setCartQuantity(snapshot.entries, business.products, id, current + quantity), true);
      return true;
    },
    setQuantity: (id: string, quantity: number) => {
      if (snapshot.ready)
        commit(setCartQuantity(snapshot.entries, business.products, id, quantity));
    },
    remove: (id: string) => {
      commit(snapshot.entries.filter((e) => e.productId !== id));
    },
    clear: () => commit([]),
  };
}
const stores = new Map<string, ReturnType<typeof createCartStore>>();
function getStore(business: Business) {
  if (typeof window === "undefined") return createCartStore(business);
  let store = stores.get(business.slug);
  if (!store) {
    store = createCartStore(business);
    stores.set(business.slug, store);
  }
  return store;
}
export function useCart(business: Business) {
  const store = useMemo(() => getStore(business), [business]);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, () => empty);
  useEffect(() => {
    store.hydrate();
    const sync = (event: StorageEvent) => {
      if (event.key === cartStorageKey(business.slug) || event.key === null)
        store.sync(event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [store, business.slug]);
  const lines = cartLines(state.entries, business.products);
  return {
    ...state,
    ...store,
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + line.subtotal, 0),
    quantityFor: (id: string) => state.entries.find((e) => e.productId === id)?.quantity ?? 0,
  };
}
