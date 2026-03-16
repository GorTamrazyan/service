export interface Service {
    id: string;
    name: string;
    nameRu: string;
    nameAm: string;
    price: number;
    description: string;
    descriptionRu: string;
    descriptionAm: string;
    serviceType: 'delivery' | 'installation' | 'assembly' | 'other';
    icon?: string;
}

export const availableServices: Service[] = [
    {
        id: 'delivery-standard',
        name: 'Standard Delivery',
        nameRu: 'Стандартная доставка',
        nameAm: 'Ստանդարտ առաքում',
        price: 50,
        description: 'Delivery within 3-5 business days',
        descriptionRu: 'Доставка в течение 3-5 рабочих дней',
        descriptionAm: 'Առաքում 3-5 աշխատանքային օրվա ընթացքում',
        serviceType: 'delivery',
        icon: '🚚',
    },
    {
        id: 'delivery-express',
        name: 'Express Delivery',
        nameRu: 'Экспресс доставка',
        nameAm: 'Արագ առաքում',
        price: 100,
        description: 'Delivery within 1-2 business days',
        descriptionRu: 'Доставка в течение 1-2 рабочих дней',
        descriptionAm: 'Առաքում 1-2 աշխատանքային օրվա ընթացքում',
        serviceType: 'delivery',
        icon: '⚡',
    },
    {
        id: 'installation-basic',
        name: 'Basic Installation',
        nameRu: 'Базовая установка',
        nameAm: 'Հիմնական տեղակայում',
        price: 75,
        description: 'Professional installation service',
        descriptionRu: 'Профессиональная услуга по установке',
        descriptionAm: 'Պրոֆեսիոնալ տեղակայման ծառայություն',
        serviceType: 'installation',
        icon: '🔧',
    },
    {
        id: 'installation-premium',
        name: 'Premium Installation',
        nameRu: 'Премиум установка',
        nameAm: 'Պրեմիում տեղակայում',
        price: 150,
        description: 'Premium installation with setup and testing',
        descriptionRu: 'Премиум установка с настройкой и тестированием',
        descriptionAm: 'Պրեմիում տեղակայում՝ կարգավորմամբ և փորձարկումով',
        serviceType: 'installation',
        icon: '⭐',
    },
    {
        id: 'assembly-standard',
        name: 'Assembly Service',
        nameRu: 'Услуга сборки',
        nameAm: 'Հավաքման ծառայություն',
        price: 60,
        description: 'Professional assembly of your product',
        descriptionRu: 'Профессиональная сборка вашего товара',
        descriptionAm: 'Ձեր ապրանքի պրոֆեսիոնալ հավաքում',
        serviceType: 'assembly',
        icon: '🔨',
    },
    {
        id: 'warranty-extended',
        name: 'Extended Warranty',
        nameRu: 'Расширенная гарантия',
        nameAm: 'Ընդլայնված երաշխիք',
        price: 40,
        description: 'Additional 2 years warranty coverage',
        descriptionRu: 'Дополнительная гарантия на 2 года',
        descriptionAm: 'Լրացուցիչ 2 տարի երաշխիք',
        serviceType: 'other',
        icon: '🛡️',
    },
];

export const getServicesByType = (type: Service['serviceType']): Service[] => {
    return availableServices.filter(service => service.serviceType === type);
};

export const getServiceById = (id: string): Service | undefined => {
    return availableServices.find(service => service.id === id);
};

export const getDeliveryServices = (): Service[] => {
    return getServicesByType('delivery');
};

export const getInstallationServices = (): Service[] => {
    return getServicesByType('installation');
};

export const getAssemblyServices = (): Service[] => {
    return getServicesByType('assembly');
};
