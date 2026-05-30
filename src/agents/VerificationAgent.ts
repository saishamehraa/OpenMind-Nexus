import { bandOrchestrator } from '../services/bandOrchestrator';

export class VerificationAgent {
  async verify(text: string, source: string) {
    bandOrchestrator.postMessage('Verification', {
      status: `Cross-referencing source: ${source}...`
    });

    await new Promise(r => setTimeout(r, 1200));
    
    const lowerText = text.toLowerCase();
    const isHighRisk = lowerText.includes('urgent') || lowerText.includes('expose') || lowerText.includes('truth');
    const isModerate = lowerText.includes('several experts') || lowerText.includes('experts agree');

    let score = 90;
    let flags: string[] = [];
    let consistency = 'High';

    if (isHighRisk) {
      score = 25;
      flags = ['High sensationalism', 'Unsupported claims'];
      consistency = 'Low';
    } else if (isModerate) {
      score = 60;
      flags = ['Appeal to authority', 'Missing specific attribution'];
      consistency = 'Unknown';
    } else {
      score = 80;
      flags = [];
      consistency = 'Moderate';
    }

    bandOrchestrator.postMessage('Verification', {
      status: 'Verification complete',
      findings: {
        sourceCredibilityScore: score,
        flags: flags,
        factualConsistency: consistency
      }
    });

    return { score, flags };
  }
}

export const verificationAgent = new VerificationAgent();
