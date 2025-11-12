import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, BabyName, PendingNamesResponse, RoundResult } from '../types';
import { emitTokensCleared } from './authEvents';

const TOKEN_KEY = 'baby-names.token';
const REFRESH_TOKEN_KEY = 'baby-names.refresh-token';

const API_BASE_URL =
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.apiUrl ??
  'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

async function storeSecurely(key: string, value: string) {
  if (!value) {
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('SecureStore unavailable, falling back to AsyncStorage', error);
    }
    await AsyncStorage.setItem(key, value);
  }
}

async function retrieveSecurely(key: string) {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      return value;
    }
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('SecureStore unavailable, falling back to AsyncStorage', error);
    }
  }

  return AsyncStorage.getItem(key);
}

async function deleteSecurely(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    await AsyncStorage.removeItem(key);
  }
}

client.interceptors.request.use(async (config) => {
  const token = await retrieveSecurely(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearTokens();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (payload: {
    email: string;
    password: string;
    displayName: string;
    partnerCode?: string;
  }): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/auth/register', payload);
    await persistAuthResponse(data);
    return data;
  },
  login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/auth/login', payload);
    await persistAuthResponse(data);
    return data;
  },
  invitePartner: async (payload: { email: string }): Promise<{ code: string }> => {
    const { data } = await client.post<{ code: string }>('/partners/invite', payload);
    return data;
  }
};

export const namesApi = {
  fetchPending: async (): Promise<PendingNamesResponse> => {
    const { data } = await client.get<PendingNamesResponse>('/names/pending');
    return data;
  },
  vote: async (
    nameId: string,
    vote: 'like' | 'dislike' | 'supermatch'
  ): Promise<{ remaining: number }> => {
    const { data } = await client.post<{ remaining: number }>(`/names/${nameId}/vote`, {
      vote
    });
    return data;
  },
  fetchMatched: async (): Promise<BabyName[]> => {
    const { data } = await client.get<BabyName[]>('/names/matched');
    return data;
  }
};

export const roundsApi = {
  fetchSummary: async (): Promise<RoundResult> => {
    const { data } = await client.get<RoundResult>('/rounds/current');
    return data;
  },
  fetchHistory: async (): Promise<RoundResult[]> => {
    const { data } = await client.get<RoundResult[]>('/rounds');
    return data;
  }
};

export async function persistAuthResponse({ token, refreshToken }: AuthResponse) {
  await Promise.all([
    storeSecurely(TOKEN_KEY, token),
    refreshToken ? storeSecurely(REFRESH_TOKEN_KEY, refreshToken) : Promise.resolve()
  ]);
}

export async function clearTokens() {
  await Promise.all([deleteSecurely(TOKEN_KEY), deleteSecurely(REFRESH_TOKEN_KEY)]);
  emitTokensCleared();
}

export async function getAccessToken() {
  return retrieveSecurely(TOKEN_KEY);
}

export default client;
