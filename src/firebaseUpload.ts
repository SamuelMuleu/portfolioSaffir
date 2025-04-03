import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


export const uploadJewelry = async (file: File, name: string,price:string): Promise<{id: string, name: string,price:string}> => {
  if (!file || !name || !price) throw new Error("Imagem e nome são obrigatórios");


  const imageBase64 = await convertToBase64(file);
  

  const docRef = await addDoc(collection(db, "joias"), {
    name,
    price,
    imageBase64,
    createdAt: new Date(),
  });

  return { id: docRef.id, name, price };
};


const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};