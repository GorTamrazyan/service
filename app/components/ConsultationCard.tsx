import { FaCheckCircle } from "react-icons/fa";
import { T } from "./T";

interface ConsultationCardProps {
    title: string;
    description: string;
    price: string;
    features: string[];
    popular?: boolean;
}

export const ConsultationCard = ({
    title,
    description,
    price,
    features,
    popular,
}: ConsultationCardProps) => {
    return (
        <div className="flex flex-col justify-between h-full overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 border border-border bg-[var(--color-card-bg)] shadow-card hover:shadow-card-hover">
            <div className="flex flex-col justify-between h-full p-6">
                <div>
                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                        <T>{title}</T>
                    </h3>
                    <p className="text-gray-500 mb-4">
                        <T>{description}</T>
                    </p>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-primary">
                            <T>{price}</T>
                        </span>
                    </div>

                    <ul className="space-y-3 mb-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                                <span className="text-sm text-card-foreground/80 leading-relaxed">
                                    <T>{feature}</T>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="mt-auto w-full px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-success)] border border-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-[var(--color-card-bg)] hover:cursor-pointer rounded-lg transition-colors duration-300 font-medium">
                    <T>Select a plan</T>
                </button>
            </div>
        </div>
    );
};
