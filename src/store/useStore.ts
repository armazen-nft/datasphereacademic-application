import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  IUser, 
  IArticle, 
  IDashboardStats, 
  IValidatorLeaderboard 
} from '../types';
import api from '../services/api';

// ============================================
// STORE STATE INTERFACE
// ============================================

interface AppState {
  // Auth
  currentUser: IUser | null;
  isAuthenticated: boolean;
  
  // Data
  articles: IArticle[];
  users: IUser[];
  dashboardStats: IDashboardStats | null;
  leaderboard: IValidatorLeaderboard[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  articlesPage: number;
  articlesTotal: number;
  hasMoreArticles: boolean;
  
  // Actions
  setCurrentUser: (user: IUser | null) => void;
  login: (user: IUser) => void;
  logout: () => void;
  
  // Article Actions
  fetchArticles: (page?: number, filters?: any) => Promise<void>;
  fetchArticle: (id: string) => Promise<IArticle | null>;
  createArticle: (articleData: Partial<IArticle>) => Promise<IArticle | null>;
  submitArticle: (id: string) => Promise<boolean>;
  publishArticle: (id: string) => Promise<boolean>;
  
  // User Actions
  fetchUsers: (page?: number, filters?: any) => Promise<void>;
  fetchUser: (id: string) => Promise<IUser | null>;
  
  // Dashboard Actions
  fetchDashboardStats: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      articles: [],
      users: [],
      dashboardStats: null,
      leaderboard: [],
      isLoading: false,
      error: null,
      articlesPage: 1,
      articlesTotal: 0,
      hasMoreArticles: false,

      // Auth Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      login: (user) => set({ 
        currentUser: user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        currentUser: null, 
        isAuthenticated: false 
      }),

      // Article Actions
      fetchArticles: async (page = 1, filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.listArticles(page, 10, filters);
          if (response.success && response.data) {
            set(state => ({
              articles: page === 1 
                ? response.data!.items 
                : [...state.articles, ...response.data!.items],
              articlesPage: page,
              articlesTotal: response.data!.total,
              hasMoreArticles: response.data!.hasMore
            }));
          } else {
            set({ error: response.error || 'Failed to fetch articles' });
          }
        } catch (err) {
          set({ error: (err as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchArticle: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getArticle(id);
          if (response.success && response.data) {
            return response.data;
          } else {
            set({ error: response.error || 'Failed to fetch article' });
            return null;
          }
        } catch (err) {
          set({ error: (err as Error).message });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      createArticle: async (articleData: Partial<IArticle>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.createArticle(articleData);
          if (response.success && response.data) {
            set(state => ({
              articles: [response.data!, ...state.articles]
            }));
            return response.data;
          } else {
            set({ error: response.error || 'Failed to create article' });
            return null;
          }
        } catch (err) {
          set({ error: (err as Error).message });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      submitArticle: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.submitForValidation(id);
          if (response.success) {
            set(state => ({
              articles: state.articles.map(a => 
                a.id === id ? { ...a, status: 'under_review' } : a
              )
            }));
            return true;
          } else {
            set({ error: response.error || 'Failed to submit article' });
            return false;
          }
        } catch (err) {
          set({ error: (err as Error).message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      publishArticle: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.publishArticle(id);
          if (response.success) {
            set(state => ({
              articles: state.articles.map(a => 
                a.id === id ? { ...a, status: 'published' } : a
              )
            }));
            return true;
          } else {
            set({ error: response.error || 'Failed to publish article' });
            return false;
          }
        } catch (err) {
          set({ error: (err as Error).message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // User Actions
      fetchUsers: async (page = 1, filters = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.listUsers(page, 10, filters);
          if (response.success && response.data) {
            set(state => ({
              users: page === 1 
                ? response.data!.items 
                : [...state.users, ...response.data!.items]
            }));
          } else {
            set({ error: response.error || 'Failed to fetch users' });
          }
        } catch (err) {
          set({ error: (err as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUser: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getUser(id);
          if (response.success && response.data) {
            return response.data;
          } else {
            set({ error: response.error || 'Failed to fetch user' });
            return null;
          }
        } catch (err) {
          set({ error: (err as Error).message });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      // Dashboard Actions
      fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getArticleStats();
          if (response.success && response.data) {
            set({ dashboardStats: response.data });
          } else {
            set({ error: response.error || 'Failed to fetch stats' });
          }
        } catch (err) {
          set({ error: (err as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchLeaderboard: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getLeaderboard(50);
          if (response.success && response.data) {
            set({ leaderboard: response.data });
          } else {
            set({ error: response.error || 'Failed to fetch leaderboard' });
          }
        } catch (err) {
          set({ error: (err as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Utility Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'moltbook-store',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

export default useStore;
