import axios, { AxiosInstance } from 'axios';

// Explicitly get environment variable in a way that evaluates at runtime
const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('API URL from env:', apiUrl);
  return apiUrl || 'http://localhost:8000/api';
};

export interface Location {
  id: number;
  name: string;
  level: number;
  code?: string;
  latitude?: number;
  longitude?: number;
  parent_name?: string;
  country_name?: string;
  full_name?: string;
  additional_data?: Record<string, any>;
}

export class ApiClient {
  private static instance: ApiClient | null = null;
  private api: AxiosInstance;

  private constructor() {
    const baseUrl = getBaseUrl();
    console.log('Initializing API client with base URL:', baseUrl);

    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config) => {
        // Log the request URL for debugging
        console.log(`Making request to: ${config.baseURL}${config.url}`);

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

  // Method to reset the instance - useful when environment variables change
  public static resetInstance(): void {
    ApiClient.instance = null;
    console.log('API client instance reset');
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
      console.log(data, 'createcargodata');
      const payload = { ...data };
      console.log('sending cargo data:', payload);
      const response = await this.api.post('/cargo/cargos/', payload);
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
  public async searchCargo(params?: any) {
    try {
      const response = await this.api.get('/cargo/cargos/search/', { params });
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

  public async searchLocations(query: string) {
    try {
      const response = await this.api.get<Location>('/core/locations/search/', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('search locations error:', error);
      throw error;
    }
  }

  // Получение локации по ID
  public async getLocation(id: number) {
    try {
      const response = await this.api.get<Location>(`/core/locations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('get location error:', error);
      throw error;
    }
  }

  // Get states/regions for a country
  public async getStates(countryId: number) {
    try {
      const response = await this.api.get(`/core/locations/states/`, {
        params: { country_id: countryId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  }

  // Get cities for a state or country
  public async getCities(params: { state_id?: number; country_id?: number }) {
    try {
      const response = await this.api.get(`/core/locations/cities/`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  // Find nearby location
  public async getNearbyLocations(
    lat: number,
    lon: number,
    radius: number = 100
  ) {
    try {
      const response = await this.api.get(`/core/locations/nearest/`, {
        params: { lat, lon, radius },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      throw error;
    }
  }

  // Получение ближайших локаций
  public async getNearestLocations(
    lat: number,
    lon: number,
    radius: number = 100
  ) {
    try {
      const response = await this.api.get<Location[]>(
        '/core/locations/nearest/',
        {
          params: { lat, lon, radius },
        }
      );
      return response.data;
    } catch (error) {
      console.error('nearest location error:', error);
      throw error;
    }
  }

  // Получение стран
  public async getCountries() {
    try {
      const response = await this.api.get<Location[]>(
        '/core/locations/countries/'
      );
      return response.data;
    } catch (error) {
      console.error('get countries error:', error);
      throw error;
    }
  }

  // Получение регионов/штатов по стране
  public async getStatesByCountry(countryId: number) {
    try {
      const response = await this.api.get<Location[]>(
        '/core/locations/states/',
        {
          params: { country_id: countryId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('get states error:', error);
      throw error;
    }
  }

  // Получение городов по региону/штату
  public async getCitiesByState(stateId: number) {
    try {
      const response = await this.api.get<Location[]>(
        '/core/locations/cities/',
        {
          params: { state_id: stateId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('get cities by state error:', error);
      throw error;
    }
  }

  // Получение городов по стране
  public async getCitiesByCountry(countryId: number) {
    try {
      const response = await this.api.get<Location[]>(
        '/core/locations/cities/',
        {
          params: { country_id: countryId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('get cities by country error:', error);
      throw error;
    }
  }

  public async getRatings(params?: any) {
    try {
      const response = await this.api.get('/core/ratings/', { params });
      return response.data;
    } catch (error) {
      console.error('Get ratings error:', error);
      throw error;
    }
  }

  public async createRating(data: {
    to_user: string;
    score: number;
    comment?: string;
    cargo_id?: string;
  }) {
    try {
      const response = await this.api.post('/core/ratings/', data);
      return response.data;
    } catch (error) {
      console.error('Create rating error:', error);
      throw error;
    }
  }

  public async updateRating(
    id: string,
    data: {
      score?: number;
      comment?: string;
    }
  ) {
    try {
      const response = await this.api.patch(`/core/ratings/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update rating error:', error);
      throw error;
    }
  }

  public async deleteRating(id: string) {
    try {
      const response = await this.api.delete(`/core/ratings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete rating error:', error);
      throw error;
    }
  }
}

// Function to initialize the API client
export const initApiClient = () => {
  // Reset the instance first to ensure we get a fresh one with current env vars
  ApiClient.resetInstance();
  return ApiClient.getInstance();
};

// Export the API client instance
export const api = initApiClient();
