/**
 * API Layer - Backend Interface
 * In production, these functions would make HTTP requests to your backend server
 * The backend would use MongoDB Atlas for data persistence
 * 
 * Example production architecture:
 * Frontend (React) -> API Layer -> Express.js Backend -> MongoDB Atlas
 */

import type { ContentItem, BiasResult, UserInteraction, UserStats, SliderValues } from './dataStore';

// Configuration (would be in environment variables in production)
const API_CONFIG = {
  // Vite uses import.meta.env.PROD to know if it's deployed
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3001/api',
  timeout: 10000,
};

/**
 * Generic API request handler
 * In production: would use fetch/axios to make actual HTTP requests
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log(`[API] ${method} ${endpoint}`, data);
  
  // In production, this would be:
  // const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
  //   method,
  //   headers: { 'Content-Type': 'application/json' },
  //   body: data ? JSON.stringify(data) : undefined,
  // });
  // return await response.json();
  
  // For now, return mock response
  return {} as T;
}

/**
 * Content API
 */
export const contentAPI = {
  /**
   * Get personalized content feed
   * Backend would query MongoDB with user preferences
   */
  async getFeed(params: {
    sliderValues: SliderValues;
    userId?: string;
    limit?: number;
  }): Promise<ContentItem[]> {
    return apiRequest<ContentItem[]>('/content/feed', 'POST', params);
  },

  /**
   * Get content by ID
   */
  async getContent(contentId: string): Promise<ContentItem> {
    return apiRequest<ContentItem>(`/content/${contentId}`);
  },

  /**
   * Search content
   */
  async searchContent(query: string): Promise<ContentItem[]> {
    return apiRequest<ContentItem[]>('/content/search', 'POST', { query });
  },
};

/**
 * User Interaction API
 */
export const interactionAPI = {
  /**
   * Log user interaction
   * Backend would save to MongoDB interactions collection
   */
  async logInteraction(interaction: Omit<UserInteraction, 'timestamp'>): Promise<void> {
    return apiRequest('/interactions', 'POST', interaction);
  },

  /**
   * Get user's interaction history
   */
  async getHistory(userId: string, limit?: number): Promise<UserInteraction[]> {
    return apiRequest<UserInteraction[]>(`/interactions/user/${userId}?limit=${limit || 100}`);
  },

  /**
   * Get interactions for specific content
   */
  async getContentInteractions(contentId: string): Promise<UserInteraction[]> {
    return apiRequest<UserInteraction[]>(`/interactions/content/${contentId}`);
  },
};

/**
 * AI Analysis API
 */
export const aiAPI = {
  /**
   * Analyze text for cognitive biases
   * Backend would call LLM API (OpenAI, Anthropic, Gemma, etc.)
   */
  async analyzeBias(text: string): Promise<BiasResult[]> {
    return apiRequest<BiasResult[]>('/ai/bias-detection', 'POST', { text });
  },

  /**
   * Generate content recommendation reason
   */
  async generateRecommendation(params: {
    content: ContentItem;
    userHistory: UserInteraction[];
    preferences: SliderValues;
  }): Promise<string> {
    return apiRequest<string>('/ai/recommendation', 'POST', params);
  },

  /**
   * Get bias analysis history
   */
  async getBiasHistory(userId: string): Promise<Array<{
    text: string;
    results: BiasResult[];
    timestamp: number;
  }>> {
    return apiRequest(`/ai/bias-history/${userId}`);
  },
};

/**
 * Analytics API
 */
export const analyticsAPI = {
  /**
   * Get user statistics
   * Backend would aggregate data from MongoDB
   */
  async getUserStats(userId: string): Promise<UserStats> {
    return apiRequest<UserStats>(`/analytics/stats/${userId}`);
  },

  /**
   * Get echo chamber score
   */
  async getEchoChamberScore(userId: string): Promise<number> {
    return apiRequest<number>(`/analytics/echo-chamber/${userId}`);
  },

  /**
   * Get content consumption trends
   */
  async getTrends(userId: string, days: number = 7): Promise<any> {
    return apiRequest(`/analytics/trends/${userId}?days=${days}`);
  },
};

/**
 * User API
 */
export const userAPI = {
  /**
   * Get or create user profile
   */
  async getProfile(userId: string): Promise<any> {
    return apiRequest(`/users/${userId}`);
  },

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: SliderValues): Promise<void> {
    return apiRequest(`/users/${userId}/preferences`, 'PUT', preferences);
  },

  /**
   * Clear user data
   */
  async clearData(userId: string): Promise<void> {
    return apiRequest(`/users/${userId}/data`, 'DELETE');
  },
};

/**
 * Health check
 */
export const healthAPI = {
  async check(): Promise<{ status: string; timestamp: number }> {
    return apiRequest('/health');
  },
};

/**
 * Export all APIs
 */
export const api = {
  content: contentAPI,
  interaction: interactionAPI,
  ai: aiAPI,
  analytics: analyticsAPI,
  user: userAPI,
  health: healthAPI,
};

/**
 * MongoDB Schema Examples (for backend implementation)
 * 
 * // User Schema
 * {
 *   _id: ObjectId,
 *   userId: String,
 *   preferences: {
 *     education: Number,
 *     viewpoint: Number,
 *     sentiment: Number,
 *     recency: Number
 *   },
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * 
 * // Content Schema
 * {
 *   _id: ObjectId,
 *   contentId: String,
 *   title: String,
 *   excerpt: String,
 *   type: String,
 *   viewpoint: String,
 *   sentiment: String,
 *   virality: Number,
 *   biasScore: Number,
 *   trustScore: Number,
 *   source: String,
 *   tags: [String],
 *   createdAt: Date
 * }
 * 
 * // Interaction Schema
 * {
 *   _id: ObjectId,
 *   userId: String,
 *   contentId: String,
 *   action: String,
 *   sliderValues: Object,
 *   timestamp: Date
 * }
 * 
 * // BiasAnalysis Schema
 * {
 *   _id: ObjectId,
 *   userId: String,
 *   text: String,
 *   results: [Object],
 *   timestamp: Date
 * }
 */
