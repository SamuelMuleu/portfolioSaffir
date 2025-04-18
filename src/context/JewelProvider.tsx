import { Jewel, JewelCategory } from "@/types/Jewel";
import { ReactNode, useState } from "react";
import { JewelContext } from "./JewelContext";

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