//app/components/BiasDetector.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { dataStore } from '../../services/dataStore';
import type { BiasResult } from '../../services/dataStore';

export default function BiasDetector() {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<BiasResult[]>([]);

  const analyzeBias = async () => {
    if (!inputText.trim()) return;

    setAnalyzing(true);

    try {
      const detectedBiases = await aiService.analyzeBias(inputText);
      setResults(detectedBiases);
      
      // Log to data store
      dataStore.logBiasAnalysis(inputText, detectedBiases);
    } catch (error) {
      console.error('Bias analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const examplePrompts = [
    "All scientists agree that this is the only solution.",
    "Everyone knows this is true, it's just common sense.",
    "I saw it on the news recently, so it must be happening everywhere.",
    "Either you're with us or against us - there's no middle ground.",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">Cognitive Bias Detector</h1>
        </div>
        <p className="text-violet-100">
          Check your thinking for hidden biases. Our AI analyzes your text for cognitive distortions
          and logical fallacies.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block mb-3">
          <span className="font-medium text-slate-900">Enter your opinion or argument:</span>
          <span className="text-sm text-slate-500 ml-2">
            Be specific and include your reasoning
          </span>
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">
            {inputText.length} characters
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setInputText('')}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={analyzeBias}
              disabled={!inputText.trim() || analyzing}
              className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      {results.length === 0 && !analyzing && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="font-medium text-slate-900 mb-3">Try these examples:</p>
          <div className="space-y-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputText(prompt)}
                className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-12"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
              <p className="text-slate-600">Analyzing your text for cognitive biases...</p>
            </div>
          </motion.div>
        )}

        {!analyzing && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-900">
                Analysis Results
              </h2>
              <button
                onClick={() => setResults([])}
                className="text-sm text-violet-600 hover:text-violet-700"
              >
                Clear Results
              </button>
            </div>

            {results.map((bias, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                  bias.type === 'Balanced Thinking'
                    ? 'border-green-200'
                    : 'border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    bias.type === 'Balanced Thinking'
                      ? 'bg-green-100'
                      : 'bg-amber-100'
                  }`}>
                    {bias.type === 'Balanced Thinking' ? (
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-lg ${
                        bias.type === 'Balanced Thinking'
                          ? 'text-green-900'
                          : 'text-amber-900'
                      }`}>
                        {bias.type === 'Balanced Thinking' ? '✓ ' : '⚠️  '}
                        {bias.type}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                        {bias.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">{bias.explanation}</p>

                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Example from your text:
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        {bias.example}
                      </p>
                    </div>

                    <div className="flex items-start gap-2 bg-violet-50 rounded-lg p-3">
                      <Lightbulb className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-violet-900 mb-1">
                          Suggestion:
                        </p>
                        <p className="text-sm text-violet-700">
                          {bias.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
