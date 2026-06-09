import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export interface PredictionResult {
  prediction: string;
  confidence: number;
  probability_distribution: Record<string, number>;
  shap_values: Array<{ word: string; shap_value: number }>;
  suspicious_words: string[];
}

export interface HistoryItem {
  id: number;
  article_text: string;
  prediction: string;
  confidence: number;
  created_at: string;
}

export interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  roc_auc: number;
}

export interface ModelInfo {
  model_name: string;
  version: string;
  features: number;
  loaded?: boolean;
  classes?: string[];
}

export interface TrendPoint {
  date: string;
  count: number;
  real_count: number;
  fake_count: number;
}

export interface DistributionItem {
  name: string;
  value: number;
}

export interface CommonTerm {
  text: string;
  value: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  email: string;
  id: number;
}

export const predictArticle = async (article_text: string): Promise<PredictionResult> => {
  const { data } = await api.post<PredictionResult>('/predict', { article_text });
  return data;
};

export const uploadFile = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<PredictionResult>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  const { data } = await api.get<HistoryItem[]>('/history');
  return data;
};

export const getMetrics = async (): Promise<Metrics> => {
  const { data } = await api.get<Metrics>('/metrics');
  return data;
};

export const getModelInfo = async (): Promise<ModelInfo> => {
  const { data } = await api.get<ModelInfo>('/model-info');
  return data;
};

export const getTrends = async (): Promise<TrendPoint[]> => {
  const { data } = await api.get<TrendPoint[]>('/metrics/trends');
  return data;
};

export const getDistribution = async (): Promise<DistributionItem[]> => {
  const { data } = await api.get<DistributionItem[]>('/metrics/distribution');
  return data;
};

export const getCommonTerms = async (): Promise<CommonTerm[]> => {
  const { data } = await api.get<CommonTerm[]>('/metrics/common-terms');
  return data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/signup', { email, password });
  return data;
};

export const getMe = async (): Promise<UserInfo> => {
  const { data } = await api.get<UserInfo>('/auth/me');
  return data;
};

export default api;
