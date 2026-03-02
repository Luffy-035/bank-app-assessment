import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/user.types';

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);
    return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    return data;
};

export const getMe = async () => {
    const { data } = await api.get(ENDPOINTS.AUTH.ME);
    return data;
};

export const updatePushToken = async (pushToken: string) => {
    const { data } = await api.patch(ENDPOINTS.AUTH.PUSH_TOKEN, { pushToken });
    return data;
};
