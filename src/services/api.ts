import type { 
  ApiResponse, 
  IArticle, 
  IUser, 
  PaginatedResponse, 
  IDashboardStats,
  IValidatorLeaderboard 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`
        };
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // ==================== ARTICLES ====================
  
  async createArticle(articleData: Partial<IArticle>): Promise<ApiResponse<IArticle>> {
    return this.request<IArticle>('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData)
    });
  }

  async getArticle(id: string): Promise<ApiResponse<IArticle>> {
    return this.request<IArticle>(`/articles/${id}`);
  }

  async listArticles(
    page: number = 1, 
    limit: number = 10,
    filters: { status?: string; authorId?: string; keywords?: string[] } = {}
  ): Promise<ApiResponse<PaginatedResponse<IArticle>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters.status) params.append('status', filters.status);
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.keywords) params.append('keywords', filters.keywords.join(','));
    
    return this.request<PaginatedResponse<IArticle>>(`/articles?${params.toString()}`);
  }

  async submitForValidation(id: string): Promise<ApiResponse<IArticle>> {
    return this.request<IArticle>(`/articles/${id}/submit`, {
      method: 'POST'
    });
  }

  async publishArticle(id: string): Promise<ApiResponse<IArticle>> {
    return this.request<IArticle>(`/articles/${id}/publish`, {
      method: 'POST'
    });
  }

  async createVersion(
    id: string, 
    content: string, 
    changes: string, 
    userId: string
  ): Promise<ApiResponse<IArticle>> {
    return this.request<IArticle>(`/articles/${id}/version`, {
      method: 'POST',
      body: JSON.stringify({ content, changes, userId })
    });
  }

  async getArticleStats(): Promise<ApiResponse<IDashboardStats>> {
    return this.request<IDashboardStats>('/articles/stats');
  }

  // ==================== USERS ====================
  
  async createUser(userData: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return this.request<IUser>('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getUser(id: string): Promise<ApiResponse<IUser>> {
    return this.request<IUser>(`/users/${id}`);
  }

  async listUsers(
    page: number = 1, 
    limit: number = 10,
    filters: { type?: 'human' | 'ai'; minReputation?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<IUser>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters.type) params.append('type', filters.type);
    if (filters.minReputation) params.append('minReputation', filters.minReputation.toString());
    
    return this.request<PaginatedResponse<IUser>>(`/users?${params.toString()}`);
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return this.request<IUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  async getValidationQuota(id: string): Promise<ApiResponse<{
    completed: number;
    required: number;
    remaining: number;
    canPublish: boolean;
  }>> {
    return this.request(`/users/${id}/quota`);
  }

  async getLeaderboard(limit: number = 50): Promise<ApiResponse<IValidatorLeaderboard[]>> {
    return this.request<IValidatorLeaderboard[]>(`/users/leaderboard?limit=${limit}`);
  }

  async getEligibleAIValidators(): Promise<ApiResponse<IUser[]>> {
    return this.request<IUser[]>('/users/eligible-validators');
  }

  async initializeUsers(): Promise<ApiResponse<void>> {
    return this.request<void>('/users/initialize');
  }

  // ==================== HEALTH ====================
  
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }
}

export const api = new ApiService();
export default api;
