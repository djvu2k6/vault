import React, { useState } from 'react';
import { ArrowRight, Plus, Trash2, DollarSign } from 'lucide-react';

const LogicBuilder = ({ industryData, onComplete }) => {
  // We clone the preset data so we can edit it locally
  const [attributes, setAttributes] = useState(industryData.attributes);

  // Helper to handle input changes
  const handleChange = (category, id, value) => {
    setAttributes(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, value: parseFloat(value) || 0 } : item
      )
    }));
  };

  // Helper to calculate totals for the footer
  const calculateTotal = (category) => {
    return attributes[category].reduce((sum, item) => sum + item.value, 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4">
      
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{industryData.label} Configuration</h2>
            <p className="text-slate-400">Define your cost drivers and revenue sources.</p>
          </div>
          <button 
            onClick={() => onComplete(attributes)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            Launch Dashboard <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-8">
          
          {/* REVENUE SECTION */}
          <Section 
            title="Revenue Streams" 
            color="text-blue-400" 
            items={attributes.revenue} 
            onChange={(id, v) => handleChange('revenue', id, v)}
            total={calculateTotal('revenue')}
          />

          {/* VARIABLE COSTS */}
          <Section 
            title="Variable Costs (COGS, Materials)" 
            color="text-orange-400" 
            items={attributes.variable} 
            onChange={(id, v) => handleChange('variable', id, v)}
            total={calculateTotal('variable')}
          />

          {/* FIXED COSTS */}
          <Section 
            title="Fixed Costs (CapEx, OpEx, Salaries)" 
            color="text-red-400" 
            items={attributes.fixed} 
            onChange={(id, v) => handleChange('fixed', id, v)}
            total={calculateTotal('fixed')}
          />

        </div>
      </div>
    </div>
  );
};

// Sub-component for each list
const Section = ({ title, color, items, onChange, total }) => (
  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
      <span className="text-slate-400 font-mono text-sm">Total: ${total.toLocaleString()}</span>
    </div>
    
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 group">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Attribute Name</label>
            <input 
              type="text" 
              defaultValue={item.name}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs text-slate-500 mb-1">Value ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
              <input 
                type="number" 
                value={item.value || ''} 
                onChange={(e) => onChange(item.id, e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none font-mono text-right"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LogicBuilder;