import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

// Type definitions for component props
interface MarketSentimentGaugeProps {
  /** Current sentiment value between -1.0 (very negative) and 1.0 (very positive) */
  sentiment: number;
  /** Confidence level of the sentiment analysis (0.0 to 1.0) */
  confidence: number;
  /** Optional label for the gauge */
  label?: string;
  /** Size variant of the gauge */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the numerical value */
  showValue?: boolean;
  /** Whether to animate changes */
  animated?: boolean;
  /** Callback when sentiment changes significantly */
  onSentimentChange?: (sentiment: number, confidence: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the component is in a loading state */
  loading?: boolean;
  /** Error state message */
  error?: string;
  /** Historical sentiment data for trend indication */
  previousSentiment?: number;
}

// Internal interfaces for component state
interface SentimentLevel {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

// Sentiment level configuration
const SENTIMENT_LEVELS: SentimentLevel[] = [
  {
    min: -1.0,
    max: -0.6,
    label: 'Very Negative',
    color: '#EF4444',
    bgColor: 'bg-red-900/30',
    textColor: 'text-red-400'
  },
  {
    min: -0.6,
    max: -0.2,
    label: 'Negative',
    color: '#F87171',
    bgColor: 'bg-red-900/20',
    textColor: 'text-red-300'
  },
  {
    min: -0.2,
    max: 0.2,
    label: 'Neutral',
    color: '#6B7280',
    bgColor: 'bg-gray-900/30',
    textColor: 'text-gray-400'
  },
  {
    min: 0.2,
    max: 0.6,
    label: 'Positive',
    color: '#34D399',
    bgColor: 'bg-green-900/20',
    textColor: 'text-green-300'
  },
  {
    min: 0.6,
    max: 1.0,
    label: 'Very Positive',
    color: '#10B981',
    bgColor: 'bg-green-900/30',
    textColor: 'text-green-400'
  }
];

/**
 * MarketSentimentGauge - A reusable component for displaying market sentiment
 * 
 * This component provides a visual representation of market sentiment using a
 * circular gauge with color-coded levels. It includes animations, accessibility
 * features, and responsive design.
 * 
 * Key features:
 * - Animated transitions between sentiment levels
 * - Accessibility support with ARIA labels and keyboard navigation
 * - Responsive design with multiple size variants
 * - Error handling and loading states
 * - Trend indicators showing sentiment direction
 */
export function MarketSentimentGauge({
  sentiment,
  confidence,
  label = 'Market Sentiment',
  size = 'medium',
  showValue = true,
  animated = true,
  onSentimentChange,
  className = '',
  loading = false,
  error,
  previousSentiment
}: MarketSentimentGaugeProps) {
  // State for managing animations and interactions
  const [displaySentiment, setDisplaySentiment] = useState(sentiment);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const previousSentimentRef = useRef(sentiment);
  const animationRef = useRef<number>();

  // Size configuration
  const sizeConfig = {
    small: { radius: 40, strokeWidth: 6, fontSize: 'text-sm' },
    medium: { radius: 60, strokeWidth: 8, fontSize: 'text-base' },
    large: { radius: 80, strokeWidth: 10, fontSize: 'text-lg' }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;

  // Validate sentiment value and clamp to valid range
  const clampedSentiment = Math.max(-1, Math.min(1, sentiment));
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  // Get current sentiment level configuration
  const getCurrentLevel = (value: number): SentimentLevel => {
    return SENTIMENT_LEVELS.find(level => value >= level.min && value <= level.max) || SENTIMENT_LEVELS[2];
  };

  const currentLevel = getCurrentLevel(clampedSentiment);

  // Calculate gauge progress (0 to 1)
  const progress = (clampedSentiment + 1) / 2;

  // Determine trend direction
  const getTrendDirection = (): 'up' | 'down' | 'neutral' => {
    if (previousSentiment === undefined) return 'neutral';
    const diff = clampedSentiment - previousSentiment;
    if (Math.abs(diff) < 0.05) return 'neutral';
    return diff > 0 ? 'up' : 'down';
  };

  const trendDirection = getTrendDirection();

  // Animate sentiment changes
  useEffect(() => {
    if (!animated) {
      setDisplaySentiment(clampedSentiment);
      return;
    }

    const startValue = displaySentiment;
    const endValue = clampedSentiment;
    const duration = 1000; // 1 second animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      
      setDisplaySentiment(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [clampedSentiment, animated]);

  // Notify parent of significant sentiment changes
  useEffect(() => {
    const sentimentDiff = Math.abs(sentiment - previousSentimentRef.current);
    if (sentimentDiff > 0.1 && onSentimentChange) {
      onSentimentChange(sentiment, confidence);
    }
    previousSentimentRef.current = sentiment;
  }, [sentiment, confidence, onSentimentChange]);

  // Handle keyboard interactions for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShowTooltip(!showTooltip);
    }
  };

  // Error state rendering
  if (error) {
    return (
      <div className={`flex flex-col items-center p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-400 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm font-medium">Sentiment Error</span>
        </div>
        <p className="text-xs text-gray-400 text-center">{error}</p>
      </div>
    );
  }

  // Loading state rendering
  if (loading) {
    return (
      <div className={`flex flex-col items-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
        <p className="text-sm text-gray-400">Loading sentiment...</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative flex flex-col items-center p-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label */}
      <h3 className={`font-semibold text-white mb-2 ${config.fontSize}`}>
        {label}
      </h3>

      {/* Main gauge container */}
      <div 
        className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full"
        tabIndex={0}
        role="meter"
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={clampedSentiment}
        aria-label={`${label}: ${currentLevel.label} (${(clampedSentiment * 100).toFixed(0)}%)`}
        onKeyDown={handleKeyDown}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {/* SVG Gauge */}
        <svg 
          width={config.radius * 2 + config.strokeWidth * 2} 
          height={config.radius * 2 + config.strokeWidth * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke="#374151"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke={currentLevel.color}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className={`transition-all duration-500 ${animated ? 'ease-out' : ''}`}
            style={{
              filter: isHovered ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Trend indicator */}
          {trendDirection !== 'neutral' && (
            <div className={`mb-1 ${
              trendDirection === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
          )}

          {/* Sentiment value */}
          {showValue && (
            <span className={`font-bold ${currentLevel.textColor} ${config.fontSize}`}>
              {(displaySentiment * 100).toFixed(0)}%
            </span>
          )}

          {/* Confidence indicator */}
          <div className="flex items-center mt-1">
            <div className="w-8 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-400 transition-all duration-300"
                style={{ width: `${clampedConfidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment level label */}
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${currentLevel.bgColor} ${currentLevel.textColor}`}>
        {currentLevel.label}
      </div>

      {/* Confidence display */}
      <p className="text-xs text-gray-400 mt-1">
        Confidence: {(clampedConfidence * 100).toFixed(0)}%
      </p>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-2 p-3 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-10 min-w-48">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">Sentiment Details</span>
          </div>
          <div className="space-y-1 text-xs text-gray-300">
            <p>Current: {(clampedSentiment * 100).toFixed(1)}%</p>
            <p>Confidence: {(clampedConfidence * 100).toFixed(1)}%</p>
            <p>Level: {currentLevel.label}</p>
            {previousSentiment !== undefined && (
              <p>Change: {((clampedSentiment - previousSentiment) * 100).toFixed(1)}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export types for external use
export type { MarketSentimentGaugeProps };