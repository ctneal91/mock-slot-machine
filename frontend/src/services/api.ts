import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

export interface GameSession {
  session_token: string;
  credits: number;
  cashed_out: boolean;
}

export interface RollResult {
  result: string[];
  win: boolean;
  reward: number;
  credits: number;
}

export interface CashOutResult {
  message: string;
  credits_cashed: number;
  session_token: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createSession = async (): Promise<GameSession> => {
  const response = await api.post<GameSession>('/game_sessions');
  return response.data;
};

export const getSession = async (sessionToken: string): Promise<GameSession> => {
  const response = await api.get<GameSession>(`/game_sessions/${sessionToken}`);
  return response.data;
};

export const roll = async (sessionToken: string): Promise<RollResult> => {
  const response = await api.post<RollResult>(`/game_sessions/${sessionToken}/roll`);
  return response.data;
};

export const cashOut = async (sessionToken: string): Promise<CashOutResult> => {
  const response = await api.post<CashOutResult>(`/game_sessions/${sessionToken}/cash_out`);
  return response.data;
};

export default api;
