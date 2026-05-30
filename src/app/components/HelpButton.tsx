//app/components/HelpButton.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X } from 'lucide-react';

export default function HelpButton() {
  const [showTips, setShowTips] = useState(false);

  const tips = [
    {
      title: "Try the Sliders",
      description: "Move the sliders on the Feed page to instantly change what content you see. Watch how your feed transforms in real-time!",
    },
    {
      title: "Check Content Details",
      description: "Click 'View Analysis' on any content card to see detailed transparency information including viewpoint, sentiment, and tags.",
    },
    {
      title: "Test Bias Detection",
      description: "Go to Bias Check and try the example prompts, or write your own opinion to see what cognitive biases might be lurking in your thinking.",
    },
    {
      title: "Explore Your Patterns",
      description: "Visit Insights to see visualizations of your content consumption patterns and discover if you're in an echo chamber.",
    },
  ];

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTips(!showTips)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
      >
        {showTips ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </motion.button>

      {/* Tips Panel */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-40 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white">
              <h3 className="font-semibold text-lg">Quick Tips</h3>
              <p className="text-sm text-violet-100">Get the most out of OpenMind</p>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-lg p-3"
                >
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">
                    {index + 1}. {tip.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {tip.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
