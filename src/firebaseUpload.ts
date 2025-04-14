import { db } from "./firebaseConfig";
import { collection, addDoc, doc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import { Jewel, JewelCategory } from "./types/Jewel";



export const uploadJewelry = async (
  file: File,
  name: string,
  price: string,
  categories: JewelCategory[],
  description: string,
  isPromotion?: boolean,
  originalPrice?: string,
  promotionTag?: string
): Promise<Jewel> => {
  if (!file || !name || !price || !categories || categories.length === 0 || !description) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const imageBase64 = await convertToBase64(file);

  const docRef = await addDoc(collection(db, "joias"), {
    name,
    price,
    categories: isPromotion ? [...categories, "promocao"] : categories,
    description,
    imageBase64,
    isPromotion: isPromotion || false,
    originalPrice: isPromotion ? originalPrice : null,
    promotionTag: isPromotion ? promotionTag : null,

  });

  return {
    id: docRef.id,
    name,
    price,
    categories: isPromotion ? [...categories, "Promoção" as JewelCategory] : categories,
    description,
    imageBase64,
    isPromotion: isPromotion || false,
    originalPrice: isPromotion ? originalPrice : undefined,
    promotionTag: isPromotion ? promotionTag : undefined,

  };
};

export const deleteJewelry = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID da joia é obrigatório");

  try {
    await deleteDoc(doc(db, "joias", id));
  } catch (error) {
    console.error("Erro ao deletar joia:", error);
    throw new Error("Falha ao deletar joia");
  }
};

export const updateJewelry = async (
  id: string,
  data: {
    name: string;
    price: string;
    description: string;
    categories: JewelCategory[];
    image?: File;
    isPromotion?: boolean;
    originalPrice?: string;
    promotionTag?: string;
  }
): Promise<Jewel> => {
  if (!id) throw new Error("ID da joia é obrigatório");
  if (!data.name || !data.price || !data.categories || data.categories.length === 0) {
    throw new Error("Nome, preço e categoria são obrigatórios");
  }

  const jewelRef = doc(db, "joias", id);
  const updateData: Partial<Jewel> = {
    name: data.name,
    price: data.price,
    description: data.description,
    categories: data.categories,
    isPromotion: data.isPromotion || false,
    originalPrice: data.isPromotion ? data.originalPrice : undefined,
    promotionTag: data.isPromotion ? data.promotionTag : undefined,
  };

  if (data.image) {
    updateData.imageBase64 = await convertToBase64(data.image);
  }

  try {
    await updateDoc(jewelRef, updateData);

    return {
      id,
      name: data.name,
      price: data.price,
      categories: data.categories,
      description: data.description,
      imageBase64: updateData.imageBase64 || '',
      isPromotion: data.isPromotion || false,
      originalPrice: data.isPromotion ? data.originalPrice : undefined,
      promotionTag: data.isPromotion ? data.promotionTag : undefined,
    };
  } catch (error) {
    console.error("Erro ao atualizar joia:", error);
    throw new Error("Falha ao atualizar joia");
  }
};
// Função auxiliar para converter arquivo para Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const getJewelries = async (): Promise<Jewel[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "joias"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      price: doc.data().price,
      description: doc.data().description || "",
      categories: doc.data().categories || [],
      imageBase64: doc.data().imageBase64,
      isPromotion: doc.data().isPromotion || false,
      originalPrice: doc.data().originalPrice || undefined,
      promotionTag: doc.data().promotionTag || undefined,
    }));
  } catch (error) {
    console.error("Erro ao buscar joias:", error);
    throw new Error("Falha ao buscar joias");
  }
};