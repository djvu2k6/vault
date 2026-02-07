import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../../data/industryPresets';

const ManufacturingBuilder = ({ onComplete }) => {
    const [attributes, setAttributes] = useState({
        // Variable Costs
        cost_per_unit: 0,
        marketing_spend: 0,
        variable_costs: 0,
        sales_spend: 0,
        utilities: 0,
        logistics_cost: 0,
        variable_salaries: 0,
        // Fixed Costs (OPEX)
        fixed_costs_opex_rent_salaries: 0,
        tools: 0,
        other_fixed_costs: 0,
        // Capital Expenditure (CapEx)
        machinery: 0,
        server: 0,
        vehicles: 0,
        office_setup: 0,
        other_capex: 0,
        // Financial Metrics
        cash_in_bank: 0,
        monthly_expenses: 0,
        current_profit: 0,
        last_profit: 0
    });

    const handleChange = (key, value) => {
        setAttributes(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
    };

    const calculateTotal = () => {
        return Object.values(attributes).reduce((sum, val) => sum + (val || 0), 0);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Manufacturing & Hardware Configuration</h2>
                        <p className="text-slate-400">Optimize production lines, track unit costs, and manage factory overheads.</p>
                    </div>
                    <button
                        onClick={() => onComplete(attributes)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:translate-x-1 shadow-lg shadow-blue-900/20"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid gap-8">
                    <Section
                        title="Variable Costs"
                        color="text-orange-400"
                        borderColor="border-orange-900/30"
                        attributes={{
                            cost_per_unit: attributes.cost_per_unit,
                            marketing_spend: attributes.marketing_spend,
                            variable_costs: attributes.variable_costs,
                            sales_spend: attributes.sales_spend,
                            utilities: attributes.utilities,
                            logistics_cost: attributes.logistics_cost,
                            variable_salaries: attributes.variable_salaries
                        }}
                        onChange={handleChange}
                    />

                    <Section
                        title="Fixed Costs (OPEX + Rent + Salaries)"
                        color="text-red-400"
                        borderColor="border-red-900/30"
                        attributes={{
                            fixed_costs_opex_rent_salaries: attributes.fixed_costs_opex_rent_salaries,
                            tools: attributes.tools,
                            other_fixed_costs: attributes.other_fixed_costs
                        }}
                        onChange={handleChange}
                    />

                    <Section
                        title="Capital Expenditure (CapEx)"
                        color="text-purple-400"
                        borderColor="border-purple-900/30"
                        attributes={{
                            machinery: attributes.machinery,
                            server: attributes.server,
                            vehicles: attributes.vehicles,
                            office_setup: attributes.office_setup,
                            other_capex: attributes.other_capex
                        }}
                        onChange={handleChange}
                    />

                    <Section
                        title="Financial Metrics"
                        color="text-green-400"
                        borderColor="border-green-900/30"
                        attributes={{
                            cash_in_bank: attributes.cash_in_bank,
                            monthly_expenses: attributes.monthly_expenses,
                            current_profit: attributes.current_profit,
                            last_profit: attributes.last_profit
                        }}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component (Local)
const Section = ({ title, color, borderColor, attributes, onChange }) => {
    const sectionTotal = Object.values(attributes).reduce((sum, val) => sum + (val || 0), 0);
    
    return (
        <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border ${borderColor || 'border-slate-800'} p-6 transition-all hover:border-slate-700`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50">
                <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
                <div className="text-right">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total</p>
                    <p className={`font-mono font-bold ${color}`}>${sectionTotal.toLocaleString()}</p>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row items-center gap-4 group">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-slate-500 mb-1 ml-1">Attribute Name</label>
                            <div className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-300 pointer-events-none">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-xs text-slate-500 mb-1 ml-1">Value</label>
                            <div className="relative group-focus-within:text-blue-400 transition-colors">
                                <span className="absolute left-3 top-3 text-slate-500 text-xs">$</span>
                                <input
                                    type="number"
                                    value={value || ''}
                                    onChange={(e) => onChange(key, e.target.value)}
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
};

export default ManufacturingBuilder;
