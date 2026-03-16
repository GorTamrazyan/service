"use client";

import React from "react";
import { FaCalendarAlt, FaClock, FaVideo, FaArrowRight } from "react-icons/fa";
import { Consultation } from "../../lib/firebase/products/types";

interface ConsultationCardProps {
    consultation: Consultation;
    onBook: (consultation: Consultation) => void;
}

export default function ConsultationCard({ consultation, onBook }: ConsultationCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            <div className="p-6">

                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <FaCalendarAlt className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {consultation.title}
                            </h3>
                            <div className="flex items-center mt-1">
                                <FaClock className="w-3 h-3 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-500">
                                    {consultation.duration} minutes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3">
                    {consultation.description}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                        <FaVideo className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm">Online video consultation</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Real-time availability</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-3xl font-bold text-blue-600">
                            ${consultation.price}
                        </span>
                        <span className="text-gray-500 ml-2 text-sm">/session</span>
                    </div>
                    <button
                        onClick={() => onBook(consultation)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-5 rounded-lg transition-all duration-300 flex items-center group"
                    >
                        <span>Book Now</span>
                        <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Flexible scheduling</span>
                    <span>24/7 booking</span>
                    <span>Instant confirmation</span>
                </div>
            </div>
        </div>
    );
}