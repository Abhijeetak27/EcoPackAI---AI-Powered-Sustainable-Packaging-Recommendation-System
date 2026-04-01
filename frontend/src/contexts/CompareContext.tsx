import { createContext, useContext, useState, ReactNode } from "react";
import { PackagingMaterial } from "@/data/materials";

interface CompareContextType {
  compareList: PackagingMaterial[];
  addToCompare: (m: PackagingMaterial) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<PackagingMaterial[]>([]);

  const addToCompare = (m: PackagingMaterial) => {
    if (compareList.length < 4 && !compareList.find(c => c.id === m.id)) {
      setCompareList(prev => [...prev, m]);
    }
  };
  const removeFromCompare = (id: string) => setCompareList(prev => prev.filter(c => c.id !== id));
  const clearCompare = () => setCompareList([]);
  const isInCompare = (id: string) => compareList.some(c => c.id === id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
