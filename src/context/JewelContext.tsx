import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Jewel } from "@/types/Jewel";

export interface JewelContextType {
  jewels: Jewel[];
  selectedJewel: Jewel | null;
  setSelectedJewel: (jewel: Jewel | null) => void;
  addJewel: (jewel: Jewel) => void;
  removeJewel: (id: string) => void;
}

export const JewelContext = createContext<JewelContextType>({} as JewelContextType);

export const useJewel = () => useContext(JewelContext);

type JewelProviderProps = {
  children: ReactNode;
};

export const JewelProvider = ({ children }: JewelProviderProps) => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [selectedJewel, setSelectedJewel] = useState<Jewel | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "joias"), (snapshot) => {
      const jewelData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Jewel[];

      setJewels(jewelData);
    });

    return () => unsubscribe();
  }, []);

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
        selectedJewel,
        setSelectedJewel,
        addJewel,
        removeJewel,
      }}
    >
      {children}
    </JewelContext.Provider>
  );
};
