import React from 'react';
import { Button } from './Button';
import { Layers, Zap, Database, Globe } from 'lucide-react';
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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">New: H100 Cluster Availability</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">Backbone</span> of <br />
          Artificial Intelligence
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          From bare metal GPU provisioning to autonomous agent orchestration. 
          The complete knowledge base and infrastructure platform for enterprise AI at scale.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" onClick={() => onNavigate(ViewState.WIKI)} icon={<Zap className="w-4 h-4" />}>
            Explore Hardware
          </Button>
          <Button variant="outline" size="lg" onClick={() => onNavigate(ViewState.BLOG)} icon={<Layers className="w-4 h-4" />}>
            Read Engineering Blog
          </Button>
        </div>

        {/* Stats / Trust */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800 pt-12">
          <div className="p-6">
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-primary-500/10 rounded-lg">
                 <Database className="w-6 h-6 text-primary-400" />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">100k+</h3>
            <p className="text-slate-500 text-sm">GPUs Managed</p>
          </div>
          <div className="p-6 border-l-0 md:border-l border-slate-800">
             <div className="flex justify-center mb-4">
               <div className="p-3 bg-accent-500/10 rounded-lg">
                 <Globe className="w-6 h-6 text-accent-400" />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Global</h3>
            <p className="text-slate-500 text-sm">Low-latency Edge Inference</p>
          </div>
          <div className="p-6 border-l-0 md:border-l border-slate-800">
             <div className="flex justify-center mb-4">
               <div className="p-3 bg-green-500/10 rounded-lg">
                 <Zap className="w-6 h-6 text-green-400" />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">99.99%</h3>
            <p className="text-slate-500 text-sm">Uptime for Agent Swarms</p>
          </div>
        </div>
      </div>
    </div>
  );
};