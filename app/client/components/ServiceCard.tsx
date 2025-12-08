import { IconType } from "../../api/types/icon";
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
        <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6 flex flex-col flex-1">
                {/* Заголовок и иконка */}
                <div className="flex gap-6 items-start mb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-gray-200)] text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0">
                        <Icon className="w-10 h-10 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground">
                        <T>{title}</T>
                    </h3>
                </div>

                {/* Описание - фиксированная высота с обрезкой */}
                <div className="mb-4 min-h-[60px] flex items-start">
                    <p className="text-base text-gray-500 line-clamp-3">
                        <T>{description}</T>
                    </p>
                </div>

                {/* Особенности - гибкий контейнер */}
                <div className="flex-1 mb-4">
                    <ul className="space-y-2.5">
                        {features.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-[var(--color-text)]"
                            >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                <span className="text-sm leading-relaxed line-clamp-2">
                                    <T>{feature}</T>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Кнопка - всегда внизу */}
                <div className="mt-auto pt-4">
                    <button className="w-full px-6 py-3 bg-[var(--color-card-bg)] text-[var(--color-success)] border border-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-[var(--color-card-bg)] hover:cursor-pointer rounded-lg transition-colors duration-300 font-medium">
                        <T>Order a service</T>
                    </button>
                </div>
            </div>
        </div>
    );
};
