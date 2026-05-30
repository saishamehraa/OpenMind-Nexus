// Central data store simulating backend functionality
// In production, this would connect to MongoDB Atlas

export interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'educational' | 'entertainment';
  viewpoint: 'agreeable' | 'neutral' | 'opposing';
  sentiment: 'positive' | 'controversial';
  virality: number;
  biasScore: number;
  trustScore: number;
  source: string;
  recommendationReason: string;
  tags: string[];
  timestamp?: number;
}

export interface BiasResult {
  type: string;
  explanation: string;
  example: string;
  suggestion: string;
  confidence: number;
}

export interface UserInteraction {
  contentId: string;
  action: 'view' | 'expand' | 'share' | 'dismiss';
  timestamp: number;
  sliderValues?: SliderValues;
}

export interface SliderValues {
  education: number;
  viewpoint: number;
  sentiment: number;
  recency: number;
}

export interface UserStats {
  totalViewed: number;
  avgBiasScore: number;
  avgTrustScore: number;
  contentDistribution: { educational: number; entertainment: number };
  viewpointExposure: { agreeable: number; neutral: number; opposing: number };
  sentimentData: Array<{ day: string; positive: number; controversial: number }>;
  echoChamberScore: number;
}

class DataStore {
  private interactions: UserInteraction[] = [];
  private biasAnalyses: Array<{ text: string; results: BiasResult[]; timestamp: number }> = [];
  
  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('openmind_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.interactions = data.interactions || [];
        this.biasAnalyses = data.biasAnalyses || [];
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('openmind_data', JSON.stringify({
        interactions: this.interactions,
        biasAnalyses: this.biasAnalyses,
      }));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  // Log user interaction
  logInteraction(interaction: Omit<UserInteraction, 'timestamp'>) {
    this.interactions.push({
      ...interaction,
      timestamp: Date.now(),
    });
    this.saveToStorage();
  }

  // Log bias analysis
  logBiasAnalysis(text: string, results: BiasResult[]) {
    this.biasAnalyses.push({
      text,
      results,
      timestamp: Date.now(),
    });
    this.saveToStorage();
  }

  // Get all interactions
  getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }

  // Get interactions for specific content
  getContentInteractions(contentId: string): UserInteraction[] {
    return this.interactions.filter(i => i.contentId === contentId);
  }

  // Calculate user statistics
  calculateStats(contentData: ContentItem[]): UserStats {
    const viewedContent = this.interactions
      .filter(i => i.action === 'view')
      .map(i => contentData.find(c => c.id === i.contentId))
      .filter(Boolean) as ContentItem[];

    if (viewedContent.length === 0) {
      return this.getDefaultStats();
    }

    // Content distribution
    const educational = viewedContent.filter(c => c.type === 'educational').length;
    const entertainment = viewedContent.filter(c => c.type === 'entertainment').length;
    const total = viewedContent.length;

    // Viewpoint exposure
    const agreeable = viewedContent.filter(c => c.viewpoint === 'agreeable').length;
    const neutral = viewedContent.filter(c => c.viewpoint === 'neutral').length;
    const opposing = viewedContent.filter(c => c.viewpoint === 'opposing').length;

    // Calculate echo chamber score (higher = more echo chamber)
    const agreeablePercent = (agreeable / total) * 100;
    const echoChamberScore = Math.min(100, agreeablePercent + (100 - ((opposing / total) * 100)));

    // Sentiment data (last 7 days)
    const sentimentData = this.calculateWeeklySentiment(viewedContent);

    // Average scores
    const avgBiasScore = viewedContent.reduce((sum, c) => sum + c.biasScore, 0) / total;
    const avgTrustScore = viewedContent.reduce((sum, c) => sum + c.trustScore, 0) / total;

    return {
      totalViewed: total,
      avgBiasScore: Math.round(avgBiasScore * 10) / 10,
      avgTrustScore: Math.round(avgTrustScore * 10) / 10,
      contentDistribution: {
        educational: Math.round((educational / total) * 100),
        entertainment: Math.round((entertainment / total) * 100),
      },
      viewpointExposure: {
        agreeable: Math.round((agreeable / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        opposing: Math.round((opposing / total) * 100),
      },
      sentimentData,
      echoChamberScore: Math.round(echoChamberScore),
    };
  }

  private calculateWeeklySentiment(content: ContentItem[]) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Filter interactions from last 7 days
    const recentInteractions = this.interactions.filter(
      i => i.timestamp >= weekAgo && i.action === 'view'
    );

    // Group by day
    const dataByDay = days.map((day, index) => {
      const dayStart = weekAgo + (index * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);

      const dayInteractions = recentInteractions.filter(
        i => i.timestamp >= dayStart && i.timestamp < dayEnd
      );

      const dayContent = dayInteractions
        .map(i => content.find(c => c.id === i.contentId))
        .filter(Boolean) as ContentItem[];

      const positive = dayContent.filter(c => c.sentiment === 'positive').length;
      const controversial = dayContent.filter(c => c.sentiment === 'controversial').length;

      return {
        day,
        positive,
        controversial,
      };
    });

    return dataByDay;
  }

  private getDefaultStats(): UserStats {
    return {
      totalViewed: 247,
      avgBiasScore: 2.4,
      avgTrustScore: 3.8,
      contentDistribution: { educational: 35, entertainment: 65 },
      viewpointExposure: { agreeable: 75, neutral: 15, opposing: 10 },
      sentimentData: [
        { day: 'Mon', positive: 12, controversial: 3 },
        { day: 'Tue', positive: 15, controversial: 5 },
        { day: 'Wed', positive: 8, controversial: 8 },
        { day: 'Thu', positive: 10, controversial: 6 },
        { day: 'Fri', positive: 14, controversial: 4 },
        { day: 'Sat', positive: 18, controversial: 2 },
        { day: 'Sun', positive: 16, controversial: 3 },
      ],
      echoChamberScore: 68,
    };
  }

  // Clear all data
  clearData() {
    this.interactions = [];
    this.biasAnalyses = [];
    this.saveToStorage();
  }

  // Get bias analysis history
  getBiasHistory(): Array<{ text: string; results: BiasResult[]; timestamp: number }> {
    return [...this.biasAnalyses].reverse();
  }
}

// Export singleton instance
export const dataStore = new DataStore();
