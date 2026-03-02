import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { CollectionStats } from '@/types/payment.types';

export interface DashboardStats {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    occupancyPct: number;
    openMaintenance: number;
    maintenanceCostThisMonth: number;
    collectionPct: number;
    collection: CollectionStats;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get(ENDPOINTS.DASHBOARD.STATS);
    return data;
};

export const getCollectionBreakdown = async (): Promise<CollectionStats> => {
    const { data } = await api.get(ENDPOINTS.DASHBOARD.COLLECTION);
    return data;
};

export const getRecentActivity = async () => {
    const { data } = await api.get(ENDPOINTS.DASHBOARD.ACTIVITY);
    return data;
};
