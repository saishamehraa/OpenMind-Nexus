import { motion } from 'motion/react';
import { AlertCircle, Eye, Share2, X, Shield, Loader2 } from 'lucide-react';
import { useState, useEffect, forwardRef } from 'react';
import type { ContentItem } from '../../services/dataStore';

interface ContentCardProps {
  item: ContentItem;
  onView?: (id: string) => void;
  onExpand?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default forwardRef<HTMLDivElement, ContentCardProps>(function ContentCard({ item, onView, onExpand, onDismiss }: ContentCardProps, ref) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // New States for De-Polarize feature
  const [isDepolarizing, setIsDepolarizing] = useState(false);
  const [depolarizedText, setDepolarizedText] = useState<string | null>(null);

  useEffect(() => {
    onView?.(item.id);
  }, [item.id]);

  const handleDepolarize = () => {
    setIsDepolarizing(true);
    
    // Smart Mock Data for the Demo
    const depolarizedDatabase: Record<string, string> = {
      // The Renewable Energy Article (ID: 10)
      "10": "Extracted Facts: Renewable energy infrastructure requires material mining | Wind and solar components require specific disposal methods | Environmental impacts exist beyond carbon emissions.",
      
      // The Political Echo Chamber Article (ID: 3)
      "3": "Extracted Facts: Media consumption often aligns with pre-existing beliefs | Information silos occur across various demographics | Exposure to diverse viewpoints is statistically low.",
      
      // The Celebrity Gossip Article (ID: 5)
      "5": "Extracted Facts: Two public figures have separated | The announcement was made via social media | Public engagement metrics are high.",
      
      // The Default Fallback (Just in case you click a different one)
      "default": "Extracted Facts: Subject identified | Emotional framing removed | Statement reduced to verifiable actions."
    };

    setTimeout(() => {
      // Look up the specific facts for this article, or use the default
      const fact = depolarizedDatabase[item.id] || depolarizedDatabase["default"];
      setDepolarizedText(fact);
      setIsDepolarizing(false);
    }, 1500);
  };

  const renderScore = (score: number, max: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < score ? 'bg-violet-500' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

 const getBiasLabel = (score: number) => {
    if (score <= 2) return { text: 'Low Bias', color: 'text-green-700', bg: 'bg-green-50' };
    if (score <= 3) return { text: 'Moderate Bias', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    return { text: 'High Bias', color: 'text-red-700', bg: 'bg-red-50' };
  };

  const getTrustLabel = (score: number) => {
    if (score >= 4) return { text: 'High Trust', color: 'text-green-700', bg: 'bg-green-50' };
    if (score >= 3) return { text: 'Moderate Trust', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    return { text: 'Low Trust', color: 'text-red-700', bg: 'bg-red-50' };
  };

  if (dismissed) return null;

  const biasInfo = getBiasLabel(item.biasScore);
  const trustInfo = getTrustLabel(item.trustScore);

  return (
    <motion.div
    ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.type === 'educational' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
          }`}>
            {item.type === 'educational' ? '📚 Educational' : '🎬 Entertainment'}
          </span>
          <span className="text-xs text-slate-500">{item.source}</span>
        </div>

        <h3 className="font-semibold text-lg text-slate-900 mb-2">
          {item.title}
        </h3>
        
        {/* EXCERPT WITH DE-POLARIZE EFFECT */}
        <div className="relative mb-4">
          <p className={`text-sm transition-all duration-500 ${depolarizedText ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
            {item.excerpt}
          </p>
          
          {depolarizedText && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium"
            >
              🛡️ {depolarizedText}
            </motion.div>
          )}
        </div>

        <div className="bg-violet-50 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-violet-900 mb-1">Why you're seeing this:</p>
              <p className="text-xs text-violet-700">{item.recommendationReason}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${biasInfo.bg}`}>
            <span className={`text-xs font-medium ${biasInfo.color}`}>{biasInfo.text}</span>
            {renderScore(item.biasScore)}
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${trustInfo.bg}`}>
            <span className={`text-xs font-medium ${trustInfo.color}`}>{trustInfo.text}</span>
            {renderScore(item.trustScore)}
          </div>
        </div>

{/* Expanded Details */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 pt-4 mb-4 space-y-3 overflow-hidden"
          >
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">Algorithm X-Ray (Viewpoint):</p>
              <p className="text-sm text-slate-600 capitalize">{item.viewpoint}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">Content Sentiment:</p>
              <p className="text-sm text-slate-600 capitalize">{item.sentiment}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">Virality Score:</p>
              <p className="text-sm text-slate-600">{item.virality}/100</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {/* DE-POLARIZE BUTTON */}
          {!depolarizedText && item.biasScore >= 3 && (
            <button 
              onClick={handleDepolarize}
              disabled={isDepolarizing}
              className="w-full py-2 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isDepolarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {isDepolarizing ? 'Extracting Facts...' : 'De-Polarize Content'}
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {expanded ? <><X className="w-4 h-4" /> Hide Details</> : <><AlertCircle className="w-4 h-4" /> View Analysis</>}
            </button>
            <button onClick={() => setDismissed(true)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});