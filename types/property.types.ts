export interface Property {
    _id: string;
    landlordId: string;
    name: string;
    type: 'building' | 'floor' | 'pg';
    address: string;
    totalFloors: number;
    isActive: boolean;
    unitCount?: number;
    occupiedCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Unit {
    _id: string;
    propertyId: string | Property;
    landlordId: string;
    floorNumber: number;
    unitNumber: string;
    unitConfig: string;
    rentAmount: number;
    status: 'occupied' | 'vacant';
    currentTenantId?: {
        _id: string;
        tenantId: string;
        userId: {
            _id: string;
            name: string;
            phone: string;
        };
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface AddPropertyPayload {
    name: string;
    type: 'building' | 'floor' | 'pg';
    address: string;
    totalFloors?: number;
    rentCycle?: number;
}

export interface AddUnitPayload {
    floorNumber: number;
    unitNumber: string;
    unitConfig: string;
    rentAmount: number;
}
