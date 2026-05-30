//app/components/HomePage.tsx
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Brain, Sliders, TrendingUp, Eye, Shield, Target } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Sliders,
      title: 'User-Controlled Feed',
      description: 'Adjust sliders to control your content diet. Choose between educational vs entertainment, agreeable vs opposing views.',
      link: '/feed',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Transparency Layer',
      description: 'Every content item shows bias scores, trust ratings, and explains why it was recommended to you.',
      link: '/feed',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Brain,
      title: 'Bias Detection',
      description: 'Input your opinions and discover hidden cognitive biases. Get suggestions to think more critically.',
      link: '/bias-check',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: TrendingUp,
      title: 'Content Insights',
      description: 'Visualize your consumption patterns. See if you\'re in an echo chamber and get recommendations to break free.',
      link: '/insights',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const stats = [
    { label: 'Transparency', value: '100%', icon: Eye },
    { label: 'User Control', value: 'Full', icon: Target },
    { label: 'Bias Detection', value: 'AI-Powered', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">OpenMind</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            A user-controlled reality layer that makes the digital environment open, transparent, 
            and free from algorithmic manipulation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/feed"
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Explore Feed
            </Link>
            <Link
              to="/bias-check"
              className="px-8 py-3 bg-white text-slate-700 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Check Your Bias
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-lg mb-3">
                <stat.icon className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link to={feature.link}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow h-full group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-violet-600 font-medium group-hover:gap-3 transition-all">
                    Try it now
                    <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg p-8 md:p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-violet-100 mb-6">
            In a world where algorithms decide what you see, we believe you should be in control. 
            OpenMind empowers you to understand the invisible forces shaping your digital reality 
            and gives you the tools to break free from echo chambers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">🔓 Open</h3>
              <p className="text-sm text-violet-100">All algorithms and scoring mechanisms are transparent and explainable.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">🎯 User-Controlled</h3>
              <p className="text-sm text-violet-100">You decide what you want to see. No hidden manipulation.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">🧠 Bias-Aware</h3>
              <p className="text-sm text-violet-100">Tools to identify and overcome cognitive biases in real-time.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
