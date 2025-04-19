import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
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
  if (
    !file ||
    !name ||
    !price ||
    !categories ||
    categories.length === 0 ||
    !description
  ) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const imageBase64 = await convertToBase64(file);

  const formattedCategories = isPromotion
    ? [...new Set([...categories, JewelCategory.Promoção])]
    : categories.filter((c) => c !== JewelCategory.Promoção);
  const docRef = await addDoc(collection(db, "joias"), {
    name,
    price,
    categories: formattedCategories,
    description,
    imageBase64,
    isPromotion,
    originalPrice: isPromotion ? originalPrice : null,
    promotionTag: isPromotion ? promotionTag : null,
  });

  return {
    id: docRef.id,
    name,
    price,
    categories: formattedCategories,
    description,
    imageBase64,
    isPromotion: isPromotion || false,
    originalPrice: isPromotion ? originalPrice : "",
    promotionTag: isPromotion ? promotionTag : "",
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
  if (
    !data.name ||
    !data.price ||
    !data.categories ||
    data.categories.length === 0
  ) {
    throw new Error("Nome, preço e categoria são obrigatórios");
  }

  const jewelRef = doc(db, "joias", id);
  const updateData: Partial<Jewel> = {
    name: data.name,
    price: data.price,

    description: data.description,
    categories: data.categories,
  };
  if (data.image) {
    const imageBase64 = await convertToBase64(data.image);
    updateData.imageBase64 = imageBase64;
  }
  if (data.isPromotion) {
    updateData.isPromotion = true;
    if (data.originalPrice !== undefined) {
      updateData.originalPrice = data.originalPrice;
    }
    if (data.promotionTag !== undefined) {
      updateData.promotionTag = data.promotionTag;
    }
  } else {
    updateData.isPromotion = false;
    updateData.originalPrice = "";
    updateData.promotionTag = "";
  }

  try {
    await updateDoc(jewelRef, updateData);

    return {
      id,
      name: data.name,
      price: data.price,
      categories: data.categories,
      description: data.description,
      imageBase64: updateData.imageBase64 || "",
      isPromotion: data.isPromotion || false,
      originalPrice: data.isPromotion ? data.originalPrice : "",
      promotionTag: data.isPromotion ? data.promotionTag : "",
    };
  } catch (error) {
    console.error("Erro ao atualizar joia:", error);
    throw new Error("Falha ao atualizar joia");
  }
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

      resolve(compressedBase64);
    };

    img.onerror = (error) => reject(error);
  });
};
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result as string;

      if (base64Image.length > 1048487) {
        compressImage(file)
          .then((compressedBase64) => resolve(compressedBase64))
          .catch(reject);
      } else {
        resolve(base64Image);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getJewelries = async (): Promise<Jewel[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "joias"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      price: doc.data().price,
      description: doc.data().description || "",
      categories: doc.data().categories || [],
      imageBase64: doc.data().imageBase64,
      isPromotion: doc.data().isPromotion || false,
      originalPrice: doc.data().originalPrice ?? "",
      promotionTag: doc.data().promotionTag || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar joias:", error);
    throw new Error("Falha ao buscar joias");
  }
};
