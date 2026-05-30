import { bandOrchestrator } from '../services/bandOrchestrator';

export class ExplainabilityAgent {
  async generateSummary(biases: any[], verification: any, echoRisk: number) {
    bandOrchestrator.postMessage('Explainability', {
      status: 'Synthesizing reasoning chain...'
    });

    await new Promise(r => setTimeout(r, 1000));
    
    let reasoning = 'This content appears to be low risk.';
    let escalation = false;
    
    if (biases.length > 0 || verification.score < 50 || echoRisk > 75) {
      reasoning = `This content was flagged because it uses ${biases.length} cognitive biases. `;
      if (verification.score < 50) reasoning += `The source has low credibility (Score: ${verification.score}). `;
      if (echoRisk > 75) reasoning += `It has a high polarization risk (${echoRisk}%).`;
      escalation = true;
    }

    bandOrchestrator.postMessage('Explainability', {
      status: 'Synthesis complete',
      findings: {
        summary: reasoning,
        escalationRecommended: escalation,
        transparencyTrace: 'Available'
      }
    });

    return { reasoning, escalation };
  }
}

export const explainabilityAgent = new ExplainabilityAgent();
