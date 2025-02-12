import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await this.api.post('/auth/token/refresh/', {
              refresh: refreshToken,
            });
            const { access } = response.data;
            localStorage.setItem('access_token', access);
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/select-lang';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic request methods
  public async get(url: string, params?: any) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  }

  public async post(url: string, data?: any) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  }

  public async put(url: string, data: any) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  }

  public async patch(url: string, data: any) {
    try {
      const response = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('PATCH request error:', error);
      throw error;
    }
  }

  public async delete(url: string) {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }

  // Authentication
  public async telegramAuth(telegramData: any) {
    try {
      const response = await this.api.post(
        '/users/telegram_auth/',
        telegramData
      );
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      return user;
    } catch (error) {
      console.error('Telegram auth error:', error);
      throw error;
    }
  }

  // User Profile
  public async getCurrentUser() {
    try {
      const response = await this.api.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  public async updateProfile(data: any) {
    try {
      const response = await this.api.put('/users/update_profile/', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Cargo
  public async getCargos(params?: any) {
    try {
      const response = await this.api.get('/cargo/cargos/', { params });
      return response.data;
    } catch (error) {
      console.error('Get cargos error:', error);
      throw error;
    }
  }

  public async createCargo(data: any) {
    try {
      console.log(data, 'createcargodata')
      const response = await this.api.post('/cargo/cargos/', data);
      return response.data;
    } catch (error) {
      console.error('Create cargo error:', error);
      throw error;
    }
  }

  public async updateCargo(id: string, data: any) {
    try {
      const response = await this.api.patch(`/cargo/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update cargo error:', error);
      throw error;
    }
  }

  // Vehicles
  public async getVehicles(params?: any) {
    try {
      const response = await this.api.get('/vehicles/', { params });
      return response.data;
    } catch (error) {
      console.error('Get vehicles error:', error);
      throw error;
    }
  }

  public async createVehicle(data: any) {
    try {
      const response = await this.api.post('/vehicles/', data);
      return response.data;
    } catch (error) {
      console.error('Create vehicle error:', error);
      throw error;
    }
  }

  public async updateVehicle(id: string, data: any) {
    try {
      const response = await this.api.patch(`/vehicles/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update vehicle error:', error);
      throw error;
    }
  }

  public async deleteVehicle(id: string) {
    try {
      const response = await this.api.delete(`/vehicles/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete vehicle error:', error);
      throw error;
    }
  }

  // Vehicle Documents
  public async addVehicleDocument(
    vehicleId: string,
    data: {
      file: File;
      type:
        | 'tech_passport'
        | 'license'
        | 'insurance'
        | 'adr_cert'
        | 'dozvol'
        | 'tir'
        | 'other';
      title: string;
      expiry_date?: string;
    }
  ) {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.type);
      formData.append('title', data.title);
      if (data.expiry_date) {
        formData.append('expiry_date', data.expiry_date);
      }

      const response = await this.api.post(
        `/vehicles/${vehicleId}/add_document/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Add vehicle document error:', error);
      throw error;
    }
  }
  // Carrier Requests
  public async getCarrierRequests(params?: any) {
    try {
      const response = await this.api.get('/carrier-requests/', { params });
      return response.data;
    } catch (error) {
      console.error('Get carrier requests error:', error);
      throw error;
    }
  }

  public async createCarrierRequest(data: any) {
    try {
      const response = await this.api.post('/carrier-requests/', data);
      return response.data;
    } catch (error) {
      console.error('Create carrier request error:', error);
      throw error;
    }
  }

  public async updateCarrierRequest(id: string, data: any) {
    try {
      const response = await this.api.patch(`/carrier-requests/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update carrier request error:', error);
      throw error;
    }
  }

  public async deleteCarrierRequest(id: string) {
    try {
      const response = await this.api.delete(`/carrier-requests/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete carrier request error:', error);
      throw error;
    }
  }

  // Notifications
  public async getNotifications() {
    try {
      const response = await this.api.get('/core/notifications/');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  public async markNotificationAsRead(id: string) {
    try {
      const response = await this.api.post(
        `/core/notifications/${id}/mark-read/`
      );
      return response.data;
    } catch (error) {
      console.error('Mark notification error:', error);
      throw error;
    }
  }

  // Favorites
  public async getFavorites() {
    try {
      const response = await this.api.get('/core/favorites/');
      return response.data;
    } catch (error) {
      console.error('Get favorites error:', error);
      throw error;
    }
  }

  public async addToFavorites(data: any) {
    try {
      const response = await this.api.post('/core/favorites/', data);
      return response.data;
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  }

  // Search
  public async searchCargo(filters: any) {
    try {
      const response = await this.api.post('/cargo/search/', filters);
      return response.data;
    } catch (error) {
      console.error('Search cargo error:', error);
      throw error;
    }
  }

  public async addUserDocument(data: {
    file: File;
    type: 'driver_license' | 'passport' | 'company_certificate' | 'other';
    title: string;
  }) {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.type);
      formData.append('title', data.title);

      const response = await this.api.post(
        '/users/upload_document/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Add user document error:', error);
      throw error;
    }
  }

  public async getUserDocuments() {
    try {
      const response = await this.api.get('/users/documents/');
      return response.data;
    } catch (error) {
      console.error('Get user documents error:', error);
      throw error;
    }
  }

  public async deleteUserDocument(id: string) {
    try {
      const response = await this.api.delete(`/users/documents/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete user document error:', error);
      throw error;
    }
  }

  // public async updateCargo(id: string, data: any) {
  //   try {
  //     const response = await this.api.patch(`/cargo/${id}/`, data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Update cargo error:', error);
  //     throw error;
  //   }
  // }
}

export const api = ApiClient.getInstance();
