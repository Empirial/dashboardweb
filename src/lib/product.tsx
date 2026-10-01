import { useEffect, useMemo, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { createPersistedStore } from "./persisted-store";

export type Niche = "hospitality" | "food" | "retail" | "beauty" | "automotive" | "cleaning";
export type CartLine = { id: string; name: string; price: number; qty: number; note?: string };

type ProductState = {
  niche: Niche;
  setNiche: (niche: Niche) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setCart: Dispatch<SetStateAction<CartLine[]>>;
};

type Session = { niche: Niche; dark: boolean; cart: CartLine[] };

const session = createPersistedStore<Session>("session", {
  niche: "hospitality",
  dark: false,
  cart: [],
});

const setNiche = (next: Niche) =>
  session.set((current) =>
    current.niche === next ? current : { ...current, niche: next, cart: [] },
  );

const setDark = (next: boolean) => session.set((current) => ({ ...current, dark: next }));

const setCart: Dispatch<SetStateAction<CartLine[]>> = (next) =>
  session.set((current) => ({
    ...current,
    cart: typeof next === "function" ? next(current.cart) : next,
  }));

const addToCart: ProductState["addToCart"] = (line) =>
  setCart((current) => {
    const found = current.find((item) => item.id === line.id);
    if (found) {
      return current.map((item) =>
        item.id === line.id ? { ...item, qty: item.qty + (line.qty ?? 1) } : item,
      );
    }
    return [...current, { ...line, qty: line.qty ?? 1 }];
  });

export function ProductProvider({ children }: { children: ReactNode }) {
  const { dark } = session.use();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return <>{children}</>;
}

export function useProduct(): ProductState {
  const { niche, dark, cart } = session.use();
  return useMemo(
    () => ({ niche, setNiche, dark, setDark, cart, addToCart, setCart }),
    [niche, dark, cart],
  );
}
