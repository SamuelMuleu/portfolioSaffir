export enum JewelCategory {
  Correntaria = "correntaria",
  Conjuntos = "conjuntos",
  Aliancas = "aliancas",
  Aneis = "Aneis",
  Brincos = "Brincos",
  Pingentes = "Pingentes",
  Promoção = "Promoção",
}
export type Jewel = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string; 
  categories: JewelCategory[];
  description: string;
  imageBase64: string;
  isPromotion?: boolean;
  promotionTag?: string;
};
