"use client";

import React, { useState, useEffect } from "react";
import AdminProtection from "../components/AdminProtection";
import { Service, Consultation } from "../../lib/firebase/products/types";
import ServiceModal from "../components/modals/ServiceModal";
import ConsultationModal from "../components/modals/ConsultationModal";
import EditServiceModal from "../components/modals/EditServiceModal";
import EditConsultationModal from "../components/modals/EditConsultationModal";
import { FaPlus, FaWrench, FaMoneyBillWave } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

const fetchApiData = async <T,>(endpoint: string): Promise<T[]> => {
    const response = await fetch(endpoint);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.message || `Error loading data from ${endpoint}`
        );
    }
    return response.json();
};

const deleteService = async (serviceId: string): Promise<void> => {
    const response = await fetch(`/api/service?id=${serviceId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete service");
    }
};

const deleteConsultation = async (consultationId: string): Promise<void> => {
    const response = await fetch(`/api/consultations?id=${consultationId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete consultation");
    }
};

const updateService = async (
    serviceId: string,
    serviceData: Partial<Service>
): Promise<void> => {
    const response = await fetch(`/api/service?id=${serviceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update service");
    }
};

const updateConsultation = async (
    consultationId: string,
    consultationData: Partial<Consultation>
): Promise<void> => {
    const response = await fetch(`/api/consultations?id=${consultationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update consultation");
    }
};

export default function AdminCombinedServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] =
        useState(false);

    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
    const [showEditServiceForm, setShowEditServiceForm] = useState(false);
    const [showEditConsultationForm, setShowEditConsultationForm] =
        useState(false);
    const [editService, setEditService] = useState({
        icon: "",
        title: "",
        description: "",
        features: [] as string[],
        price: "",
    });
    const [editConsultation, setEditConsultation] = useState({
        title: "",
        description: "",
        features: "",
        duration: 0, 
        price: 0,
    });

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [serviceData, consultationData] = await Promise.all([
                fetchApiData<Service>("/api/service"),
                fetchApiData<Consultation>("/api/consultations"),
            ]);
            setServices(serviceData);
            setConsultations(consultationData);
        } catch (err: any) {
            console.error("Failed to fetch data:", err);
            setError(err.message || "Failed to load all data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleServiceAdded = () => {
        setIsServiceModalOpen(false);
        fetchAllData();
    };

    const handleDeleteService = async (serviceId: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteService(serviceId);
                fetchAllData(); 
            } catch (error) {
                console.error("Error deleting service:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete service"
                );
            }
        }
    };
    const handleDeleteConsultation = async (consultationId: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteConsultation(consultationId);
                fetchAllData(); 
            } catch (error) {
                console.error("Error deleting service:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete service"
                );
            }
        }
    };

    const handleEditService = (service: Service) => {
        console.log("Editing service:", service); 
        setEditingService(service);
        setEditService({
            icon: service.icon || "",
            title: service.title || "",
            description: service.description || "",
            features: Array.isArray(service.features)
                ? service.features
                : service.features ? [service.features] : [""],
            price: service.price || "",
        });
        setShowEditServiceForm(true);
        setError("");
    };

     const handleEditConsultation = (consultation: Consultation) => {
         console.log("Editing service:", consultation); 
         setEditingConsultation(consultation);
         setEditConsultation({
             title: consultation.title || "",
             description: consultation.description || "",
             features: Array.isArray(consultation.features)
                 ? consultation.features.join(", ")
                 : consultation.features || "",
             price: consultation.price,
             duration: consultation.duration,
         });
         setShowEditConsultationForm(true);
         setError("");
     };

    const handleUpdateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        try {
            await updateService(editingService.id!, {
                ...editService,
                features: editService.features.filter((f) => f.trim().length > 0),
            });

            setShowEditServiceForm(false);
            setEditingService(null);
            fetchAllData(); 
        } catch (error) {
            console.error("Error updating service:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update service"
            );
        }
    };

    const handleEditConsultationChange = (field: string, value: string) => {
        console.log(`Changing ${field} to:`, value); 
        setEditConsultation((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdateConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingConsultation) return;

        try {
            await updateConsultation(editingConsultation.id!, {
                ...editConsultation,
                features: editConsultation.features
                    .split(",")
                    .map((feature) => feature.trim()),
            });

            setShowEditConsultationForm(false);
            setEditingConsultation(null);
            fetchAllData(); 
        } catch (error) {
            console.error("Error updating consultation:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update consultation"
            );
        }
    };

    const handleConsultationAdded = () => {
        setIsConsultationModalOpen(false);
        fetchAllData();
    };

    const handleEditServiceChange = (field: string, value: string) => {
        setEditService((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditServiceFeaturesChange = (features: string[]) => {
        setEditService((prev) => ({ ...prev, features }));
    };

    const handleCloseServiceEditModal = () => {
        setShowEditServiceForm(false);
        setEditingService(null);
        setError("");
    };

    const handleCloseConsultationEditModal = () => {
        setShowEditConsultationForm(false);
        setEditingConsultation(null);
        setError("");
    };

    const ServiceTable = () => (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-primary)] flex items-center">
                    <FaWrench className="mr-2 text-[var(--color-info)]" />
                    List of Services
                </h2>
                <button
                    onClick={() => setIsServiceModalOpen(true)}
                    className="flex items-center text-white bg-[var(--color-info)] hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition duration-300"
                >
                    <FaPlus className="mr-2" />
                    Add Service
                </button>
            </div>
            <div className="bg-[var(--color-card-bg)]  shadow rounded-lg overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-border)]">
                <table className="min-w-full divide-y divide-[var(--color-border)] ">
                    <thead className="bg-[var(--color-gray-50)] ">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Icon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Features
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
                        {services.map((service) => (
                            <tr
                                key={service.id}
                                className="hover:bg-[var(--color-gray-50)] dark:hover:bg-gray-700 transition duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                    {service.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-success)]">
                                    {service.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gray-500)]">
                                    {service.icon}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--color-gray-500)]">
                                    {service.features
                                        .join(", ")
                                        .substring(0, 50)}
                                    {service.features.join(", ").length > 50
                                        ? "..."
                                        : ""}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEditService(service)
                                            }
                                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 transition-colors"
                                            title="Edit service"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteService(
                                                    service.id!,
                                                    service.title
                                                )
                                            }
                                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                                            title="Delete service"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const ConsultationTable = () => (
        <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-primary)] flex items-center">
                    <FaMoneyBillWave className="mr-2 text-[var(--color-success)]" />
                    List of Consultation Tariffs
                </h2>
                <button
                    onClick={() => setIsConsultationModalOpen(true)}
                    className="flex items-center text-white bg-[var(--color-success)] hover:bg-green-700 font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition duration-300"
                >
                    <FaPlus className="mr-2" />
                    Add Tariff
                </button>
            </div>
            <div className="bg-[var(--color-card-bg)]  shadow rounded-lg overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-border)]">
                <table className="min-w-full divide-y divide-[var(--color-border)] ">
                    <thead className="bg-[var(--color-gray-50)] ">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Features
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
                        {consultations.map((consultation) => (
                            <tr
                                key={consultation.id}
                                className="hover:bg-[var(--color-gray-50)] dark:hover:bg-gray-700 transition duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                    {consultation.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-success)]">
                                    {consultation.price}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--color-gray-500)]">
                                    {consultation.features
                                        .join(", ")
                                        .substring(0, 50)}
                                    {consultation.features.join(", ").length >
                                    50
                                        ? "..."
                                        : ""}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEditConsultation(
                                                    consultation
                                                )
                                            }
                                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 transition-colors"
                                            title="Edit service"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteConsultation(
                                                    consultation.id!,
                                                    consultation.title
                                                )
                                            }
                                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                                            title="Delete service"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <AdminProtection>
            <div className="p-6 bg-[var(--color-background)] dark:bg-[var(--color-background)] min-h-screen">
                <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">
                    Service and Consultation Management
                </h1>

                {isLoading && (
                    <p className="text-center text-[var(--color-info)]">
                        Loading data...
                    </p>
                )}
                {error && (
                    <p className="text-center text-[var(--color-error)]">
                        Error: {error}
                    </p>
                )}

                {!isLoading && !error && (
                    <>
                        <ServiceTable />
                        <ConsultationTable />
                    </>
                )}
            </div>

            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                onSuccess={handleServiceAdded}
            />
            <ConsultationModal
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
                onSuccess={handleConsultationAdded}
            />

            <EditServiceModal
                isOpen={showEditServiceForm}
                editingService={editingService}
                editService={editService}
                error={error}
                onUpdateService={handleUpdateService}
                onClose={handleCloseServiceEditModal}
                onEditServiceChange={handleEditServiceChange}
                onFeaturesChange={handleEditServiceFeaturesChange}
            />
            <EditConsultationModal
                isOpen={showEditConsultationForm}
                editingConsultation={editingConsultation}
                editConsultation={editConsultation}
                error={error}
                onUpdateConsultation={handleUpdateConsultation}
                onClose={handleCloseConsultationEditModal}
                onEditConsultationChange={handleEditConsultationChange}
            />
        </AdminProtection>
    );
}
