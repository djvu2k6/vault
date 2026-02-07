import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';

const SAAS_METRICS = {
    users: [
        { id: 'total_users', name: 'Total Users', description: 'All registered users' },
        { id: 'active_users', name: 'Active Users', description: 'Users currently active' },
        { id: 'new_signups', name: 'New Signups', description: 'New registrations in period' },
        { id: 'paid_users', name: 'Paid Users', description: 'Users with active subscription' },
        { id: 'churned_users', name: 'Churned Users', description: 'Users who cancelled' },
        { id: 'free_users', name: 'Free Users', description: 'Users on free plan' },
    ],
    subscriptions: [
        { id: 'new_subscriptions', name: 'New Subscriptions', description: 'New paid subscriptions' },
        { id: 'cancelled_subscriptions', name: 'Cancelled Subscriptions', description: 'Cancelled plans' },
        { id: 'upgraded_subscriptions', name: 'Upgraded Subscriptions', description: 'Plan upgrades' },
        { id: 'downgraded_subscriptions', name: 'Downgraded Subscriptions', description: 'Plan downgrades' },
    ],
    revenue: [
        { id: 'payments_received', name: 'Payments Received', description: 'Total payments collected' },
        { id: 'refunds_issued', name: 'Refunds Issued', description: 'Money refunded' },
        { id: 'discounts_given', name: 'Discounts Given', description: 'Coupons/discount value' },
    ],
    usage: [
        { id: 'active_sessions', name: 'Active Sessions', description: 'Logins/usage count' },
        { id: 'feature_usage', name: 'Feature Usage', description: 'Core feature events' },
        { id: 'trial_starts', name: 'Trial Starts', description: 'New trials started' },
        { id: 'trial_conversions', name: 'Trial Conversions', description: 'Trials converted to paid' },
    ]
};

const SaasBuilder = ({ onComplete }) => {
    // Initialize state structure based on the new metrics
    const [saasData, setSaasData] = useState(() => {
        const initialData = {};
        Object.keys(SAAS_METRICS).forEach(category => {
            initialData[category] = SAAS_METRICS[category].map(metric => ({
                ...metric,
                value: 0
            }));
        });
        return initialData;
    });

    const handleChange = (category, id, value) => {
        setSaasData(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, value: parseFloat(value) || 0 } : item
            )
        }));
    };

    const calculateTotal = (category) => {
        // Simple sum for now, though some metrics might not be summable in a "Total" context meaningfully
        // but useful for visual consistency or validating data entry.
        return saasData[category].reduce((sum, item) => sum + (item.value || 0), 0);
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
                        onClick={() => onComplete(saasData)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:translate-x-1 shadow-lg shadow-blue-900/20"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid gap-8">
                    {/* User Metrics */}
                    <Section
                        title="User Metrics"
                        color="text-emerald-400"
                        borderColor="border-emerald-900/30"
                        items={saasData.users}
                        onChange={(id, v) => handleChange('users', id, v)}
                        total={calculateTotal('users')}
                        type="users"
                    />

                    {/* Subscription Metrics */}
                    <Section
                        title="Subscription Metrics"
                        color="text-purple-400"
                        borderColor="border-purple-900/30"
                        items={saasData.subscriptions}
                        onChange={(id, v) => handleChange('subscriptions', id, v)}
                        total={calculateTotal('subscriptions')}
                        type="count"
                    />

                    {/* Revenue Metrics */}
                    <Section
                        title="Revenue Metrics"
                        color="text-blue-400"
                        borderColor="border-blue-900/30"
                        items={saasData.revenue}
                        onChange={(id, v) => handleChange('revenue', id, v)}
                        total={calculateTotal('revenue')}
                        type="currency"
                    />

                    {/* Usage Metrics */}
                    <Section
                        title="Usage Metrics"
                        color="text-orange-400"
                        borderColor="border-orange-900/30"
                        items={saasData.usage}
                        onChange={(id, v) => handleChange('usage', id, v)}
                        total={calculateTotal('usage')}
                        type="count"
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component
const Section = ({ title, color, borderColor, items, onChange, total, type }) => (
    <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border ${borderColor || 'border-slate-800'} p-6 transition-all hover:border-slate-700`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50">
            <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
            {/* Optional Total Display */}
            {/* <div className="text-right">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total</p>
                <p className={`font-mono font-bold ${color}`}>
                    {type === 'currency' ? '$' : ''}{total.toLocaleString()}
                </p>
            </div> */}
        </div>

        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 group">
                    <div className="flex-1 w-full">
                        <label className="block text-xs text-slate-500 mb-1 ml-1">Metric Name</label>
                        <div className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-300 pointer-events-none flex justify-between items-center">
                            <span>{item.name}</span>
                            <div className="group relative ml-2">
                                <Info size={14} className="text-slate-600 hover:text-slate-400 cursor-help" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-800 text-xs text-slate-300 p-2 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 text-center">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-xs text-slate-500 mb-1 ml-1">Value {type === 'currency' ? '($)' : ''}</label>
                        <div className="relative group-focus-within:text-blue-400 transition-colors">
                            {type === 'currency' && <span className="absolute left-3 top-3 text-slate-500 text-xs">$</span>}
                            <input
                                type="number"
                                value={item.value || ''}
                                onChange={(e) => onChange(item.id, e.target.value)}
                                placeholder="0"
                                className={`w-full bg-slate-950 border border-slate-800 rounded-lg ${type === 'currency' ? 'pl-6' : 'pl-4'} pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-right transition-all`}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SaasBuilder;
