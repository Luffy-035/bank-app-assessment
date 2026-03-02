import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { Property, AddPropertyPayload, Unit, AddUnitPayload } from '@/types/property.types';

// ── Properties
export const getProperties = async (): Promise<Property[]> => {
    const { data } = await api.get(ENDPOINTS.PROPERTIES.LIST);
    return data.properties ?? data;
};

export const getProperty = async (id: string): Promise<Property> => {
    const { data } = await api.get(ENDPOINTS.PROPERTIES.DETAIL(id));
    return data.property ?? data;
};

export const addProperty = async (payload: AddPropertyPayload): Promise<Property> => {
    const { data } = await api.post(ENDPOINTS.PROPERTIES.LIST, payload);
    return data.property ?? data;
};

export const updateProperty = async (id: string, payload: Partial<AddPropertyPayload>): Promise<Property> => {
    const { data } = await api.put(ENDPOINTS.PROPERTIES.DETAIL(id), payload);
    return data.property ?? data;
};

export const deleteProperty = async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.PROPERTIES.DETAIL(id));
};

// ── Units
export const getUnits = async (propertyId: string): Promise<Unit[]> => {
    const { data } = await api.get(ENDPOINTS.PROPERTIES.UNITS(propertyId));
    return data.units ?? data;
};

export const addUnit = async (propertyId: string, payload: AddUnitPayload): Promise<Unit> => {
    const { data } = await api.post(ENDPOINTS.PROPERTIES.UNITS(propertyId), payload);
    return data.unit ?? data;
};

export const getUnit = async (id: string): Promise<Unit> => {
    const { data } = await api.get(ENDPOINTS.UNITS.DETAIL(id));
    return data.unit ?? data;
};
