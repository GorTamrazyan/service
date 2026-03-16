import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Material } from "./types";

export const firestoreToMaterial = (doc: DocumentSnapshot<DocumentData>): Material | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

export const materialToFirestore = (material: Omit<Material, 'id'>): DocumentData => {
  return {
    name: material.name,
    description: material.description || null,
    createdAt: material.createdAt ? Timestamp.fromDate(material.createdAt) : Timestamp.now(),
    updatedAt: material.updatedAt ? Timestamp.fromDate(material.updatedAt) : Timestamp.now()
  };
};

export const getAllMaterials = async (): Promise<Material[]> => {
  try {
    const materialsRef = collection(db, 'materials');
    const q = query(materialsRef, orderBy('name', 'asc'));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToMaterial(doc))
      .filter((material): material is Material => material !== null);
  } catch (error) {
    console.error('Ошибка при получении материалов:', error);
    throw error;
  }
};

export const getMaterialById = async (id: string): Promise<Material | null> => {
  try {
    const materialRef = doc(db, 'materials', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(materialRef);
    return firestoreToMaterial(docSnap);
  } catch (error) {
    console.error('Ошибка при получении материала:', error);
    throw error;
  }
};

export const createMaterial = async (
  material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const materialData: Omit<Material, 'id'> = {
      ...material,
      createdAt: now,
      updatedAt: now
    };

    const materialsRef = collection(db, 'materials');
    const docRef = await addDoc(materialsRef, materialToFirestore(materialData));
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при создании материала:', error);
    throw error;
  }
};

export const updateMaterial = async (
  id: string,
  material: Partial<Omit<Material, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const materialRef = doc(db, 'materials', id);
    const updateData = {
      ...material,
      updatedAt: Timestamp.fromDate(new Date())
    };

    await updateDoc(materialRef, updateData);
  } catch (error) {
    console.error('Ошибка при обновлении материала:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const materialRef = doc(db, 'materials', id);
    await deleteDoc(materialRef);
  } catch (error) {
    console.error('Ошибка при удалении материала:', error);
    throw error;
  }
};
