// components/profile/ProfileContent.tsx
import React from "react";
import { Edit, Save, X } from "lucide-react";
import { ProfileContentProps } from "../../types/profile";

export default function ProfileContent({
    profile,
    activeSection,
    isEditing,
    onInputChange,
    onEdit,
    onSave,
    onCancel,
}: ProfileContentProps) {
    // Секция Personal Info
    const renderPersonalInfo = () => (
        <div>
            {/* Заголовок с кнопками */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#1F2937]">
                        Personal Info
                    </h2>
                    <p className="text-gray-600">
                        Update your personal information
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={onEdit}
                        className="bg-[#D6AD60] text-[#1F2937] py-2 px-6 rounded-md font-medium hover:bg-[#d20f0f] hover:text-white transition-colors duration-200 flex items-center"
                    >
                        <Edit className="mr-2 w-4 h-4" /> Edit
                    </button>
                ) : (
                    <div className="flex space-x-3">
                        <button
                            onClick={onSave}
                            className="bg-[#d20f0f] text-white py-2 px-6 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 flex items-center"
                        >
                            <Save className="mr-2 w-4 h-4" /> Save
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-gray-400 text-white py-2 px-6 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200 flex items-center"
                        >
                            <X className="mr-2 w-4 h-4" /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Форма */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email (только для чтения) */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-[#1F2937] mb-2">
                            Email
                        </label>
                        <div className="p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                            {profile.email}
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profile.firstName}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profile.lastName}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-span-full">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>
                </div>

                {/* Адрес доставки */}
                <h3 className="text-lg font-bold text-[#1F2937] mt-8 mb-4">
                    Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street */}
                    <div>
                        <label
                            htmlFor="address.street"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            Street
                        </label>
                        <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={profile.address.street}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* House Number */}
                    <div>
                        <label
                            htmlFor="address.houseNumber"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            House Number
                        </label>
                        <input
                            type="text"
                            id="address.houseNumber"
                            name="address.houseNumber"
                            value={profile.address.houseNumber}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* Apartment Number */}
                    <div>
                        <label
                            htmlFor="address.apartmentNumber"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            Apartment Number
                        </label>
                        <input
                            type="text"
                            id="address.apartmentNumber"
                            name="address.apartmentNumber"
                            value={profile.address.apartmentNumber}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label
                            htmlFor="address.city"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            City
                        </label>
                        <input
                            type="text"
                            id="address.city"
                            name="address.city"
                            value={profile.address.city}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>

                    {/* ZIP Code */}
                    <div>
                        <label
                            htmlFor="address.zipCode"
                            className="block text-sm font-medium text-[#1F2937] mb-2"
                        >
                            ZIP Code
                        </label>
                        <input
                            type="text"
                            id="address.zipCode"
                            name="address.zipCode"
                            value={profile.address.zipCode}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d20f0f] focus:border-[#d20f0f] transition-colors ${
                                !isEditing
                                    ? "bg-gray-50 text-gray-600"
                                    : "bg-white text-[#1F2937]"
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Секция Orders
    const renderOrders = () => (
        <div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Orders</h2>
            <p className="text-gray-600 mb-8">View your order history</p>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <p className="text-center text-gray-500">No orders yet</p>
            </div>
        </div>
    );

    // Секция Settings
    const renderSettings = () => (
        <div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Settings</h2>
            <p className="text-gray-600 mb-8">Change your account settings</p>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <p className="text-center text-gray-500">
                    Settings coming soon
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl">
            {activeSection === "personalInfo" && renderPersonalInfo()}
            {activeSection === "orders" && renderOrders()}
            {activeSection === "settings" && renderSettings()}
        </div>
    );
}
