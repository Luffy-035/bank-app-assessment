export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'landlord' | 'tenant' | 'admin';
    profileImage?: string;
    address: {
        pincode: string;
        state: string;
        district: string;
        full: string;
    };
    pushToken?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginPayload {
    email?: string;
    phone?: string;
    password?: string;
    tenantId?: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'landlord' | 'tenant';
    address: {
        pincode: string;
        state: string;
        district: string;
        full: string;
    };
}
