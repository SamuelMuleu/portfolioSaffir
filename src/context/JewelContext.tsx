import { createContext, useContext, useState, ReactNode } from "react";
import { Jewel, JewelCategory } from "@/types/Jewel";  // Certifique-se de importar o tipo Jewel corretamente

interface JewelContextType {
  jewels: Jewel[];
  setJewels: (jewels: Jewel[]) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  name: string;
  setName: (value: string) => void;
  price: string;
  setPrice: (price: string) => void;
  categories: JewelCategory[];
  setCategories: (categories: JewelCategory[]) => void;
  description: string;
  setDescription: (description: string) => void;
  originalPrice: string;
  setOriginalPrice: (price: string) => void;
  isPromotion: boolean;
  setIsPromotion: (value: boolean) => void;

  promotionTag: string;
  setPromotionTag: (value: string) => void;
  addJewel: (jewel: Jewel) => void;
  removeJewel: (id: string) => void;
}

export const JewelContext = createContext<JewelContextType | undefined>(undefined);

export const useJewel = () => {
  const context = useContext(JewelContext);
  if (!context) {
    throw new Error("useJewel deve ser usado dentro de JewelProvider");
  }
  return context;
};

export const JewelProvider = ({ children }: { children: ReactNode }) => {
  const [jewels, setJewels] = useState<Jewel[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<JewelCategory[]>([]);
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionTag, setPromotionTag] = useState("");

  const addJewel = (jewel: Jewel) => {
    setJewels((prevJewels) => [...prevJewels, jewel]);
  };

  const removeJewel = (id: string) => {
    setJewels((prevJewels) => prevJewels.filter((jewel) => jewel.id !== id));
  };

  return (
    <JewelContext.Provider
      value={{
        jewels,
        setJewels,
        image,
        setImage,
        name,
        setName,
        price,
        setPrice,
        categories,
        setCategories,
        description,
        setDescription,
        originalPrice,
        setOriginalPrice,
    
        isPromotion,
        setIsPromotion,
        promotionTag,
        setPromotionTag,
        addJewel,
        removeJewel,
      }}
    >
      {children}
    </JewelContext.Provider>
  );
};
