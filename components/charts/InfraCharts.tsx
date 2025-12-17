import React from 'react';
import { ChartConfig } from '../../types';
import { Layers, Box } from 'lucide-react';

interface ChartProps {
  config: ChartConfig;
}

export const InfraChart: React.FC<ChartProps> = ({ config }) => {
  if (config.type === 'bar') {
    const maxValue = Math.max(...config.data.map(d => d.value));
    
    return (
      <div className="my-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
        <h4 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">{config.title}</h4>
        <div className="space-y-3">
          {config.data.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono">{item.label}</span>
                <span className="text-primary-400">{item.value} {config.yAxisLabel}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 group-hover:from-accent-500 group-hover:to-accent-400"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (config.type === 'comparison') {
    const maxValue = Math.max(...config.data.map(d => Math.max(d.value, d.value2 || 0)));
    
    return (
      <div className="my-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
        <h4 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">{config.title}</h4>
        <div className="flex items-center space-x-4 text-xs mb-4">
           <div className="flex items-center"><div className="w-3 h-3 bg-primary-500 rounded mr-2"></div>{config.seriesLabels?.[0] || 'Series 1'}</div>
           <div className="flex items-center"><div className="w-3 h-3 bg-slate-600 rounded mr-2"></div>{config.seriesLabels?.[1] || 'Series 2'}</div>
        </div>
        <div className="space-y-4">
          {config.data.map((item, idx) => (
            <div key={idx}>
              <div className="text-xs font-mono text-slate-400 mb-1">{item.label}</div>
              <div className="space-y-1">
                {/* Bar 1 */}
                <div className="flex items-center h-2 bg-slate-800/50 rounded-full overflow-hidden w-full">
                   <div 
                    className="h-full bg-primary-500"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                   />
                </div>
                {/* Bar 2 */}
                <div className="flex items-center h-2 bg-slate-800/50 rounded-full overflow-hidden w-full">
                   <div 
                    className="h-full bg-slate-600"
                    style={{ width: `${((item.value2 || 0) / maxValue) * 100}%` }}
                   />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (config.type === 'architecture') {
    return (
      <div className="my-8 p-6 bg-slate-900/80 border border-slate-700 rounded-xl shadow-2xl">
        <div className="flex items-center mb-6 border-b border-slate-800 pb-4">
          <Layers className="w-5 h-5 text-accent-400 mr-2" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{config.title}</h4>
        </div>
        
        <div className="flex flex-col space-y-2">
          {config.data.map((layer, idx) => (
            <div key={idx} className="relative group">
              {/* Connector Line */}
              {idx !== config.data.length - 1 && (
                <div className="absolute left-6 top-full h-2 w-0.5 bg-slate-700 z-0"></div>
              )}
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 hover:border-primary-500/30 transition-colors">
                {/* Layer Label */}
                <div className="flex items-center w-full md:w-48 mb-2 md:mb-0 shrink-0">
                  <div className={`
                    w-2 h-8 rounded mr-3 
                    ${idx === 0 ? 'bg-indigo-500' : ''}
                    ${idx === 1 ? 'bg-blue-500' : ''}
                    ${idx === 2 ? 'bg-sky-500' : ''}
                    ${idx >= 3 ? 'bg-teal-500' : ''}
                  `}></div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{layer.label}</span>
                </div>
                
                {/* Tech Items */}
                <div className="flex flex-wrap gap-2">
                  {layer.items?.map((tech, techIdx) => (
                    <span 
                      key={techIdx} 
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800 group-hover:text-white group-hover:border-slate-600 transition-colors"
                    >
                      <Box className="w-3 h-3 mr-1.5 opacity-50" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-[10px] text-center text-slate-600 font-mono">
           Architecture Stack Diagram generated by InfraMind
        </div>
      </div>
    );
  }

  return null;
};