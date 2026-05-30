import { bandOrchestrator } from '../services/bandOrchestrator';

export class EchoChamberAgent {
  async calculateRisk(topic: string, sentiment: string) {
    bandOrchestrator.postMessage('Echo Chamber', {
      status: 'Calculating polarization risk metrics...'
    });

    await new Promise(r => setTimeout(r, 1500));
    
    // Simulated risk logic based on topic/sentiment
    const isHighRisk = ['conspiracy', 'scandal', 'vaccine'].some(t => topic.toLowerCase().includes(t));
    const isMediumRisk = ['politics', 'election'].some(t => topic.toLowerCase().includes(t));
    
    const riskScore = isHighRisk ? 88 : (isMediumRisk ? 55 : 15);

    bandOrchestrator.postMessage('Echo Chamber', {
      status: 'Polarization risk calculated',
      findings: {
        polarizationRiskScore: riskScore,
        reinforcementRisk: isHighRisk ? 'High' : (isMediumRisk ? 'Medium' : 'Low'),
        audienceSusceptibility: isHighRisk ? 'Elevated' : (isMediumRisk ? 'Moderate' : 'Normal')
      }
    });

    return riskScore;
  }
}

export const echoChamberAgent = new EchoChamberAgent();
