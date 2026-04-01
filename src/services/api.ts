const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'newsun_auth_token';

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

export interface ApiAppItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  iconName: string;
  imageUrl?: string;
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  summary: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      const optionsHeaders = new Headers(options.headers);
      optionsHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.request('/apps', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getApps(): Promise<ApiAppItem[]> {
    return this.request<ApiAppItem[]>('/apps');
  }

  async getApp(id: string): Promise<ApiAppItem> {
    return this.request<ApiAppItem>(`/apps/${id}`);
  }

  async createApp(app: Omit<ApiAppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiAppItem> {
    return this.request<ApiAppItem>('/apps', {
      method: 'POST',
      body: JSON.stringify(app),
    });
  }

  async updateApp(id: string, app: Partial<Omit<ApiAppItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiAppItem> {
    return this.request<ApiAppItem>(`/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(app),
    });
  }

  async deleteApp(id: string): Promise<void> {
    return this.request<void>(`/apps/${id}`, {
      method: 'DELETE',
    });
  }

  async getArticles(): Promise<ApiArticle[]> {
    return this.request<ApiArticle[]>('/articles');
  }

  async getArticle(id: string): Promise<ApiArticle> {
    return this.request<ApiArticle>(`/articles/${id}`);
  }

  async createArticle(article: Omit<ApiArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiArticle> {
    return this.request<ApiArticle>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<Omit<ApiArticle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiArticle> {
    return this.request<ApiArticle>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: string): Promise<void> {
    return this.request<void>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
