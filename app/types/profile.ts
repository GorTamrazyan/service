// types/profile.ts
export interface UserProfile {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
        street: string;
        houseNumber: string;
        apartmentNumber: string;
        city: string;
        zipCode: string;
    };
    email: string;
}

export interface SidebarNavigationProps {
    profile: UserProfile;
    activeSection: string;
    onSectionChange: (section: string) => void;
    onLogout: () => void;
}

export interface ProfileContentProps {
    profile: UserProfile;
    activeSection: string;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}
