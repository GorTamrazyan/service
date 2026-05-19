import { ArrowRight } from "lucide-react";
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

export const ServiceCard = ({ icon: Icon, title, description, features, price, onOrder }: ServiceCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

            <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full font-semibold text-sm z-10">
                ${price}
            </div>

            <div className="p-6 flex flex-col flex-1">

                <div className="flex gap-4 items-start mb-5 pr-24">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)] mt-2">
                        <T>{title}</T>
                    </h3>
                </div>

                <p className="text-sm text-[var(--color-gray-500)] leading-relaxed line-clamp-3 mb-5">
                    <T>{description}</T>
                </p>

                <ul className="flex-1 space-y-2 mb-6">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-text)]/80 leading-relaxed">
                                <T>{feature}</T>
                            </span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={onOrder}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-semibold"
                >
                    <T>Order Service</T>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
