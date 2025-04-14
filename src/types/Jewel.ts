export enum JewelCategory {
  Correntaria = "correntaria",
  Conjuntos = "conjuntos",
  Aliancas = "aliancas",
  Aneis = "Aneis",
  Brincos = "Brincos",
  Pingentes = "Pingentes",
  Promoção = "Promoção"
}
export type Jewel = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string; // Novo campo para preço original
  categories: JewelCategory[];
  description: string;
  imageBase64: string;
  isPromotion?: boolean; // Novo campo para identificar promoções
  promotionTag?: string; // Tag personalizada (ex: "50% OFF")
};
