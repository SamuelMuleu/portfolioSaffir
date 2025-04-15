import { Jewel } from "@/types/Jewel";
import { useState } from "react";
import { JewelContext } from "./JewelContext";

interface Props {
  children: React.ReactNode;
}

export default function JewelProvider({ children }: Props) {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [selectedJewel, setSelectedJewel] = useState<Jewel | null>(null); // <-- Adicionado aqui

  const addJewel = (jewel: Jewel) => {
    setJewels((prev) => [...prev, jewel]);
  };

  const removeJewel = (id: string) => {
    setJewels((prev) => prev.filter((jewel) => jewel.id !== id));
  };

  return (
    <JewelContext.Provider
      value={{
        jewels,
        addJewel,
        removeJewel,
        selectedJewel,
        setSelectedJewel,
      }}
    >
      {children}
    </JewelContext.Provider>
  );
}
