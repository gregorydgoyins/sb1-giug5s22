import React from 'react';
import { Link } from 'react-router-dom';
import { MarketOverview } from './MarketOverview';
import { Portfolio } from './Portfolio';
import { NewsSection } from './NewsSection';
import { TrendingStocks } from './TrendingStocks';
import { CreatorBonds } from './CreatorBonds';
import { PublisherBonds } from './PublisherBonds';
import { OptionsTrading } from './OptionsTrading';
import { MarketChart } from './MarketChart';
import { TrendingUp, BookOpen, Wallet } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="hero-card p-8 text-white rounded-xl mb-8">
        {/* Centered heading and tagline */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Panel Profits</h1>
          <p className="text-lg text-white/80 mb-8 max-w-4xl mx-auto">
            YOUR GATEWAY TO THE HOME OF THE COMIC BOOK STOCK EXCHANGE
          </p>
        </div>
        
        {/* Contrasting Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Start Trading - Bright Green for High Contrast */}
          <Link 
            to="/trading"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg
                     bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400
                     text-white shadow-lg hover:shadow-xl
                     transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900
                     w-full sm:w-auto min-w-[200px] overflow-hidden"
            aria-label="Navigate to trading interface to start buying and selling comic assets"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span>Start Trading</span>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Link>

          {/* Learn More - Bright Orange for High Contrast */}
          <Link 
            to="/learn"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg
                     bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400
                     text-white shadow-lg hover:shadow-xl
                     transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900
                     w-full sm:w-auto min-w-[200px] overflow-hidden"
            aria-label="Navigate to learning center for tutorials and educational content"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <BookOpen className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span>Learn More</span>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Link>

          {/* View Portfolio - Bright Cyan for High Contrast */}
          <Link 
            to="/portfolio"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg
                     bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                     text-white shadow-lg hover:shadow-xl
                     transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
                     w-full sm:w-auto min-w-[200px] overflow-hidden"
            aria-label="Navigate to portfolio overview to view your holdings and performance"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <Wallet className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span>View Portfolio</span>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Link>
        </div>
      </div>

      <MarketOverview />
      
      {/* Market Chart spanning full width */}
      <MarketChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreatorBonds />
            <PublisherBonds />
          </div>
          <OptionsTrading />
          <Portfolio />
          <TrendingStocks />
        </div>
        <div className="space-y-6">
          <NewsSection />
        </div>
      </div>
    </div>
  );
}