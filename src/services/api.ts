let API_URL = import.meta.env.VITE_API_URL || '/api';
API_URL = API_URL.replace(/\/$/, '');
if (API_URL !== '/api' && !API_URL.endsWith('/api')) {
  API_URL = `${API_URL}/api`;
}

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

export interface ApiComment {
  id: string;
  articleId: string;
  content: string;
  author: string;
  email?: string;
  status: string;
  likes: number;
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

  async getApp(): Promise<ApiAppItem> {
    return this.request<ApiAppItem>('/apps');
  }

  async createApp(app: Omit<ApiAppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiAppItem> {
    return this.request<ApiAppItem>('/apps', {
      method: 'POST',
      body: JSON.stringify(app),
    });
  }

  async updateApp(id: string, app: Partial<Omit<ApiAppItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiAppItem> {
    return this.request<ApiAppItem>('/apps', {
      method: 'PUT',
      body: JSON.stringify({ id, ...app }),
    });
  }

  async deleteApp(id: string): Promise<void> {
    try {
      return this.request<void>('/apps', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.warn('Delete app failed, but proceeding:', error);
    }
  }

  async getArticles(): Promise<ApiArticle[]> {
    return this.request<ApiArticle[]>('/articles');
  }

  async getArticle(): Promise<ApiArticle> {
    return this.request<ApiArticle>('/articles');
  }

  async createArticle(article: Omit<ApiArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiArticle> {
    return this.request<ApiArticle>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<Omit<ApiArticle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiArticle> {
    return this.request<ApiArticle>('/articles', {
      method: 'PUT',
      body: JSON.stringify({ id, ...article }),
    });
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      return this.request<void>('/articles', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.warn('Delete article failed, but proceeding:', error);
    }
  }

  // Comment methods
  async getComments(articleId: string): Promise<ApiComment[]> {
    return this.request<ApiComment[]>(`/comments?articleId=${articleId}`);
  }

  async createComment(comment: Omit<ApiComment, 'id' | 'status' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<ApiComment> {
    return this.request<ApiComment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async updateComment(id: string, comment: Partial<Omit<ApiComment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiComment> {
    return this.request<ApiComment>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(comment),
    });
  }

  async deleteComment(id: string): Promise<void> {
    try {
      return this.request<void>(`/comments/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Delete comment failed, but proceeding:', error);
    }
  }

  async likeComment(id: string): Promise<ApiComment> {
    // 直接更新评论的点赞数（后端处理递增逻辑）
    return this.updateComment(id, { likes: 1 });
  }
}

export const apiService = new ApiService();
