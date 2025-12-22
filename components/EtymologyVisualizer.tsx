
import React from 'react';
import { EtymologyStep } from '../types';

interface EtymologyVisualizerProps {
  steps: EtymologyStep[];
}

const EtymologyVisualizer: React.FC<EtymologyVisualizerProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative py-10 px-4">
      {/* Background Connector Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-100 via-indigo-300 to-indigo-600 -translate-x-1/2 hidden md:block"></div>

      <div className="space-y-12 relative">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative group animate-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Desktop Left Content */}
              <div className={`hidden md:block w-1/2 ${isEven ? 'text-right pr-12' : 'order-last text-left pl-12'}`}>
                <div className={`p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1 ${isEven ? 'origin-right' : 'origin-left'}`}>
                   <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">{step.period}</span>
                   <p className="text-sm text-slate-600 leading-relaxed italic">{step.description}</p>
                </div>
              </div>

              {/* Central Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white border-4 border-indigo-600 rounded-full shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-125">
                   <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                </div>
                <div className="mt-4 md:absolute md:mt-0 md:-bottom-12 whitespace-nowrap">
                   <span className="font-serif text-2xl font-bold text-slate-900 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-100">
                     {step.form}
                   </span>
                </div>
              </div>

              {/* Desktop Opposite Placeholder or Mobile Content */}
              <div className={`md:hidden w-full max-w-sm mt-8 text-center`}>
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                   <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">{step.period}</span>
                   <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
              
              <div className="hidden md:block w-1/2"></div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
           </svg>
           Γλωσσική Εξέλιξη
        </div>
      </div>
    </div>
  );
};

export default EtymologyVisualizer;
