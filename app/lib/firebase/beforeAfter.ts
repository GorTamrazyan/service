// lib/firebase/beforeAfter.ts
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
    Timestamp,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { v2 as cloudinary } from "cloudinary";

// Конфигурация Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Интерфейс для Before/After проекта
export interface BeforeAfterProject {
    id?: string;
    beforeImage: string; // URL изображения "До"
    afterImage: string; // URL изображения "После"
    description: string; // Описание проекта
    location: string; // Локация проекта
    order: number; // Порядок отображения
    isActive: boolean; // Активен ли проект
    createdAt: Date;
    updatedAt: Date;
}

// Преобразование Firestore документа в BeforeAfterProject
const firestoreToProject = (
    doc: DocumentSnapshot<DocumentData>
): BeforeAfterProject | null => {
    if (!doc.exists()) return null;

    const data = doc.data();
    return {
        id: doc.id,
        beforeImage: data.beforeImage,
        afterImage: data.afterImage,
        description: data.description,
        location: data.location,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

// Преобразование BeforeAfterProject в формат для Firestore
const projectToFirestore = (
    project: Omit<BeforeAfterProject, "id">
): DocumentData => {
    return {
        beforeImage: project.beforeImage,
        afterImage: project.afterImage,
        description: project.description,
        location: project.location,
        order: project.order,
        isActive: project.isActive,
        createdAt: Timestamp.fromDate(project.createdAt),
        updatedAt: Timestamp.fromDate(project.updatedAt),
    };
};

/**
 * Загрузить изображение в Cloudinary
 */
export const uploadProjectImage = async (
    file: File,
    type: "before" | "after"
): Promise<string> => {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;

        return new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload(
                dataURI,
                {
                    folder: "before-after",
                    resource_type: "image",
                    public_id: `${type}_${Date.now()}`,
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result!.secure_url);
                    }
                }
            );
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

/**
 * Удалить изображение из Cloudinary
 */
export const deleteProjectImage = async (imageUrl: string): Promise<void> => {
    try {
        // Извлекаем public_id из URL Cloudinary
        const urlParts = imageUrl.split("/");
        const folderAndFile = urlParts.slice(-2).join("/"); // before-after/filename
        const publicId = folderAndFile.replace(/\.[^/.]+$/, ""); // убираем расширение

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image:", error);
        // Не бросаем ошибку, так как файл может уже не существовать
    }
};

/**
 * Получить все Before/After проекты
 */
export const getAllProjects = async (): Promise<BeforeAfterProject[]> => {
    try {
        const projectsRef = collection(db, "beforeAfterProjects");
        const q = query(projectsRef, orderBy("order", "asc"));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        return querySnapshot.docs
            .map((doc) => firestoreToProject(doc))
            .filter(
                (project): project is BeforeAfterProject => project !== null
            );
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

/**
 * Получить только активные проекты
 */
export const getActiveProjects = async (): Promise<BeforeAfterProject[]> => {
    try {
        const allProjects = await getAllProjects();
        return allProjects.filter((project) => project.isActive);
    } catch (error) {
        console.error("Error fetching active projects:", error);
        throw error;
    }
};

/**
 * Получить проект по ID
 */
export const getProjectById = async (
    id: string
): Promise<BeforeAfterProject | null> => {
    try {
        const projectRef = doc(db, "beforeAfterProjects", id);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(
            projectRef
        );
        return firestoreToProject(docSnap);
    } catch (error) {
        console.error("Error fetching project:", error);
        throw error;
    }
};

/**
 * Создать новый Before/After проект
 */
export const createProject = async (
    project: Omit<BeforeAfterProject, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    try {
        const now = new Date();
        const projectData: Omit<BeforeAfterProject, "id"> = {
            ...project,
            createdAt: now,
            updatedAt: now,
        };

        const projectsRef = collection(db, "beforeAfterProjects");
        const docRef = await addDoc(
            projectsRef,
            projectToFirestore(projectData)
        );

        return docRef.id;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

/**
 * Обновить существующий проект
 */
export const updateProject = async (
    id: string,
    updates: Partial<Omit<BeforeAfterProject, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
    try {
        const projectRef = doc(db, "beforeAfterProjects", id);
        const updateData = {
            ...updates,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        await updateDoc(projectRef, updateData);
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

/**
 * Удалить проект
 */
export const deleteProject = async (id: string): Promise<void> => {
    try {
        // Получаем проект чтобы удалить изображения
        const project = await getProjectById(id);

        if (project) {
            // Удаляем изображения из Storage
            if (project.beforeImage) {
                await deleteProjectImage(project.beforeImage);
            }
            if (project.afterImage) {
                await deleteProjectImage(project.afterImage);
            }
        }

        // Удаляем документ из Firestore
        const projectRef = doc(db, "beforeAfterProjects", id);
        await deleteDoc(projectRef);
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};

/**
 * Изменить порядок проектов
 */
export const reorderProjects = async (projectIds: string[]): Promise<void> => {
    try {
        const updates = projectIds.map((id, index) =>
            updateProject(id, { order: index })
        );
        await Promise.all(updates);
    } catch (error) {
        console.error("Error reordering projects:", error);
        throw error;
    }
};
