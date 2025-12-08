// app/lib/firebase/service.ts

import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    DocumentData,
    Timestamp,
    QuerySnapshot,
} from "firebase/firestore";

import { Service, Consultation } from "./products/types";

/**
 * @param {QuerySnapshot<DocumentData>} snapshot Firestore query snapshot.
 * @returns {T[]} Array of objects cast to type T.
 */
const querySnapshotToItems = <
    T extends { createdAt: Date; updatedAt: Date; id: string }
>(
    snapshot: QuerySnapshot<DocumentData>
): T[] => {
    return snapshot.docs.map((doc) => {
        const data = doc.data();

        const item = {
            id: doc.id,
            ...data,
            // Convert Timestamp to Date
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };

        return item as unknown as T;
    });
};

// --- CRUD FUNCTIONS FOR SERVICE ---

// Convert Service object for Firestore
const serviceToFirestore = (service: Omit<Service, "id">): DocumentData => {
    return {
        icon: service.icon,
        title: service.title,
        description: service.description,
        features: service.features,
        price: service.price,
        createdAt: Timestamp.fromDate(service.createdAt),
        updatedAt: Timestamp.fromDate(service.updatedAt),
    };
};

/**
 * Get all services.
 */
export const getAllServices = async (): Promise<Service[]> => {
    try {
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, orderBy("title", "asc"));
        const querySnapshot = await getDocs(q);

        return querySnapshotToItems<Service>(querySnapshot);
    } catch (error) {
        console.error("Error while receiving services:", error);
        throw error;
    }
};

/**
 * Create a new service.
 */
export const createService = async (
    service: Omit<Service, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    try {
        const now = new Date();
        const serviceData: Omit<Service, "id"> = {
            ...service,
            createdAt: now,
            updatedAt: now,
        };

        const servicesRef = collection(db, "services");
        const docRef = await addDoc(
            servicesRef,
            serviceToFirestore(serviceData)
        );
        return docRef.id;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

/**
 * Update an existing service.
 */
export const updateService = async (
    serviceId: string,
    serviceData: Partial<Omit<Service, "id" | "createdAt">>
): Promise<void> => {
    try {
        const serviceRef = doc(db, "services", serviceId);

        const updateData = {
            ...serviceData,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        await updateDoc(serviceRef, updateData);
    } catch (error) {
        console.error("Error updating service:", error);
        throw error;
    }
};

/**
 * Delete a service.
 */
export const deleteService = async (serviceId: string): Promise<void> => {
    try {
        const serviceRef = doc(db, "services", serviceId);
        await deleteDoc(serviceRef);
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};

// --- CRUD FUNCTIONS FOR CONSULTATION ---

// Convert Consultation object for Firestore
const consultationToFirestore = (
    consultation: Omit<Consultation, "id">
): DocumentData => {
    return {
        title: consultation.title,
        description: consultation.description,
        price: consultation.price,
        features: consultation.features,
        createdAt: Timestamp.fromDate(consultation.createdAt),
        updatedAt: Timestamp.fromDate(consultation.updatedAt),
    };
};

/**
 * Get all consultations.
 */
export const getAllConsultations = async (): Promise<Consultation[]> => {
    try {
        const consultationsRef = collection(db, "consultations");
        const q = query(consultationsRef, orderBy("title", "asc"));
        const querySnapshot = await getDocs(q);

        return querySnapshotToItems<Consultation>(querySnapshot);
    } catch (error) {
        console.error("Error while receiving consultations:", error);
        throw error;
    }
};

/**
 * Create a new consultation.
 */
export const createConsultation = async (
    consultation: Omit<Consultation, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    try {
        const now = new Date();
        const consultationData: Omit<Consultation, "id"> = {
            ...consultation,
            createdAt: now,
            updatedAt: now,
        };

        const consultationsRef = collection(db, "consultations");
        const docRef = await addDoc(
            consultationsRef,
            consultationToFirestore(consultationData)
        );
        return docRef.id;
    } catch (error) {
        console.error("Error creating consultation:", error);
        throw error;
    }
};

/**
 * Update an existing consultation.
 */
export const updateConsultation = async (
    consultationId: string,
    consultationData: Partial<Omit<Consultation, "id" | "createdAt">>
): Promise<void> => {
    try {
        const consultationRef = doc(db, "consultations", consultationId);

        const updateData = {
            ...consultationData,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        await updateDoc(consultationRef, updateData);
    } catch (error) {
        console.error("Error updating consultation:", error);
        throw error;
    }
};

/**
 * Delete a consultation.
 */
export const deleteConsultation = async (
    consultationId: string
): Promise<void> => {
    try {
        const consultationRef = doc(db, "consultations", consultationId);
        await deleteDoc(consultationRef);
    } catch (error) {
        console.error("Error deleting consultation:", error);
        throw error;
    }
};

/**
 * Get service by ID
 */
export const getServiceById = async (
    serviceId: string
): Promise<Service | null> => {
    try {
        const services = await getAllServices();
        return services.find((service) => service.id === serviceId) || null;
    } catch (error) {
        console.error("Error getting service by ID:", error);
        throw error;
    }
};

/**
 * Get consultation by ID
 */
export const getConsultationById = async (
    consultationId: string
): Promise<Consultation | null> => {
    try {
        const consultations = await getAllConsultations();
        return (
            consultations.find(
                (consultation) => consultation.id === consultationId
            ) || null
        );
    } catch (error) {
        console.error("Error getting consultation by ID:", error);
        throw error;
    }
};
