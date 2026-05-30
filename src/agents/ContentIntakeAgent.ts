import { bandOrchestrator } from '../services/bandOrchestrator';

export class ContentIntakeAgent {
  async processContent(rawText: string, metadata: any) {
    bandOrchestrator.postMessage('Content Intake', {
      status: 'Analyzing input...',
      textLength: rawText.length
    });

    // Simulate analysis time
    await new Promise(r => setTimeout(r, 1000));
    
    const lowerText = rawText.toLowerCase();
    const isHighRisk = lowerText.includes('urgent') || lowerText.includes('expose') || lowerText.includes('truth');
    const isModerate = lowerText.includes('disaster') || lowerText.includes('experts agree');

    const dynamicTopic = isHighRisk ? 'conspiracy' : (isModerate ? 'politics' : 'finance');
    const dynamicSentiment = isHighRisk ? 'Highly Suspicious' : (isModerate ? 'Polarizing' : 'Neutral');

    const extraction = {
      text: rawText,
      topic: metadata?.topic !== 'Unknown' ? metadata.topic : dynamicTopic,
      source: metadata?.source || 'Anonymous',
      sentiment: dynamicSentiment,
      viralityScore: isHighRisk ? 92 : (isModerate ? 65 : 12)
    };

    bandOrchestrator.postMessage('Content Intake', {
      status: 'Intake complete',
      findings: extraction
    });

    return extraction;
  }
}

export const contentIntakeAgent = new ContentIntakeAgent();
