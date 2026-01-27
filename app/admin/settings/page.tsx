// app/admin/before-after/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Upload,
    X,
    MoveUp,
    MoveDown,
} from "lucide-react";
import { T } from "../../client/components/T";
import Image from "next/image";

interface BeforeAfterProject {
    id?: string;
    beforeImage: string;
    afterImage: string;
    description: string;
    location: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function AdminBeforeAfterPage() {
    const [projects, setProjects] = useState<BeforeAfterProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProject, setEditingProject] =
        useState<BeforeAfterProject | null>(null);

    // Form states
    const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
    const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
    const [beforeImagePreview, setBeforeImagePreview] = useState<string>("");
    const [afterImagePreview, setAfterImagePreview] = useState<string>("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/before-after");
            if (!response.ok) throw new Error("Failed to load projects");
            const data = await response.json();
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBeforeImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setBeforeImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBeforeImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAfterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAfterImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAfterImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!beforeImageFile || !afterImageFile) {
            alert("Please select both before and after images");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("beforeImage", beforeImageFile);
            formData.append("afterImage", afterImageFile);
            formData.append("description", description);
            formData.append("location", location);
            formData.append("order", projects.length.toString());
            formData.append("isActive", isActive.toString());

            const response = await fetch("/api/before-after", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create project");

            await loadProjects();
            resetForm();
            setShowAddForm(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingProject?.id) return;

        try {
            setIsLoading(true);
            const formData = new FormData();

            if (beforeImageFile) {
                formData.append("beforeImage", beforeImageFile);
            }
            if (afterImageFile) {
                formData.append("afterImage", afterImageFile);
            }

            formData.append("description", description);
            formData.append("location", location);
            formData.append("isActive", isActive.toString());

            const response = await fetch(
                `/api/before-after?id=${editingProject.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to update project");

            await loadProjects();
            resetForm();
            setShowEditForm(false);
            setEditingProject(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            setIsLoading(true);
            const response = await fetch(`/api/before-after?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete project");

            await loadProjects();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (project: BeforeAfterProject) => {
        if (!project.id) return;

        try {
            const formData = new FormData();
            formData.append("isActive", (!project.isActive).toString());

            const response = await fetch(`/api/before-after?id=${project.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to toggle active status");

            await loadProjects();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setBeforeImageFile(null);
        setAfterImageFile(null);
        setBeforeImagePreview("");
        setAfterImagePreview("");
        setDescription("");
        setLocation("");
        setIsActive(true);
    };

    const openEditForm = (project: BeforeAfterProject) => {
        setEditingProject(project);
        setDescription(project.description);
        setLocation(project.location);
        setIsActive(project.isActive);
        setBeforeImagePreview(project.beforeImage);
        setAfterImagePreview(project.afterImage);
        setShowEditForm(true);
    };

    if (isLoading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        <T>Before & After Projects</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70 mt-1">
                        <T>Manage transformation showcase images</T>
                    </p>
                </div>

                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    <T>Add Project</T>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden"
                    >
                        {/* Before & After Images */}
                        <div className="grid grid-cols-2 gap-2 p-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={project.beforeImage}
                                    alt="Before"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded">
                                    BEFORE
                                </div>
                            </div>
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={project.afterImage}
                                    alt="After"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-[var(--color-accent)] text-[var(--color-primary)] text-xs px-2 py-1 rounded">
                                    AFTER
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="p-4 border-t border-[var(--color-text)]/10">
                            <p className="text-[var(--color-text)] font-medium mb-2 line-clamp-2">
                                {project.description}
                            </p>
                            <p className="text-[var(--color-text)]/60 text-sm mb-3">
                                📍 {project.location}
                            </p>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                {project.isActive ? (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        <Eye className="w-3 h-3" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                        <EyeOff className="w-3 h-3" />
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleActive(project)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    {project.isActive ? (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            Hide
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            Show
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => openEditForm(project)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        project.id &&
                                        handleDeleteProject(project.id)
                                    }
                                    className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Form Modal */}
            {(showAddForm || showEditForm) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                    {showEditForm ? (
                                        <T>Edit Project</T>
                                    ) : (
                                        <T>Add New Project</T>
                                    )}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setShowEditForm(false);
                                        setEditingProject(null);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form
                            onSubmit={
                                showEditForm
                                    ? handleEditProject
                                    : handleAddProject
                            }
                            className="p-6 space-y-6"
                        >
                            {/* Before Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <T>Before Image</T> *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                    {beforeImagePreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                                            <Image
                                                src={beforeImagePreview}
                                                alt="Before Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBeforeImageChange}
                                        className="w-full text-sm"
                                        required={!showEditForm}
                                    />
                                </div>
                            </div>

                            {/* After Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <T>After Image</T> *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                    {afterImagePreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                                            <Image
                                                src={afterImagePreview}
                                                alt="After Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAfterImageChange}
                                        className="w-full text-sm"
                                        required={!showEditForm}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <T>Description</T> *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                    rows={3}
                                    placeholder="Old wooden fence replaced with modern vinyl fencing"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <T>Location</T> *
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                    placeholder="Residential, Seattle"
                                    required
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(e.target.checked)
                                    }
                                    className="w-5 h-5 text-[var(--color-accent)] rounded focus:ring-[var(--color-accent)]"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    <T>Show on website</T>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <T>Saving...</T>
                                    ) : showEditForm ? (
                                        <T>Update Project</T>
                                    ) : (
                                        <T>Create Project</T>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setShowEditForm(false);
                                        setEditingProject(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <T>Cancel</T>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
