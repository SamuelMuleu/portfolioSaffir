import { db } from "./firebaseConfig";
import { collection, addDoc, doc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";

// Tipos para melhor organização
type Jewel = {
  id: string;
  name: string;
  price: string;
  category: string;
  imageBase64: string;
  createdAt: Date;
};

// Função para upload de nova joia (já existente)
export const uploadJewelry = async (
  file: File, 
  name: string, 
  price: string,
  category: string
): Promise<Jewel> => {
  if (!file || !name || !price || !category) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const imageBase64 = await convertToBase64(file);

  const docRef = await addDoc(collection(db, "joias"), {
    name,
    price,
    category,
    imageBase64,
    createdAt: new Date(),
  });

  return { 
    id: docRef.id, 
    name, 
    price, 
    category, 
    imageBase64,
    createdAt: new Date() 
  };
};

// Função para deletar joia
export const deleteJewelry = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID da joia é obrigatório");
  
  try {
    await deleteDoc(doc(db, "joias", id));
  } catch (error) {
    console.error("Erro ao deletar joia:", error);
    throw new Error("Falha ao deletar joia");
  }
};

// Função para atualizar joia
export const updateJewelry = async (
  id: string,
  data: {
    name: string;
    price: string;
    category: string;
    image?: File;
  }
): Promise<Jewel> => {
  if (!id) throw new Error("ID da joia é obrigatório");
  if (!data.name || !data.price || !data.category) {
    throw new Error("Nome, preço e categoria são obrigatórios");
  }

  const jewelRef = doc(db, "joias", id);
  const updateData: Partial<Jewel> = {
    name: data.name,
    price: data.price,
    category: data.category,
  };

  // Se uma nova imagem foi fornecida, converte para Base64
  if (data.image) {
    updateData.imageBase64 = await convertToBase64(data.image);
  }

  try {
    await updateDoc(jewelRef, updateData);
    
    // Retorna os dados atualizados (nota: isso não inclui a imagem atualizada no retorno)
    return { 
      id,
      name: data.name,
      price: data.price,
      category: data.category,
      imageBase64: updateData.imageBase64 || '', // Será preenchido se houver nova imagem
      createdAt: new Date() // Nota: isso será sobrescrito - considere buscar o documento
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

// Função adicional para buscar todas as joias
export const getJewelries = async (): Promise<Jewel[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "joias"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      price: doc.data().price,
      category: doc.data().category,
      imageBase64: doc.data().imageBase64,
      createdAt: doc.data().createdAt.toDate(),
    }));
  } catch (error) {
    console.error("Erro ao buscar joias:", error);
    throw new Error("Falha ao buscar joias");
  }
};