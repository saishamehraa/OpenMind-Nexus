//app/components/InsightsView.tsx
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, AlertCircle, Eye, Target, RefreshCw } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import contentData from '../../data/content-feed.json';
import type { UserStats } from '../../services/dataStore';

export default function InsightsView() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const calculatedStats = dataStore.calculateStats(contentData as any);
      setStats(calculatedStats);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your insights...</p>
        </div>
      </div>
    );
  }

  const contentDistribution = [
    { name: 'Educational', value: stats.contentDistribution.educational, color: '#3b82f6' },
    { name: 'Entertainment', value: stats.contentDistribution.entertainment, color: '#ec4899' },
  ];

  const viewpointExposure = [
    { name: 'Agreeable', value: stats.viewpointExposure.agreeable, color: '#10b981' },
    { name: 'Neutral', value: stats.viewpointExposure.neutral, color: '#f59e0b' },
    { name: 'Opposing', value: stats.viewpointExposure.opposing, color: '#ef4444' },
  ];

  const biasScore = stats.echoChamberScore;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">Your Content Insights</h1>
            </div>
            <p className="text-violet-100">
              Discover patterns in your content consumption and break free from your filter bubble.
            </p>
          </div>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Echo Chamber Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl shadow-sm border-2 p-6 ${
          biasScore > 70 ? 'bg-red-50 border-red-200' : biasScore > 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            biasScore > 70 ? 'bg-red-100' : biasScore > 50 ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <AlertCircle className={`w-6 h-6 ${
              biasScore > 70 ? 'text-red-600' : biasScore > 50 ? 'text-yellow-600' : 'text-green-600'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-lg mb-2 ${
              biasScore > 70 ? 'text-red-900' : biasScore > 50 ? 'text-yellow-900' : 'text-green-900'
            }`}>
              {biasScore > 70 ? '⚠️ Echo Chamber Detected' : biasScore > 50 ? '⚡ Moderate Filter Bubble' : '✓ Diverse Content Exposure'}
            </h3>
            <p className={`text-sm mb-3 ${
              biasScore > 70 ? 'text-red-700' : biasScore > 50 ? 'text-yellow-700' : 'text-green-700'
            }`}>
              {biasScore > 70 
                ? `You're seeing ${stats.viewpointExposure.agreeable}% reinforcing content. Your feed is heavily biased toward your existing views.`
                : biasScore > 50
                ? 'Your content has some diversity, but there\'s room for more varied perspectives.'
                : 'Great job! You\'re consuming a balanced mix of perspectives.'}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    biasScore > 70 ? 'bg-red-500' : biasScore > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${biasScore}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${
                biasScore > 70 ? 'text-red-700' : biasScore > 50 ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {biasScore}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Content Viewed</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalViewed}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Total interactions logged</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg. Bias Score</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgBiasScore}/5</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Lower is better</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg. Trust Score</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgTrustScore}/5</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Higher is better</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="font-semibold text-lg text-slate-900 mb-4">Content Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={contentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 text-center mt-2">
            {stats.contentDistribution.entertainment > stats.contentDistribution.educational
              ? 'You prefer entertainment over educational content'
              : 'You prefer educational over entertainment content'}
          </p>
        </motion.div>

        {/* Viewpoint Exposure */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="font-semibold text-lg text-slate-900 mb-4">Viewpoint Exposure</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={viewpointExposure}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {viewpointExposure.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 text-center mt-2">
            {stats.viewpointExposure.agreeable > 60
              ? `⚠️ ${stats.viewpointExposure.agreeable}% of content reinforces your existing views`
              : '✓ Balanced viewpoint exposure'}
          </p>
        </motion.div>
      </div>

      {/* Sentiment Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
      >
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Content Sentiment This Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.sentimentData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" fill="#10b981" name="Positive" />
            <Bar dataKey="controversial" fill="#ef4444" name="Controversial" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 text-center mt-2">
          Daily content consumption patterns
        </p>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
      >
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Recommendations to Break Your Bubble</h3>
        <div className="space-y-3">
          {stats.viewpointExposure.opposing < 20 && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-medium text-sm text-slate-900">Increase Opposing Views</p>
                <p className="text-xs text-slate-600">Try moving the "Opposing Views" slider to at least 60% to see different perspectives.</p>
              </div>
            </div>
          )}
          {stats.contentDistribution.educational < 40 && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="text-xl">📚</span>
              <div>
                <p className="font-medium text-sm text-slate-900">Balance Education vs Entertainment</p>
                <p className="text-xs text-slate-600">Consider adding more educational content to your mix for deeper understanding.</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-xl">🔍</span>
            <div>
              <p className="font-medium text-sm text-slate-900">Check Your Biases</p>
              <p className="text-xs text-slate-600">Use the Bias Detector regularly to identify cognitive biases in your thinking.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
