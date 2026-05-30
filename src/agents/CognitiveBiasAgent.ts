import { bandOrchestrator } from '../services/bandOrchestrator';
import { aiService } from '../services/aiService';

export class CognitiveBiasAgent {
  async analyze(text: string) {
    bandOrchestrator.postMessage('Cognitive Bias', {
      status: 'Scanning for manipulation patterns...'
    });

    // Use existing AI service logic
    const biases = await aiService.analyzeBias(text);
    
    bandOrchestrator.postMessage('Cognitive Bias', {
      status: 'Bias analysis complete',
      findings: {
        biasesDetected: biases.length,
        details: biases
      }
    });

    return biases;
  }
}

export const cognitiveBiasAgent = new CognitiveBiasAgent();
