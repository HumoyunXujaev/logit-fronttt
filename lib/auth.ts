import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramAuthResponse {
  access: string;
  refresh: string;
  user: any;
}

interface RegistrationData {
  telegramData: any;
  userData: any;
}

// Get API URL dynamically from environment variables
const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('Auth service using API URL:', apiUrl);
  return apiUrl || 'http://localhost:8000/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
  withCredentials: true, // Important for CORS
});

export class AuthService {
  private static async prepareAuthPayload(telegramData: any) {
    return {
      init_data: telegramData?.initData,
      user: telegramData?.initDataUnsafe.user,
      auth_date: Number(telegramData?.initDataUnsafe.auth_date),
      hash: telegramData?.initDataUnsafe.hash,
    };
  }

  private static async handleAuthResponse(response: any) {
    const { access, refresh, user } = response.data;
    // Save tokens and user info
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // Save telegram ID for future reference
    if (user?.telegram_id) {
      localStorage.setItem('telegram_id', user.telegram_id);
    }
    return response.data;
  }

  static async checkSmartbotUser(telegramId: number | string): Promise<any> {
    try {
      // Update baseURL before each request
      api.defaults.baseURL = getApiUrl();

      const response = await api.post('/users/check-smartbot-user/', {
        telegram_id: telegramId,
      });

      // If user was found in smartbot and imported, handle auth data
      if (response.data.imported) {
        await this.handleAuthResponse(response);
      }

      return response.data;
    } catch (error) {
      console.error('Smartbot user check error:', error);
      return null;
    }
  }

  static async checkTelegramAuth(telegramData: any): Promise<boolean> {
    try {
      const authPayload = await this.prepareAuthPayload(telegramData);
      console.log('Checking auth payload:', authPayload);

      // Update baseURL before each request to ensure we're using the latest env var
      api.defaults.baseURL = getApiUrl();

      try {
        const response = await api.post('/users/telegram_auth/', authPayload);
        // If user is found, save tokens and return true
        await this.handleAuthResponse(response);
        return true;
      } catch (error: any) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // User not found - check if they exist in smartbot
          const telegramId = telegramData.initDataUnsafe.user.id;

          // Try to check and import from smartbot
          const smartbotResponse = await this.checkSmartbotUser(telegramId);

          // If user was imported from smartbot, return true
          if (
            smartbotResponse &&
            (smartbotResponse.imported || smartbotResponse.in_local_db)
          ) {
            return true;
          }

          // User doesn't exist in either database
          return false;
        }

        // Other errors
        const message =
          error.response?.data?.detail || 'Authentication check failed';
        toast.error(message);
        console.error('Auth check error:', error.response?.data);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async registerUser(
    data: RegistrationData
  ): Promise<TelegramAuthResponse> {
    try {
      // Update baseURL before each request
      api.defaults.baseURL = getApiUrl();
      // Step 1: Register with Telegram data
      const authPayload = await this.prepareAuthPayload(data.telegramData);
      const registrationResponse = await api.post('/users/register/', {
        ...authPayload,
        userData: data.userData,
      });
      console.log(registrationResponse, 'regres');
      // Save tokens after registration
      await this.handleAuthResponse(registrationResponse);
      return {
        ...registrationResponse.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.detail || 'Registration failed';
        toast.error(message);
        console.error('Registration error:', error.response?.data);
      }
      throw error;
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      // Update baseURL before each request
      api.defaults.baseURL = getApiUrl();
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');
      const response = await api.post<{ access: string }>(
        '/auth/token/refresh/',
        { refresh }
      );
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      // On refresh failure, clean up tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }

  static async updateProfile(data: any) {
    try {
      // Update baseURL before each request
      api.defaults.baseURL = getApiUrl();
      const token = localStorage.getItem('access_token');
      const response = await api.put('/users/update_profile/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.detail || 'Failed to update profile';
        toast.error(message);
      }
      throw error;
    }
  }

  static async getProfile() {
    try {
      // Update baseURL before each request
      api.defaults.baseURL = getApiUrl();
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No auth token');
      const response = await api.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.detail || 'Failed to get profile';
        toast.error(message);
      }
      throw error;
    }
  }

  static logout() {
    // Don't remove telegram_id to maintain user selection in user switcher
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  static clearAllAuthData() {
    // Use this when you want to completely clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('telegram_id');
    localStorage.removeItem('selectedTestUser');
  }
}

// Add axios interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const access = await AuthService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        AuthService.logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AuthService;
