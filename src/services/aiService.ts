// AI service for bias detection and content analysis
// In production, this would call an actual LLM API (Gemma, OpenAI, etc.)

import biasTemplates from '../data/bias-templates.json';
import type { BiasResult } from './dataStore';

export class AIService {
  /**
   * Analyze text for cognitive biases
   * In production: would call LLM API with proper prompts
   */
  async analyzeBias(text: string): Promise<BiasResult[]> {
    // Simulate API latency
    await this.delay(1500);

    const detectedBiases: BiasResult[] = [];
    const lowercaseText = text.toLowerCase();

    // Advanced keyword matching with confidence scoring
    biasTemplates.forEach((template: any) => {
      const matchedKeywords = template.keywords.filter((keyword: string) =>
        lowercaseText.includes(keyword.toLowerCase())
      );

      if (matchedKeywords.length > 0 && detectedBiases.length < 3) {
        // Calculate confidence based on number of matched keywords
        const confidence = Math.min(95, 60 + (matchedKeywords.length * 15));

        detectedBiases.push({
          type: template.type,
          explanation: template.explanation,
          example: `In your text: "${this.extractRelevantSnippet(text, matchedKeywords[0])}"`,
          suggestion: template.suggestion,
          confidence,
        });
      }
    });

    // Additional heuristic checks
    this.checkForAbsoluteLanguage(text, detectedBiases);
    this.checkForEmotionalLanguage(text, detectedBiases);

    // If no biases detected, return balanced result
    if (detectedBiases.length === 0) {
      detectedBiases.push({
        type: 'Balanced Thinking',
        explanation: 'Your statement appears to be relatively balanced and doesn\'t show obvious cognitive biases.',
        example: 'You\'re presenting information without strong emotional language or absolute claims.',
        suggestion: 'Continue to seek diverse perspectives and remain open to evidence that challenges your views.',
        confidence: 85,
      });
    }

    return detectedBiases;
  }

  /**
   * Generate recommendation reason for content
   */
  generateRecommendation(
    content: any,
    userPreferences: any,
    userHistory: any[]
  ): string {
    const reasons: string[] = [];

    // Based on content type match
    if (userPreferences.education < 50 && content.type === 'entertainment') {
      reasons.push('matches your entertainment preferences');
    } else if (userPreferences.education > 50 && content.type === 'educational') {
      reasons.push('aligns with your learning interests');
    }

    // Based on virality
    if (content.virality > 80) {
      reasons.push('trending with high engagement');
    }

    // Based on viewpoint diversity
    const agreeableCount = userHistory.filter((h: any) => h.viewpoint === 'agreeable').length;
    if (agreeableCount > userHistory.length * 0.7 && content.viewpoint === 'opposing') {
      reasons.push('challenges your perspective to provide balance');
    }

    // Based on trust score
    if (content.trustScore >= 4) {
      reasons.push('from a reliable source');
    }

    // Based on tags
    const userTags = new Set(userHistory.flatMap((h: any) => h.tags || []));
    const matchingTags = content.tags?.filter((tag: string) => userTags.has(tag)) || [];
    if (matchingTags.length > 0) {
      reasons.push(`related to ${matchingTags[0]}`);
    }

    if (reasons.length === 0) {
      return 'Based on your general interests';
    }

    return 'Because it ' + reasons.slice(0, 2).join(' and ');
  }

  /**
   * Calculate content relevance score
   */
  calculateRelevanceScore(
    content: any,
    sliderValues: any
  ): number {
    let score = 0;

    // Education vs Entertainment (0 = educational preference, 100 = entertainment preference)
    if (content.type === 'educational') {
      score += (100 - sliderValues.education) / 25;
    } else {
      score += sliderValues.education / 25;
    }

    // Viewpoint (0 = agreeable, 50 = neutral, 100 = opposing)
    const viewpointScores: Record<string, number> = {
      'agreeable': 0,
      'neutral': 50,
      'opposing': 100,
    };
    const viewpointDiff = Math.abs(sliderValues.viewpoint - viewpointScores[content.viewpoint]);
    score += (100 - viewpointDiff) / 25;

    // Sentiment (0 = positive, 100 = controversial)
    if (content.sentiment === 'positive') {
      score += (100 - sliderValues.sentiment) / 25;
    } else {
      score += sliderValues.sentiment / 25;
    }

    // Recency vs Virality (0 = recent preference, 100 = viral preference)
    const viralityMatch = sliderValues.recency / 100;
    score += (content.virality / 100) * viralityMatch * 4;
    score += (1 - viralityMatch) * 2;

    return score / 4; // Normalize to 0-1
  }

  /**
   * Extract relevant snippet from text
   */
  private extractRelevantSnippet(text: string, keyword: string): string {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return text.substring(0, 100);

    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + keyword.length + 30);
    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * Check for absolute language
   */
  private checkForAbsoluteLanguage(text: string, biases: BiasResult[]) {
    const absoluteWords = ['always', 'never', 'all', 'none', 'every', 'no one', 'everyone'];
    const lowercaseText = text.toLowerCase();
    const found = absoluteWords.some(word => lowercaseText.includes(word));

    if (found && !biases.some(b => b.type === 'Hasty Generalization')) {
      biases.push({
        type: 'Hasty Generalization',
        explanation: 'Using absolute terms like "always," "never," or "all" often indicates overgeneralization from limited evidence.',
        example: 'Your use of absolute language suggests a broad claim that may not account for exceptions.',
        suggestion: 'Use more precise language: "some," "many," "often," "in this case." Avoid sweeping generalizations unless you have comprehensive evidence.',
        confidence: 75,
      });
    }
  }

  /**
   * Check for emotional language
   */
  private checkForEmotionalLanguage(text: string, biases: BiasResult[]) {
    const emotionalWords = ['feel', 'feeling', 'sense', 'gut', 'heart', 'believe'];
    const lowercaseText = text.toLowerCase();
    const found = emotionalWords.some(word => lowercaseText.includes(word));

    if (found && !biases.some(b => b.type === 'Emotional Reasoning')) {
      biases.push({
        type: 'Emotional Reasoning',
        explanation: 'Believing that something must be true because you feel strongly about it, rather than basing your belief on evidence or logic.',
        example: 'Your language suggests you\'re relying on feelings rather than objective evidence.',
        suggestion: 'Separate your emotional reaction from the facts. Ask: What objective evidence supports this, independent of how I feel?',
        confidence: 70,
      });
    }
  }

  /**
   * Simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const aiService = new AIService();
