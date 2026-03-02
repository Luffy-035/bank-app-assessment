import type { User } from './user.types';
import type { Property, Unit } from './property.types';

export interface Tenant {
    _id: string;
    tenantId: string; // e.g. "T-2026-001"
    userId: User | string;
    landlordId: string;
    propertyId: Property | string;
    unitId: Unit | string;
    securityDeposit: number;
    rentCycle: number; // Day of month rent is due (1–31)
    rentAmount: number;
    leaseStart: string;
    leaseEnd: string;
    status: 'active' | 'moved_out';
    createdAt: string;
    updatedAt: string;
}

// Lightweight version used in unit cards and payment summaries
export interface TenantSummary {
    _id: string;
    tenantId: string;
    userId: {
        _id: string;
        name: string;
        phone: string;
        email: string;
    };
}

export interface AddTenantPayload {
    name: string;
    phone: string;
    email?: string;
    unitId: string;
    securityDeposit: number;
    rentCycle: number;
    rentAmount: number;
    leaseStart: string;
    leaseEnd: string;
}
