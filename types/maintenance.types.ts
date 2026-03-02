export type MaintenanceCategory = 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'other';
export type MaintenanceStatus = 'pending' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

export interface MaintenanceRequest {
    _id: string;
    tenantId: string;
    userId: string;
    landlordId: string;
    propertyId: string;
    unitId: string;
    title: string;
    description: string;
    category: MaintenanceCategory;
    status: MaintenanceStatus;
    adminNotes?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;

    // Populated fields
    tenant?: {
        tenantId: string;
        userId: { name: string; phone: string };
        unitId: { unitNumber: string; floorNumber: number };
    };
}

export interface RaiseRequestPayload {
    title: string;
    description: string;
    category: MaintenanceCategory;
}

export interface UpdateStatusPayload {
    status: MaintenanceStatus;
    adminNotes?: string;
}

export interface Notification {
    _id: string;
    fromUserId: string;
    toUserId: string;
    type: 'rent_reminder' | 'payment_received' | 'maintenance_update' | 'general';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: string;
    createdAt: string;
}
