import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../../data/industryPresets';

const SaasBuilder = ({ onComplete }) => {
    const [attributes, setAttributes] = useState(INDUSTRY_PRESETS.saas.attributes);

    const handleChange = (category, id, value) => {
        setAttributes(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, value: parseFloat(value) || 0 } : item
            )
        }));
    };

    const calculateTotal = (category) => {
        return attributes[category].reduce((sum, item) => sum + (item.value || 0), 0);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">SaaS & Digital Product Configuration</h2>
                        <p className="text-slate-400">Focus on MRR, CAC/LTV, and server infrastructure scaling.</p>
                    </div>
                    <button
                        onClick={() => onComplete(attributes)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:translate-x-1 shadow-lg shadow-blue-900/20"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid gap-8">
                    {/* Revenue */}
                    <Section
                        title="Revenue Streams (MRR, Expansion)"
                        color="text-blue-400"
                        borderColor="border-blue-900/30"
                        items={attributes.revenue}
                        onChange={(id, v) => handleChange('revenue', id, v)}
                        total={calculateTotal('revenue')}
                    />

                    {/* Variable Costs */}
                    <Section
                        title="Variable Costs (Support, Usage)"
                        color="text-orange-400"
                        borderColor="border-orange-900/30"
                        items={attributes.variable}
                        onChange={(id, v) => handleChange('variable', id, v)}
                        total={calculateTotal('variable')}
                    />

                    {/* Fixed Costs */}
                    <Section
                        title="Fixed Costs (Server, R&D)"
                        color="text-red-400"
                        borderColor="border-red-900/30"
                        items={attributes.fixed}
                        onChange={(id, v) => handleChange('fixed', id, v)}
                        total={calculateTotal('fixed')}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component
const Section = ({ title, color, borderColor, items, onChange, total }) => (
    <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border ${borderColor || 'border-slate-800'} p-6 transition-all hover:border-slate-700`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50">
            <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
            <div className="text-right">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total</p>
                <p className={`font-mono font-bold ${color}`}>${total.toLocaleString()}</p>
            </div>
        </div>

        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 group">
                    <div className="flex-1 w-full">
                        <label className="block text-xs text-slate-500 mb-1 ml-1">Attribute Name</label>
                        <div className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-300 pointer-events-none">
                            {item.name}
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-xs text-slate-500 mb-1 ml-1">Value ($)</label>
                        <div className="relative group-focus-within:text-blue-400 transition-colors">
                            <span className="absolute left-3 top-3 text-slate-500 text-xs">$</span>
                            <input
                                type="number"
                                value={item.value || ''}
                                onChange={(e) => onChange(item.id, e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-right transition-all"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SaasBuilder;
