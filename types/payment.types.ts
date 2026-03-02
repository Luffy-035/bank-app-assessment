export interface Payment {
    _id: string;
    tenantId: {
        _id: string;
        tenantId: string;
        userId: { _id: string; name: string; phone: string };
    };
    unitId: { _id: string; unitNumber: string } | null;
    propertyId: { _id: string; name: string } | null;
    month: number;
    year: number;
    rentDue: number;
    amountPaid: number;
    balance: number;
    status: 'paid' | 'partial' | 'pending';
    paymentMode: 'cash' | 'upi' | 'cheque' | 'bank_transfer' | 'other';
    paymentDate: string | null;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DueSummary {
    tenant: {
        _id: string;
        tenantId: string;
        userId: { _id: string; name: string; phone: string };
    };
    unit: { _id: string; unitNumber: string } | null;
    property: { _id: string; name: string } | null;
    rentDue: number;
    amountPaid: number;
    balance: number;
    status: 'paid' | 'partial' | 'pending';
}

export interface CollectionStats {
    totalDue: number;
    totalCollected: number;
    totalPending: number;
    collectionPct: number;
}

export interface RecordPaymentPayload {
    tenantId: string;
    month: number;
    year: number;
    rentDue: number;
    amountPaid: number;
    paymentMode: 'cash' | 'upi' | 'cheque' | 'bank_transfer' | 'other';
    paymentDate?: string;
    notes?: string;
}
