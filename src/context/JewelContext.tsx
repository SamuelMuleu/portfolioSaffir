
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Jewel } from "@/types/Jewel";



type JewelContextType = {
  jewels: Jewel[];
};


export const JewelContext = createContext<JewelContextType>({ jewels: [] });


export const useJewel = () => useContext(JewelContext);


type JewelProviderProps = {
  children: ReactNode;
};

export const JewelProvider = ({ children }: JewelProviderProps) => {
  const [jewels, setJewels] = useState<Jewel[]>([]);

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

  return (
    <JewelContext.Provider value={{ jewels }}>
      {children}
    </JewelContext.Provider>
  );
};
