// context/useJewel.ts
import { Jewel } from "@/types/Jewel";
import { createContext, useContext } from "react";


export interface JewelContextType {
    jewels: Jewel[];
    addJewel: (jewel: Jewel) => void;
    removeJewel: (id: string) => void;
    selectedJewel: Jewel | null;
    setSelectedJewel: (jewel: Jewel | null) => void;
  }

export const JewelContext = createContext<JewelContextType | undefined>(undefined);

export const useJewel = () => {
  const context = useContext(JewelContext);
  if (!context) {
    throw new Error("useJewel deve ser usado dentro de JewelProvider");
  }
  return context;
};
