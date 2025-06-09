import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, Wallet, ArrowRight } from 'lucide-react';

interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Navigation path for the button */
  to: string;
  /** Button variant type */
  variant: 'primary' | 'secondary';
  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }>;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether button is disabled */
  disabled?: boolean;
}

/**
 * Interactive Button Component
 * 
 * A reusable button component that matches the site's design aesthetic
 * with smooth animations, hover effects, and accessibility features.
 */
function InteractiveButton({ 
  children, 
  to, 
  variant, 
  icon: Icon, 
  className = '',
  ariaLabel,
  disabled = false
}: ButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    px-8 py-4 rounded-xl font-semibold text-lg
    transition-all duration-300 ease-out
    transform hover:-translate-y-1 active:translate-y-0
    focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    group overflow-hidden
  `;

  const primaryClasses = `
    bg-gradient-to-r from-indigo-600 to-purple-600
    hover:from-indigo-500 hover:to-purple-500
    text-white shadow-lg hover:shadow-xl
    focus:ring-indigo-500
    before:absolute before:inset-0 before:bg-gradient-to-r 
    before:from-white/20 before:to-transparent before:opacity-0
    hover:before:opacity-100 before:transition-opacity before:duration-300
  `;

  const secondaryClasses = `
    bg-slate-800/90 backdrop-blur-md border-2 border-slate-600/50
    hover:border-indigo-500/50 hover:bg-slate-700/90
    text-white shadow-lg hover:shadow-xl
    focus:ring-slate-500
    before:absolute before:inset-0 before:bg-gradient-to-r 
    before:from-indigo-500/10 before:to-purple-500/10 before:opacity-0
    hover:before:opacity-100 before:transition-opacity before:duration-300
  `;

  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

  if (disabled) {
    return (
      <div 
        className={`${baseClasses} ${variantClasses} ${className}`}
        aria-label={ariaLabel}
        role="button"
        aria-disabled="true"
      >
        <span className="relative z-10 flex items-center space-x-3">
          {Icon && <Icon className="h-6 w-6" />}
          <span>{children}</span>
        </span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label={ariaLabel}
    >
      <span className="relative z-10 flex items-center space-x-3">
        {Icon && <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />}
        <span>{children}</span>
        <ArrowRight className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
      </span>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </Link>
  );
}

interface InteractiveButtonsProps {
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to stack buttons vertically on all screen sizes */
  forceVertical?: boolean;
}

/**
 * Interactive Buttons Container
 * 
 * A responsive container for the three main action buttons:
 * - Start Trading (primary CTA)
 * - Learn More (secondary)
 * - View Portfolio (secondary)
 * 
 * Features:
 * - Responsive layout (horizontal on desktop, vertical on mobile)
 * - Consistent spacing and alignment
 * - Smooth hover animations and transitions
 * - Full accessibility support
 * - Matches existing design aesthetic
 */
export function InteractiveButtons({ 
  className = '',
  forceVertical = false
}: InteractiveButtonsProps) {
  const containerClasses = forceVertical 
    ? 'flex flex-col items-center space-y-4'
    : 'flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6';

  return (
    <div 
      className={`w-full ${containerClasses} ${className}`}
      role="group"
      aria-label="Main navigation actions"
    >
      {/* Primary CTA - Start Trading */}
      <InteractiveButton
        to="/trading"
        variant="primary"
        icon={TrendingUp}
        ariaLabel="Navigate to trading interface to start buying and selling comic assets"
        className="w-full sm:w-auto min-w-[200px]"
      >
        Start Trading
      </InteractiveButton>

      {/* Secondary Action - Learn More */}
      <InteractiveButton
        to="/learn"
        variant="secondary"
        icon={BookOpen}
        ariaLabel="Navigate to learning center for tutorials and educational content"
        className="w-full sm:w-auto min-w-[200px]"
      >
        Learn More
      </InteractiveButton>

      {/* Secondary Action - View Portfolio */}
      <InteractiveButton
        to="/portfolio"
        variant="secondary"
        icon={Wallet}
        ariaLabel="Navigate to portfolio overview to view your holdings and performance"
        className="w-full sm:w-auto min-w-[200px]"
      >
        View Portfolio
      </InteractiveButton>
    </div>
  );
}

// Export individual button component for standalone use
export { InteractiveButton };
export type { ButtonProps, InteractiveButtonsProps };