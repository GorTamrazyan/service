import { IconType } from "react-icons";
import { T } from "./T";


interface ServiceCardProps {
    icon: IconType;
    title: string;
    description: string;
    features: string[];
}

export const ServiceCard = ({
    icon: Icon,
    title,
    description,
    features,
}: ServiceCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
                <div className="flex gap-6 items-center">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl  bg-[var(--color-gray-200)] text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="w-10 h-10 text-[var(--color-primary)] " />
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">
                        <T>{title}</T>
                    </h3>
                </div>
                <p className="text-base text-gray-500 mb-6">
                    <T>{description}</T>
                </p>
                <ul className="space-y-2.5 mb-6">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-[var(--color-text)]"
                        >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                            <span className="text-sm leading-relaxed">
                                <T>{feature}</T>
                            </span>
                        </li>
                    ))}
                </ul>
                <button className="w-full px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-success)] border border-[var(--color-success)] hover:bg-[var(--color-success)]  hover:text-[var(--color-card-bg)] hover:cursor-pointer rounded-lg transition-colors duration-300 font-medium">
                    <T>Order a service</T>
                </button>
            </div>
        </div>
    );
};
