import { FaCalendarAlt, FaClock, FaStar, FaVideo, FaShieldAlt } from "react-icons/fa";
import { T } from "./T";

interface ConsultationCardProps {
    title: string;
    description: string;
    price: number;
    features: string[];
    popular?: boolean;
    duration?: number;
    onBook?: () => void;
    icon?: React.ReactNode;
}

export const ConsultationCard = ({ title, description, price, features, popular = false, duration, onBook, icon }: ConsultationCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

            <div className="h-1 bg-[var(--color-accent)]" />

            {popular && (
                <div className="absolute top-3 right-4 z-10">
                    <span className="flex items-center gap-1.5 bg-[var(--color-accent)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                        <FaStar className="w-2.5 h-2.5" />
                        <T>Most Popular</T>
                    </span>
                </div>
            )}

            <div className="p-6 flex flex-col flex-1">

                {/* Title */}
                <div className="mb-4 pr-28">
                    <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)]">
                        <T>{title}</T>
                    </h3>
                </div>

                {/* Price + duration */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-3xl font-semibold text-[var(--color-primary)]">${price}</span>
                        <span className="text-sm text-[var(--color-gray-500)]"><T>/session</T></span>
                    </div>
                    {duration && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-gray-500)]">
                            <FaClock className="w-3.5 h-3.5" />
                            {duration} <T>min</T>
                        </div>
                    )}
                </div>

                <p className="text-sm text-[var(--color-gray-500)] leading-relaxed line-clamp-3 mb-5">
                    <T>{description}</T>
                </p>

                <ul className="flex-1 space-y-2 mb-6">
                    {features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-text)]/80 leading-relaxed">
                                <T>{feature}</T>
                            </span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={onBook}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-semibold mb-3"
                >
                    <FaCalendarAlt className="w-4 h-4" />
                    <T>Book Consultation</T>
                </button>

                <div className="flex items-center justify-center gap-3 text-xs text-[var(--color-gray-500)]">
                    <span className="flex items-center gap-1"><FaVideo className="w-3 h-3" /> <T>Video Call</T></span>
                    <span className="h-3 w-px bg-[var(--color-border)]" />
                    <span className="flex items-center gap-1"><FaShieldAlt className="w-3 h-3" /> <T>Secure</T></span>
                    <span className="h-3 w-px bg-[var(--color-border)]" />
                    <T>Instant Confirm</T>
                </div>
            </div>
        </div>
    );
};
