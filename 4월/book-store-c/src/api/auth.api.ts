import { SignupProps } from '../pages/Signup';
import { httpClient } from './http';

export const signup = async(userData: SignupProps) => {
  const response = await httpClient.post('/members/join', userData);
  return response.data;
};

export const resetRequest = async(data: SignupProps) => {
  const response = await httpClient.post('/members/reset', data);
  return response.data;
}

export const resetPassword = async(data: SignupProps) => {
  const response = await httpClient.put('/members/reset', data);
  return response.data;
}

interface LoginResponse {
  token: string;
}

export const login = async(data: SignupProps) => {
  const response = await httpClient.post<LoginResponse>('/members/login', data);
  return response.data;
}