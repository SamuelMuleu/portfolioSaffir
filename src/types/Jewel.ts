export type JewelCategory = 
  | "correntaria"
  | "conjuntos"
  | "aliancas"
  | "aneis"
  | "brincos";

export type Jewel = {
  id: string;
  name: string;
  price: string;
  category: JewelCategory;
  imageBase64: string;
};
