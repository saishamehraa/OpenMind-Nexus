import React, { useState, useEffect } from 'react';
import { bandOrchestrator, BandMessage } from '../../services/bandOrchestrator';
import { runFullAnalysisWorkflow } from '../../services/orchestrationFlow';
import { Shield, Activity, Users, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function OrchestrationDashboard() {
  const [messages, setMessages] = useState<BandMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = bandOrchestrator.subscribe((newMessages) => {
      setMessages([...newMessages]);
    });
    return unsubscribe;
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setSummary(null);
    try {
      const result = await runFullAnalysisWorkflow(inputText, { source: 'User Submission', topic: 'Unknown' });
      setSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAction = (action: string) => {
    alert(`[Audit Log] Action recorded: ${action}\n\nThis would normally trigger a Band webhook to downstream security systems.`);
    setSummary(null);
    setInputText('');
    bandOrchestrator.clearRoom();
  };

  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'Content Intake': return <Database className="w-5 h-5 text-blue-500" />;
      case 'Cognitive Bias': return <Activity className="w-5 h-5 text-purple-500" />;
      case 'Verification': return <Shield className="w-5 h-5 text-green-500" />;
      case 'Echo Chamber': return <Users className="w-5 h-5 text-orange-500" />;
      case 'Explainability': return <CheckCircle className="w-5 h-5 text-teal-500" />;
      case 'Orchestrator': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">OpenMind Nexus: Multi-Agent Orchestration</h2>
        <p className="text-slate-600 mb-6">Enter content to simulate a high-stakes enterprise cognitive risk analysis workflow.</p>
        
        <textarea
          className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none mb-4"
          placeholder="Paste an article snippet, social media post, or suspicious message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isAnalyzing}
        />
        
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !inputText.trim()}
          className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Agents Collaborating...' : 'Start Multi-Agent Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden flex flex-col h-[600px]">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" /> Live Band Room
            </h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
              Secure Channel
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
            {messages.length === 0 ? (
              <div className="text-slate-500 text-center mt-10">Waiting for activity...</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    {getAgentIcon(msg.agentRole)}
                    <span className="text-violet-300 font-bold">{msg.agentRole}</span>
                    <span className="text-slate-500 text-xs ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-slate-300 pl-8">
                    <div className="mb-2 text-white">{msg.content.status}</div>
                    {msg.content.findings && (
                      <pre className="bg-slate-950 p-3 rounded text-green-400 overflow-x-auto text-xs mt-2 border border-slate-800">
                        {JSON.stringify(msg.content.findings, null, 2)}
                      </pre>
                    )}
                    {msg.content.recommendation && (
                      <div className={`mt-3 p-2 rounded text-center font-bold ${msg.content.recommendation === 'ESCALATE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        RECOMMENDATION: {msg.content.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[600px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-4">Human Oversight Panel</h3>
            
            <div className="flex-1 overflow-y-auto">
              {!summary ? (
                <div className="text-slate-500 text-center mt-10 flex flex-col items-center gap-3">
                  <Shield className="w-12 h-12 text-slate-200" />
                  <p>Awaiting final agent consensus...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg border ${summary.escalation ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <h4 className={`font-bold mb-2 flex items-center gap-2 ${summary.escalation ? 'text-red-700' : 'text-green-700'}`}>
                      {summary.escalation ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      Status: {summary.escalation ? 'High Risk Detected' : 'Low Risk Content'}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {summary.reasoning}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Required Actions</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleAction('ESCALATE TO SECURITY TEAM')}
                        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Escalate to Security Team
                      </button>
                      <button 
                        onClick={() => handleAction('ARCHIVE & IGNORE')}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                        Archive & Ignore
                      </button>
                      <button 
                        onClick={() => handleAction('ADD TO WATCHLIST')}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                        Add to Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
