import React, { useState } from 'react';
import { ViewState, NavItem } from '../types';
import { Layers, Server, Menu, X, Search, BookOpen, Rocket, Briefcase, Youtube, Cpu } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onSearch, onCategorySelect }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (onSearch) onSearch(q);
  };

  const navItems = [
    { label: 'Getting Started', icon: <Rocket className="w-4 h-4" />, action: () => onCategorySelect && onCategorySelect('Getting Started') },
    { label: 'Use Cases', icon: <Briefcase className="w-4 h-4" />, action: () => onCategorySelect && onCategorySelect('Use Cases') },
    { label: 'NVIDIA', icon: <Cpu className="w-4 h-4" />, action: () => onNavigate(ViewState.NVIDIA) },
    { label: 'Wiki', icon: <BookOpen className="w-4 h-4" />, action: () => onNavigate(ViewState.WIKI) },
    { label: 'YouTube', icon: <Youtube className="w-4 h-4" />, action: () => onNavigate(ViewState.YOUTUBE) },
    { label: 'Blog', icon: <Layers className="w-4 h-4" />, action: () => onNavigate(ViewState.BLOG) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0" 
            onClick={() => onNavigate(ViewState.HOME)}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all">
              <Server className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              InfraMind
            </span>
          </div>

          {/* Search Bar - Central */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-1.5 border border-slate-700 rounded-full leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                placeholder="Search knowledge base (e.g. 'H100 specs', 'Ray clusters')..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                 <span className="text-slate-600 text-xs border border-slate-700 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                  (item.label === 'Wiki' && currentView === ViewState.WIKI) ||
                  (item.label === 'Blog' && currentView === ViewState.BLOG) ||
                  (item.label === 'YouTube' && currentView === ViewState.YOUTUBE) ||
                  (item.label === 'NVIDIA' && currentView === ViewState.NVIDIA)
                    ? 'text-primary-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                 type="text"
                 value={searchQuery}
                 onChange={handleSearch}
                 className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary-500"
                 placeholder="Search articles..."
              />
            </div>
            <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};