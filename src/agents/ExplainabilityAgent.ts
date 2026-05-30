import { bandOrchestrator } from '../services/bandOrchestrator';

export class ExplainabilityAgent {
  async generateSummary(biases: any[], verification: any, echoRisk: number) {
    bandOrchestrator.postMessage('Explainability', {
      status: 'Synthesizing reasoning chain...'
    });

    await new Promise(r => setTimeout(r, 1000));
    
    let reasoning = '';
    let recommendation = 'ARCHIVE';
    let riskLevel = 'Low Risk Content';
    
    // Filter out the 'Balanced Thinking' placeholder
    const actualBiases = biases.filter(b => b.type !== 'Balanced Thinking');
    
    // High Risk
    if (actualBiases.length >= 3 || verification.score <= 35 || echoRisk >= 75) {
      reasoning = `This content was flagged because it uses multiple cognitive biases (${actualBiases.length}). `;
      if (verification.score <= 35) reasoning += `The source has very low credibility (Score: ${verification.score}). `;
      if (echoRisk >= 75) reasoning += `It carries a severe polarization risk (${echoRisk}%). `;
      recommendation = 'ESCALATE';
      riskLevel = 'High Risk Detected';
    } 
    // Medium Risk
    else if (actualBiases.length >= 1 || verification.score <= 65 || echoRisk >= 40) {
      reasoning = `This content contains subtle indicators of bias. `;
      if (verification.score <= 65) reasoning += `The credibility is questionable (Score: ${verification.score}). `;
      recommendation = 'MONITOR';
      riskLevel = 'Medium Risk Detected';
    } 
    // Low Risk
    else {
      reasoning = `This content appears to be factual and balanced. The source credibility is strong (Score: ${verification.score}) with no significant biases detected.`;
      recommendation = 'ARCHIVE';
      riskLevel = 'Low Risk Content';
    }

    bandOrchestrator.postMessage('Explainability', {
      status: 'Synthesis complete',
      findings: {
        summary: reasoning,
        recommendation: recommendation,
        transparencyTrace: 'Available'
      }
    });

    return { reasoning, recommendation, riskLevel };
  }
}

export const explainabilityAgent = new ExplainabilityAgent();
