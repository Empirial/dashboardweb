import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Niche = "hospitality" | "food" | "retail" | "beauty" | "automotive" | "cleaning";
export type CartLine = { id: string; name: string; price: number; qty: number; note?: string };

type ProductState = {
  niche: Niche;
  setNiche: (niche: Niche) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setCart: React.Dispatch<React.SetStateAction<CartLine[]>>;
};

const ProductContext = createContext<ProductState | null>(null);
let sessionNiche: Niche = "hospitality";
let sessionDark = false;
let sessionCart: CartLine[] = [];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [niche, setNicheState] = useState<Niche>(sessionNiche);
  const [dark, setDarkState] = useState(sessionDark);
  const [cart, setCartState] = useState<CartLine[]>(sessionCart);

  const setCart: React.Dispatch<React.SetStateAction<CartLine[]>> = (next) => {
    setCartState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      sessionCart = value;
      return value;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const value = useMemo<ProductState>(() => ({
    niche,
    setNiche: (next) => {
      sessionNiche = next;
      setNicheState(next);
      setCart([]);
    },
    dark,
    setDark: (next) => {
      sessionDark = next;
      setDarkState(next);
    },
    cart,
    setCart,
    addToCart: (line) => setCart((current) => {
      const found = current.find((item) => item.id === line.id);
      if (found) return current.map((item) => item.id === line.id ? { ...item, qty: item.qty + (line.qty ?? 1) } : item);
      return [...current, { ...line, qty: line.qty ?? 1 }];
    }),
  }), [niche, dark, cart]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const value = useContext(ProductContext);
  if (!value) throw new Error("useProduct must be used inside ProductProvider");
  return value;
}
