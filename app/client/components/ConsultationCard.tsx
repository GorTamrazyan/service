import {
    FaCheckCircle,
    FaCalendarAlt,
    FaClock,
    FaVideo,
    FaStar,
    FaShieldAlt,
} from "react-icons/fa";
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

export const ConsultationCard = ({
    title,
    description,
    price,
    features,
    popular = false,
    duration,
    onBook,
    icon,
}: ConsultationCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-card-bg)] to-[var(--color-gray-50)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
            {/* Badge для популярной консультации */}
            {popular && (
                <div className="absolute -top-3 right-6 z-10">
                    <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-[var(--color-primary)] px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
                        <FaStar className="w-3 h-3" />
                        <T>Most Popular</T>
                    </div>
                </div>
            )}

            {/* Градиентная полоска сверху */}
            <div className="h-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"></div>

            {/* Контент */}
            <div className="relative p-6 flex flex-col flex-1 z-20">
                {/* Заголовок */}
                <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">
                                <T>{title}</T>
                            </h3>
                            <div className="h-1 w-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                        </div>
                        {icon && (
                            <div className="text-[var(--color-primary)] ml-3">
                                {icon}
                            </div>
                        )}
                    </div>
                </div>

                {/* Цена и длительность */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-[var(--color-primary)]">
                                {price}
                            </span>
                            <span className="text-sm text-[var(--color-text)]/60 ml-2">
                                /session
                            </span>
                        </div>
                        {duration && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                                <FaClock className="w-4 h-4 text-[var(--color-primary)]" />
                                <span className="text-sm font-medium text-[var(--color-primary)]">
                                    {duration} min
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Описание */}
                <p className="text-[var(--color-text)]/80 text-sm mb-5 leading-relaxed line-clamp-3">
                    <T>{description}</T>
                </p>

                {/* Особенности */}
                <div className="flex-1 mb-5">
                    <ul className="space-y-2">
                        {features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"></div>
                                </div>
                                <span className="text-sm text-[var(--color-text)]/90 leading-relaxed">
                                    <T>{feature}</T>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Кнопка бронирования */}
                <div className="mt-auto pt-4">
                    <button
                        onClick={onBook}
                        className="relative w-full px-5 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white rounded-xl hover:from-[var(--color-primary)]/90 hover:to-[var(--color-primary)] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 font-semibold text-base group/btn overflow-hidden"
                    >
                        {/* Эффект свечения */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

                        {/* Текст кнопки */}
                        <span className="relative flex items-center justify-center gap-3">
                            <FaCalendarAlt className="w-5 h-5" />
                            <T>Book Consultation</T>
                        </span>
                    </button>

                    {/* Дополнительная информация */}
                    <div className="flex items-center justify-center gap-3 mt-3 text-xs text-[var(--color-text)]/60">
                        <div className="flex items-center gap-1.5">
                            <FaVideo className="w-3 h-3" />
                            <span>
                                <T>Video Call</T>
                            </span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[var(--color-text)]/20"></div>
                        <div className="flex items-center gap-1.5">
                            <FaShieldAlt className="w-3 h-3" />
                            <span>
                                <T>Secure</T>
                            </span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[var(--color-text)]/20"></div>
                        <span>
                            <T>Instant Confirm</T>
                        </span>
                    </div>
                </div>
            </div>

            {/* Эффект при наведении */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--color-primary)]/30 transition-all duration-500 pointer-events-none"></div>
        </div>
    );
};
