//app/components/FeedView.tsx
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ControlSliders, { SliderValues } from './ControlSliders';
import ContentCard from './ContentCard';
import contentData from '../../data/content-feed.json';
import { dataStore } from '../../services/dataStore';
import { aiService } from '../../services/aiService';
import type { ContentItem } from '../../services/dataStore';

export default function FeedView() {
  const [sliderValues, setSliderValues] = useState<SliderValues>({
    education: 50,
    viewpoint: 50,
    sentiment: 50,
    recency: 50,
  });

  // Log slider changes
  useEffect(() => {
    console.log('Feed preferences updated:', sliderValues);
  }, [sliderValues]);

  // Filter and rank content based on slider values
  const filteredContent = useMemo(() => {
    const scoredContent = (contentData as ContentItem[]).map(item => ({
      ...item,
      relevanceScore: aiService.calculateRelevanceScore(item, sliderValues),
    }));

    return scoredContent
      .filter(item => item.relevanceScore > 0.3)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 12); // Show top 12
  }, [sliderValues]);

  const handleContentView = (contentId: string) => {
    dataStore.logInteraction({
      contentId,
      action: 'view',
      sliderValues,
    });
  };

  const handleContentExpand = (contentId: string) => {
    dataStore.logInteraction({
      contentId,
      action: 'expand',
      sliderValues,
    });
  };

  const handleContentDismiss = (contentId: string) => {
    dataStore.logInteraction({
      contentId,
      action: 'dismiss',
      sliderValues,
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Sliders */}
      <ControlSliders values={sliderValues} onChange={setSliderValues} />

      {/* Feed Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-violet-600">{filteredContent.length}</span> pieces of content
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Personalized based on your preferences
            </p>
          </div>
          <button
            onClick={() => setSliderValues({ education: 50, viewpoint: 50, sentiment: 50, recency: 50 })}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onView={handleContentView}
              onExpand={handleContentExpand}
              onDismiss={handleContentDismiss}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center"
        >
          <p className="text-slate-600">
            No content matches your current preferences. Try adjusting the sliders above.
          </p>
        </motion.div>
      )}
    </div>
  );
}
