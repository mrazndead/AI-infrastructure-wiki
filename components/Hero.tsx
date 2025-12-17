import React from 'react';
import { Button } from './Button';
import { Layers, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-900/20 via-slate-900/0 to-slate-900/0 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">Backbone</span> of <br />
          Artificial Intelligence
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          A comprehensive knowledge base for building enterprise-scale AI infrastructure—from bare-metal GPU provisioning to autonomous agent orchestration.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" onClick={() => onNavigate(ViewState.WIKI)} icon={<Zap className="w-4 h-4" />}>
            Start Learning
          </Button>
          <Button variant="outline" size="lg" onClick={() => onNavigate(ViewState.BLOG)} icon={<Layers className="w-4 h-4" />}>
            Read Engineering Blog
          </Button>
        </div>
      </div>
    </div>
  );
};