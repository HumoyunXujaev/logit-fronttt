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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
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
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('telegram_id', user?.telegram_id);
    return response.data;
  }

  static async checkTelegramAuth(telegramData: any): Promise<boolean> {
    try {
      const authPayload = await this.prepareAuthPayload(telegramData);
      console.log('Checking auth payload:', authPayload);

      const response = await api.post('/users/telegram_auth/', authPayload);

      // Если пользователь найден, сохраняем токены и возвращаем true
      await this.handleAuthResponse(response);
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          // Пользователь не найден - это ожидаемый результат
          return false;
        }
        // Другие ошибки
        const message =
          error.response?.data?.detail || 'Authentication check failed';
        toast.error(message);
        console.error('Auth check error:', error.response?.data);
      }
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
      // Шаг 1: Регистрация с Telegram данными
      const authPayload = await this.prepareAuthPayload(data.telegramData);
      const registrationResponse = await api.post('/users/register/', {
        ...authPayload,
        userData: data.userData,
      });
      console.log(registrationResponse, 'regres');

      // Сохраняем токены после регистрации
      await this.handleAuthResponse(registrationResponse);

      // Add delay before profile update (2 seconds)
      // await this.delay(2000);

      // // Configure headers with new token
      // const token = localStorage.getItem('access_token');
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // // Step 2: Update user profile
      // const updateResponse = await api.put('/users/update_profile/', {
      //   ...data.userData,
      // });

      return {
        ...registrationResponse.data,
        // user: updateResponse.data,
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
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      const response = await api.post<{ access: string }>(
        '/auth/token/refresh/',
        {
          refresh,
        }
      );

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      return access;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }

  static async updateProfile(data: any) {
    try {
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
        window.location.href = '/select-lang';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AuthService;
