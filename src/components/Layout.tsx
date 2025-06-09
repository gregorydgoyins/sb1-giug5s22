import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bell, User, Menu, X } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { NewsTicker } from './NewsTicker';

export function Layout({ children }: { children: React.ReactNode }) {
  const { userBalance } = useMarketStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/markets', label: 'Markets' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/trading', label: 'Trading' },
    { path: '/news', label: 'News' },
    { path: '/learn', label: 'Learn' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 interactive-icon">
                <BookOpen className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-medium text-white font-display">Panel Profits</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
                CC {userBalance.toLocaleString()}
              </span>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <Search className="h-5 w-5" />
              </button>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <User className="h-5 w-5" />
              </button>
              <button 
                className="md:hidden interactive-icon p-2 text-indigo-400 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700/50">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`block py-2 px-3 rounded-md transition-colors ${
                  isActive(item.path) 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <NewsTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}