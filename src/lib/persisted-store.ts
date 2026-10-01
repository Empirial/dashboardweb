import { useSyncExternalStore } from "react";

const PREFIX = "empirial-demo:v1:";
const resetters: Array<() => void> = [];

/**
 * Tiny external store that survives page reloads via localStorage.
 * Server renders (and the first client render) use `initial`, so hydration
 * stays consistent; saved data is applied right after mount.
 */
export function createPersistedStore<T>(name: string, initial: T) {
  const key = PREFIX + name;
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return false;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        state = JSON.parse(raw) as T;
        return true;
      }
    } catch {
      // Storage can be blocked or corrupt; fall back to the initial data.
    }
    return false;
  };

  const emit = () => listeners.forEach((listener) => listener());

  const get = () => {
    hydrate();
    return state;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (hydrate()) listener();
    return () => {
      listeners.delete(listener);
    };
  };

  const set = (next: T | ((current: T) => T)) => {
    hydrate();
    state = typeof next === "function" ? (next as (current: T) => T)(state) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota or privacy-mode failures; the in-memory state still works.
    }
    emit();
  };

  const reset = () => {
    state = initial;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
    emit();
  };
  resetters.push(reset);

  const use = () => useSyncExternalStore(subscribe, get, () => initial);

  return { use, get, set, reset };
}

/** Clears every persisted demo store (niche, cart, sales, bookings, enquiries). */
export const resetDemoData = () => resetters.forEach((reset) => reset());
