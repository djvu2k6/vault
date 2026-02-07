import React from 'react';
import { Factory, Cloud, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../data/industryPresets';

const icons = {
  manufacturing: Factory,
  saas: Cloud,
  logistics: Truck,
  retail: ShoppingBag
};

const ModuleSelector = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg shadow-blue-500/20">V</div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Vault</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Select your industry module to initialize the Industry 5.0 logic engine. 
          We will configure the variables automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {Object.values(INDUSTRY_PRESETS).map((industry) => {
          const Icon = icons[industry.id];
          return (
            <button
              key={industry.id}
              onClick={() => onSelect(industry)}
              className="group bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 p-6 rounded-2xl text-left transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 bg-slate-800 group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-blue-400 group-hover:text-white mb-6 transition-colors">
                <Icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{industry.label}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">{industry.description}</p>
              
              <div className="flex items-center text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                Configure Logic <ArrowRight size={16} className="ml-2" />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default ModuleSelector;