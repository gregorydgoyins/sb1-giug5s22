import React, { useState } from 'react';
import { GraduationCap, BookOpen, TrendingUp, Users, Award, Clock, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from './common/Breadcrumbs';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  completed: boolean;
  category: string;
  lessons: number;
}

const mockLearningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Comic Market Fundamentals',
    description: 'Learn the basics of comic book market mechanics, pricing, and trading principles',
    duration: '45 min',
    difficulty: 'Beginner',
    progress: 75,
    completed: false,
    category: 'Basics',
    lessons: 8
  },
  {
    id: '2',
    title: 'Understanding Comic Ages',
    description: 'Master the classification system from Golden Age to Modern Age comics',
    duration: '30 min',
    difficulty: 'Beginner',
    progress: 100,
    completed: true,
    category: 'Basics',
    lessons: 6
  },
  {
    id: '3',
    title: 'Grading and Valuation',
    description: 'Deep dive into CGC grading, condition assessment, and market valuation',
    duration: '60 min',
    difficulty: 'Intermediate',
    progress: 40,
    completed: false,
    category: 'Valuation',
    lessons: 10
  },
  {
    id: '4',
    title: 'Options Trading Strategies',
    description: 'Advanced options trading techniques for comic book investments',
    duration: '90 min',
    difficulty: 'Advanced',
    progress: 0,
    completed: false,
    category: 'Trading',
    lessons: 12
  },
  {
    id: '5',
    title: 'Creator Bond Analysis',
    description: 'Evaluate creator performance and bond investment opportunities',
    duration: '50 min',
    difficulty: 'Intermediate',
    progress: 60,
    completed: false,
    category: 'Analysis',
    lessons: 9
  },
  {
    id: '6',
    title: 'Portfolio Management',
    description: 'Build and manage diversified comic book investment portfolios',
    duration: '75 min',
    difficulty: 'Advanced',
    progress: 20,
    completed: false,
    category: 'Portfolio',
    lessons: 11
  }
];

const achievements = [
  { id: '1', title: 'First Steps', description: 'Complete your first learning module', earned: true },
  { id: '2', title: 'Market Scholar', description: 'Complete all basic modules', earned: true },
  { id: '3', title: 'Trading Expert', description: 'Master advanced trading strategies', earned: false },
  { id: '4', title: 'Portfolio Master', description: 'Complete portfolio management course', earned: false }
];

export function Learn() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const categories = ['All', 'Basics', 'Valuation', 'Trading', 'Analysis', 'Portfolio'];
  
  const filteredModules = selectedCategory === 'All' 
    ? mockLearningModules 
    : mockLearningModules.filter(module => module.category === selectedCategory);

  const totalProgress = Math.round(
    mockLearningModules.reduce((sum, module) => sum + module.progress, 0) / mockLearningModules.length
  );

  const completedModules = mockLearningModules.filter(module => module.completed).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Intermediate': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Advanced': return 'bg-red-900/50 text-red-200 border-red-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Learning Center</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Award className="h-5 w-5" />
          <span className="text-sm">Track your progress and earn rewards</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="h-6 w-6 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-slate-700 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
            <span className="text-white font-bold">{totalProgress}%</span>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-white">{completedModules}/{mockLearningModules.length}</p>
          <p className="text-sm text-gray-400">Modules finished</p>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Time Invested</h3>
          </div>
          <p className="text-2xl font-bold text-white">4.5h</p>
          <p className="text-sm text-gray-400">Learning time</p>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>
          <p className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
          <p className="text-sm text-gray-400">Badges earned</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div 
            key={module.id}
            onClick={() => setSelectedCard(selectedCard === module.id ? null : module.id)}
            className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer
              ${selectedCard === module.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{module.description}</p>
              </div>
              {module.completed && (
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration}</span>
                </span>
                <span>{module.lessons} lessons</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white font-medium">{module.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    module.completed ? 'bg-green-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                module.completed 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : module.progress > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
                <Play className="h-4 w-4" />
                <span>
                  {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start Learning'}
                </span>
              </button>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all ${
                achievement.earned 
                  ? 'bg-purple-900/30 border-purple-700/30' 
                  : 'bg-slate-700/50 border-slate-600/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Award className={`h-6 w-6 ${
                  achievement.earned ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <h3 className={`font-semibold ${
                  achievement.earned ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h3>
              </div>
              <p className={`text-sm ${
                achievement.earned ? 'text-purple-200' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">New to Panel Profits?</h2>
            <p className="text-white/90 mb-4">
              Start with our comprehensive beginner's guide to comic book investing and trading.
            </p>
            <Link 
              to="/learn/getting-started"
              className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Start Your Journey</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <Users className="h-24 w-24 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}