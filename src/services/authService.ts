import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Token keys for AsyncStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: any; // Adjust type as needed
}

const authService = {
  // Store tokens securely
  async storeTokens(tokens: AuthTokens) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  // Retrieve tokens
  async getAccessToken() {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Remove tokens (logout)
  async clearTokens() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Sign in
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/signin', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      await this.storeTokens({ accessToken, refreshToken });
      return { tokens: { accessToken, refreshToken }, user };
    } catch (error) {
      throw error;
    }
  },

  // Sign up
  async signUp(email: string, password: string, extraData?: any): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/signup', { email, password, ...extraData });
      const { accessToken, refreshToken, user } = response.data;
      await this.storeTokens({ accessToken, refreshToken });
      return { tokens: { accessToken, refreshToken }, user };
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  async refreshToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await this.storeTokens({ accessToken, refreshToken: newRefreshToken });
      return accessToken;
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  },

  // Get current user session (if needed)
  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Logout
  async logout() {
    await this.clearTokens();
    // Optionally, call backend to invalidate refresh token
    // await api.post('/api/auth/logout');
  },

  // Send OTP for sign-in
  async sendOtpSignIn(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/send-otp-signin', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP.' };
    }
  },

  // Send OTP for sign-up
  async sendOtpSignUp(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/send-otp-signup', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP.' };
    }
  },

  // Resend OTP for sign-in
  async resendOtpSignIn(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/resend-otp-signin', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP.' };
    }
  },

  // Resend OTP for sign-up
  async resendOtpSignUp(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/resend-otp-signup', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP.' };
    }
  },

  // Verify OTP for sign-in
  async verifyOtpSignIn(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/verify-otp-signin', { email, otp });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to verify OTP.' };
    }
  },

  // Verify OTP for sign-up
  async verifyOtpSignUp(email: string, otp: string, password: string, name: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/api/auth/verify-otp-signup', { email, otp, password, name });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to verify OTP.' };
    }
  },
};

export default authService; 