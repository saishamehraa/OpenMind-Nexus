import { contentIntakeAgent } from '../agents/ContentIntakeAgent';
import { cognitiveBiasAgent } from '../agents/CognitiveBiasAgent';
import { verificationAgent } from '../agents/VerificationAgent';
import { echoChamberAgent } from '../agents/EchoChamberAgent';
import { explainabilityAgent } from '../agents/ExplainabilityAgent';
import { bandOrchestrator } from './bandOrchestrator';

export const runFullAnalysisWorkflow = async (rawText: string, metadata: any) => {
  bandOrchestrator.clearRoom();
  bandOrchestrator.postMessage('Orchestrator', { status: 'Initiating full cognitive risk analysis...' });

  const intake = await contentIntakeAgent.processContent(rawText, metadata);
  const biases = await cognitiveBiasAgent.analyze(intake.text);
  const verification = await verificationAgent.verify(intake.text, intake.source);
  const echoRisk = await echoChamberAgent.calculateRisk(intake.topic, intake.sentiment);
  
  const finalSummary = await explainabilityAgent.generateSummary(biases, verification, echoRisk);

  bandOrchestrator.postMessage('Orchestrator', { 
    status: 'Analysis complete. Waiting for human review.',
    finalDecisionRequired: true,
    recommendation: finalSummary.escalation ? 'ESCALATE' : 'ARCHIVE'
  });

  return finalSummary;
};
