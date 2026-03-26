import { IconType } from "@/types/icon";
import { T } from "./T";

interface ServiceCardProps {
    icon: IconType;
    title: string;
    description: string;
    features: string[];
    price: string;
    onOrder?: () => void;
}

export const ServiceCard = ({
    icon: Icon,
    title,
    description,
    features,
    price,
    onOrder,
}: ServiceCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-card-bg)] via-[var(--color-secondary)] to-[var(--color-gray-50)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent to-[var(--color-primary)]/10 rounded-bl-full" />

            <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white px-5 py-2.5 rounded-xl font-bold text-lg shadow-lg z-10">
                ${price}
                <div className="absolute -bottom-1 left-1/2 w-3 h-3 bg-[var(--color-primary)] transform -translate-x-1/2 rotate-45"></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6 flex flex-col flex-1 z-20">

                <div className="flex gap-4 items-start mb-5 pr-24">
                    <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gray-100)] to-white border border-[var(--color-border)] text-primary transition-all duration-300 group-hover:scale-110 group-hover:from-[var(--color-primary)]/10 group-hover:to-white group-hover:shadow-md flex-shrink-0">
                        <Icon className="w-6 h-6 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">
                            <T>{title}</T>
                        </h3>
                        <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                    </div>
                </div>

                <div className="mb-5 min-h-[60px]">
                    <p className="text-sm text-[var(--color-text)]/80 leading-relaxed line-clamp-3">
                        <T>{description}</T>
                    </p>
                </div>

                <div className="flex-1 mb-5">
                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 text-[var(--color-text)]/90 group/feature"
                            >
                                <div className="relative mt-0.5 flex-shrink-0">
                                    <div className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"></div>
                                </div>
                                <span className="text-sm leading-relaxed line-clamp-2 group-hover/feature:text-[var(--color-primary)] transition-colors duration-300">
                                    <T>{feature}</T>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-4">
                    <button
                        onClick={onOrder}
                        className="relative w-full px-5 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white rounded-xl hover:from-[var(--color-primary)]/90 hover:to-[var(--color-primary)] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 font-semibold text-base group/btn overflow-hidden"
                    >

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

                        <span className="relative flex items-center justify-center gap-2">
                            <T>Order Service</T>
                            <svg
                                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </span>
                    </button>

                    <p className="text-xs text-[var(--color-text)]/60 text-center mt-2">
                        <T>Click to get started today</T>
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--color-primary)]/30 transition-all duration-500 pointer-events-none"></div>
        </div>
    );
};
