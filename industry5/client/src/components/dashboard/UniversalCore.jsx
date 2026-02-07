import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Brain, Calculator, Loader, Save } from 'lucide-react';

// IMPORT THE API HELPER
import { api } from '../../api';

const UniversalCore = ({ isDarkMode }) => {

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // 1. INPUTS (Start EMPTY - Zeros)
  const [inputs, setInputs] = useState({
    industry_type: 'General',
    selling_price: 0,
    variable_cost_unit: 0,
    units_sold: 0,
    fixed_costs: 0
  });

  // 2. RESULTS
  const [results, setResults] = useState({
    revenue: 0,
    cm1_margin: 0,
    cm1_total: 0,
    cm2_margin: 0,
    net_profit: 0
  });

  // --- NEW: LOAD DATA ON STARTUP ---
  useEffect(() => {
    loadFromDatabase();
  }, []);

  const loadFromDatabase = async () => {
    setLoading(true);
    const savedData = await api.fetchLatest();

    if (savedData && savedData.success && savedData.data) {
      const db = savedData.data;
      // Update Inputs from DB
      setInputs({
        industry_type: db.industry_type || 'General',
        selling_price: db.selling_price || 0,
        variable_cost_unit: db.variable_cost_unit || 0,
        units_sold: db.units_sold || 0,
        fixed_costs: db.fixed_costs || 0
      });
      // Update Results from DB
      setResults({
        revenue: db.revenue || 0,
        cm1_margin: db.cm1_margin || 0,
        cm1_total: db.cm1_total || 0,
        cm2_margin: db.cm2_margin || 0
      });
    }
    setLoading(false);
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleCompute = async () => {
    setLoading(true);
    try {
      const data = await api.computeFinancials(inputs);
      if (data.data) {
        setResults(data.data);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving data. Is server running?");
    }
    setLoading(false);
  };

  const handleAiAnalyze = async (kpiName, kpiValue) => {
    setAiLoading(true);
    setAiResponse(`Asking AI...`);
    const analysis = await api.analyzeKPI(kpiName, kpiValue, inputs);
    setAiResponse(analysis);
    setAiLoading(false);
  };

  // --- CHART DATA ---
  const waterfallData = [
    { name: 'Revenue', value: results.revenue, type: 'plus' },
    { name: 'Var Costs', value: inputs.variable_cost_unit * inputs.units_sold, type: 'minus' },
    { name: 'CM1', value: results.cm1_total, type: 'subtotal' },
    { name: 'Fixed Costs', value: inputs.fixed_costs, type: 'minus' },
    { name: 'Net Profit', value: results.cm2_margin, type: 'final' }
  ];

  const COLORS = {
    plus: '#3b82f6', minus: '#ef4444', subtotal: '#f59e0b', final: results.cm2_margin >= 0 ? '#10b981' : '#ef4444',
    text: isDarkMode ? '#cbd5e1' : '#334155',
    cardBg: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    cardText: isDarkMode ? 'text-white' : 'text-slate-900'
  };

  return (
    <div className="p-8 space-y-6">

      {/* --- SECTION 0: CONTROL PANEL --- */}
      <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${COLORS.cardText}`}>
            <Calculator size={20} className="text-blue-500" /> Input Parameters
          </h3>
          <button
            type="button"
            onClick={handleCompute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={18} /> : <><Save size={18} /> Save & Compute</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputGroup label="Selling Price ($)" name="selling_price" val={inputs.selling_price} onChange={handleInputChange} isDark={isDarkMode} />
          <InputGroup label="Var Cost / Unit ($)" name="variable_cost_unit" val={inputs.variable_cost_unit} onChange={handleInputChange} isDark={isDarkMode} />
          <InputGroup label="Units Sold" name="units_sold" val={inputs.units_sold} onChange={handleInputChange} isDark={isDarkMode} />
          <InputGroup label="Fixed Costs ($)" name="fixed_costs" val={inputs.fixed_costs} onChange={handleInputChange} isDark={isDarkMode} />
        </div>
      </div>

      {/* --- SECTION 1: AI --- */}
      {aiResponse && (
        <div className="bg-purple-900/30 border border-purple-500/30 p-6 rounded-xl text-white animate-in fade-in">
          <div className="flex gap-4">
            <Brain className="text-purple-400 min-w-[24px]" />
            <p className="text-sm leading-relaxed">{aiResponse}</p>
          </div>
        </div>
      )}

      {/* --- SECTION 2: KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Revenue" value={`$${results.revenue.toLocaleString()}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("Revenue", results.revenue)} />
        <KPICard title="CM1 Margin" value={`$${results.cm1_total.toLocaleString()}`} icon={Activity} theme={COLORS} onAnalyze={() => handleAiAnalyze("CM1", results.cm1_total)} />
        <KPICard title="Net Profit" value={`$${results.cm2_margin.toLocaleString()}`} icon={TrendingUp} theme={COLORS} onAnalyze={() => handleAiAnalyze("Profit", results.cm2_margin)} />
        <KPICard title="Break Even" value={Math.ceil(inputs.fixed_costs / (inputs.selling_price - inputs.variable_cost_unit) || 0).toLocaleString()} icon={TrendingDown} theme={COLORS} onAnalyze={() => handleAiAnalyze("Break Even", "Calculated")} />
      </div>

      {/* --- SECTION 3: CHARTS (4 Key Charts) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Chart 1: Profitability Waterfall */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Profitability Waterfall</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.text} opacity={0.2} />
                <XAxis dataKey="name" stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} />
                <Bar dataKey="value">
                  {waterfallData.map((e, i) => <Cell key={i} fill={COLORS[e.type]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Composition (Simulated) */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Revenue Composition</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Product Sales', value: results.revenue * 0.7 },
                    { name: 'Services', value: results.revenue * 0.2 },
                    { name: 'Licensing', value: results.revenue * 0.1 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Product</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Services</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> License</div>
            </div>
          </div>
        </div>

        {/* Chart 3: Break Even Analysis (Simulated) */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Break Even Analysis</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <AreaChart data={[
                { x: 0, cost: inputs.fixed_costs, rev: 0 },
                { x: inputs.units_sold * 0.5, cost: inputs.fixed_costs + (inputs.variable_cost_unit * inputs.units_sold * 0.5), rev: results.revenue * 0.5 },
                { x: inputs.units_sold, cost: inputs.fixed_costs + (inputs.variable_cost_unit * inputs.units_sold), rev: results.revenue },
                { x: inputs.units_sold * 1.2, cost: inputs.fixed_costs + (inputs.variable_cost_unit * inputs.units_sold * 1.2), rev: results.revenue * 1.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke={COLORS.text} />
                <XAxis dataKey="x" stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="rev" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Revenue" />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Total Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Trend (Simulated) */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Projected Growth (6 Months)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={[
                { name: 'Jan', val: results.revenue * 0.8 },
                { name: 'Feb', val: results.revenue * 0.85 },
                { name: 'Mar', val: results.revenue * 0.92 },
                { name: 'Apr', val: results.revenue },
                { name: 'May', val: results.revenue * 1.1 },
                { name: 'Jun', val: results.revenue * 1.25 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} stroke={COLORS.text} />
                <XAxis dataKey="name" stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} />
                <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: DETAILED ANALYSIS --- */}
      <div className={`p-8 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold mb-2 ${COLORS.cardText}`}>Detailed Analysis</h3>
            <p className="text-slate-500">Deep dive into unit economics, sensitivity analysis, and market benchmarking.</p>
          </div>
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2">
            View Full Report <TrendingUp size={16} />
          </button>
        </div>

        {/* Placeholder for detailed diagrams */}
        <div className="mt-8 grid grid-cols-3 gap-4 opacity-50">
          <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
          <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
          <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const InputGroup = ({ label, name, val, onChange, isDark }) => (
  <div>
    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    <input type="number" name={name} value={val} onChange={onChange} className={`w-full p-2 rounded-lg border outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 text-black'}`} />
  </div>
);

const KPICard = ({ title, value, icon: Icon, theme, onAnalyze }) => (
  <div className={`p-6 rounded-xl border relative group ${theme.cardBg}`}>
    <div className="flex justify-between mb-2">
      <span className="text-slate-400 text-sm">{title}</span>
      <Icon className="text-blue-500" size={18} />
    </div>
    <div className={`text-2xl font-bold ${theme.cardText}`}>{value}</div>
    <button onClick={onAnalyze} className="absolute top-4 right-14 text-purple-400 opacity-0 group-hover:opacity-100"><Brain size={16} /></button>
  </div>
);

export default UniversalCore;