import React from "react";
import { Edit, Save, X } from "lucide-react";
import { UserProfile } from "../../../types/profile";
import { T } from "../../T";

interface PersonalInfoPanelProps {
    profile: UserProfile;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function PersonalInfoPanel({
    profile,
    isEditing,
    onInputChange,
    onEdit,
    onSave,
    onCancel,
}: PersonalInfoPanelProps) {
    // Используем T компонент для переводов
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        <T>Personal Information</T>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        <T>Manage your personal details and information</T>
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        <Edit className="w-4 h-4" />
                        <T>Edit</T>
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onSave}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <Save className="w-4 h-4" />
                            <T>Save</T>
                        </button>
                        <button
                            onClick={onCancel}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:from-slate-600 hover:to-slate-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <X className="w-4 h-4" />
                            <T>Cancel</T>
                        </button>
                    </div>
                )}
            </div>

            {/* Personal Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-8 py-6 border-b border-slate-200 dark:border-slate-600">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100"><T>Personal Information</T></h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1"><T>Manage your personal details and information</T></p>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            <T>Email</T>
                        </label>
                        <div className="relative">
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-mono">
                                {profile.email}
                            </div>
                            <div className="absolute right-3 top-3">
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-md">
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>First Name</T>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>Last Name</T>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            <T>Phone</T>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                !isEditing
                                    ? "bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed"
                                    : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400"
                            }`}
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>
            </div>

            {/* Address Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-8 py-6 border-b border-slate-200 dark:border-slate-600">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100"><T>Address Information</T></h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1"><T>Manage your personal details and information</T></p>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="address.street" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>Street</T>
                            </label>
                            <input
                                type="text"
                                id="address.street"
                                name="address.street"
                                value={profile.address.street}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter street name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.houseNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>House Number</T>
                            </label>
                            <input
                                type="text"
                                id="address.houseNumber"
                                name="address.houseNumber"
                                value={profile.address.houseNumber}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter house number"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.apartmentNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>Apartment Number</T>
                            </label>
                            <input
                                type="text"
                                id="address.apartmentNumber"
                                name="address.apartmentNumber"
                                value={profile.address.apartmentNumber}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Apt, suite, etc. (optional)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>City</T>
                            </label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={profile.address.city}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter city name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.zipCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <T>Zip Code</T>
                            </label>
                            <input
                                type="text"
                                id="address.zipCode"
                                name="address.zipCode"
                                value={profile.address.zipCode}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500"
                                }`}
                                placeholder="Enter ZIP code"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}