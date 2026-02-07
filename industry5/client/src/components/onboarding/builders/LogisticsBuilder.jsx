import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';

const LOGISTICS_METRICS = {
    orders: [
        { id: 'total_orders', name: 'Total Orders', description: 'Total orders received' },
        { id: 'completed_orders', name: 'Completed Orders', description: 'Successfully delivered orders' },
        { id: 'on_time_deliveries', name: 'On-Time Deliveries', description: 'Orders delivered within SLA' },
        { id: 'pending_orders', name: 'Pending Orders', description: 'Orders in transit' },
        { id: 'returned_orders', name: 'Returned Orders', description: 'Orders returned by customer' },
        { id: 'cancelled_orders', name: 'Cancelled Orders', description: 'Orders cancelled' },
    ],
    customers: [
        { id: 'total_customers', name: 'Total Customers', description: 'All customers in database' },
        { id: 'new_customers', name: 'New Customers', description: 'New customers added' },
        { id: 'repeat_customers', name: 'Repeat Customers', description: 'Returning customers' },
    ],
    fleet: [
        { id: 'vehicles_available', name: 'Vehicles Available', description: 'Total vehicles in fleet' },
        { id: 'vehicles_active', name: 'Vehicles Active', description: 'Vehicles currently operating' },
        { id: 'driver_count', name: 'Driver Count', description: 'Total drivers' },
    ],
    operations: [
        { id: 'distance_travelled', name: 'Distance Travelled', description: 'Total km/miles covered' },
        { id: 'fuel_consumed', name: 'Fuel Consumed', description: 'Fuel used (Liters/Gallons)' },
        { id: 'delivery_time_hours', name: 'Delivery Time (Hours)', description: 'Total time taken for deliveries' },
    ],
    finance: [
        { id: 'freight_charges_collected', name: 'Freight Charges', description: 'Money received from clients', type: 'currency' },
        { id: 'fuel_cost', name: 'Fuel Cost', description: 'Total expenditure on fuel', type: 'currency' },
        { id: 'driver_wages', name: 'Driver Wages', description: 'Total driver salaries/payments', type: 'currency' },
        { id: 'maintenance_costs', name: 'Maintenance Costs', description: 'Vehicle maintenance expenses', type: 'currency' },
        { id: 'operational_costs', name: 'Other Op. Costs', description: 'Misc operational expenses', type: 'currency' },
        { id: 'overheads', name: 'Overheads', description: 'Fixed overheads (Rent, Admin, etc.)', type: 'currency' },
    ],
    warehouse: [
        { id: 'inventory_in', name: 'Inventory In', description: 'Goods received' },
        { id: 'inventory_out', name: 'Inventory Out', description: 'Goods dispatched' },
        { id: 'damaged_goods', name: 'Damaged Goods', description: 'Items damaged in transit' },
    ]
};

const LogisticsBuilder = ({ onComplete }) => {
    // Initialize state structure based on the constant definitions
    const [logisticsData, setLogisticsData] = useState(() => {
        const initialData = {};
        Object.keys(LOGISTICS_METRICS).forEach(category => {
            initialData[category] = LOGISTICS_METRICS[category].map(metric => ({
                ...metric,
                value: 0
            }));
        });
        return initialData;
    });

    const handleChange = (category, id, value) => {
        setLogisticsData(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, value: parseFloat(value) || 0 } : item
            )
        }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Logistics & Supply Chain Configuration</h2>
                        <p className="text-slate-400">Manage fleet costs, warehousing overheads, and route efficiency.</p>
                    </div>
                    <button
                        onClick={() => onComplete(logisticsData)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:translate-x-1 shadow-lg shadow-blue-900/20"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid gap-8">
                    {/* Orders */}
                    <Section
                        title="Order Management"
                        color="text-emerald-400"
                        borderColor="border-emerald-900/30"
                        items={logisticsData.orders}
                        onChange={(id, v) => handleChange('orders', id, v)}
                    />

                    {/* Customers */}
                    <Section
                        title="Customer Metrics"
                        color="text-purple-400"
                        borderColor="border-purple-900/30"
                        items={logisticsData.customers}
                        onChange={(id, v) => handleChange('customers', id, v)}
                    />

                    {/* Fleet */}
                    <Section
                        title="Fleet Status"
                        color="text-blue-400"
                        borderColor="border-blue-900/30"
                        items={logisticsData.fleet}
                        onChange={(id, v) => handleChange('fleet', id, v)}
                    />

                    {/* Operations */}
                    <Section
                        title="Operations"
                        color="text-orange-400"
                        borderColor="border-orange-900/30"
                        items={logisticsData.operations}
                        onChange={(id, v) => handleChange('operations', id, v)}
                    />

                    {/* Finance */}
                    <Section
                        title="Financials"
                        color="text-green-400"
                        borderColor="border-green-900/30"
                        items={logisticsData.finance}
                        onChange={(id, v) => handleChange('finance', id, v)}
                    />

                    {/* Warehouse */}
                    <Section
                        title="Warehouse"
                        color="text-indigo-400"
                        borderColor="border-indigo-900/30"
                        items={logisticsData.warehouse}
                        onChange={(id, v) => handleChange('warehouse', id, v)}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Section Component
const Section = ({ title, color, borderColor, items, onChange }) => (
    <div className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border ${borderColor || 'border-slate-800'} p-6 transition-all hover:border-slate-700`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50">
            <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
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
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-800 text-xs text-slate-300 p-2 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 text-center border border-slate-700">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-xs text-slate-500 mb-1 ml-1">Value {item.type === 'currency' ? '($)' : ''}</label>
                        <div className="relative group-focus-within:text-blue-400 transition-colors">
                            {item.type === 'currency' && <span className="absolute left-3 top-3 text-slate-500 text-xs">$</span>}
                            <input
                                type="number"
                                value={item.value || ''}
                                onChange={(e) => onChange(item.id, e.target.value)}
                                placeholder="0"
                                className={`w-full bg-slate-950 border border-slate-800 rounded-lg ${item.type === 'currency' ? 'pl-6' : 'pl-4'} pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-right transition-all`}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default LogisticsBuilder;
