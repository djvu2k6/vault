import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Brain, Calculator, Loader, Save } from 'lucide-react';

// IMPORT THE API HELPER
import { api } from '../../api';

const UniversalCore = ({ isDarkMode, initialInputs = {} }) => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // 1. INPUTS (Start with initialInputs or defaults)
  const [inputs, setInputs] = useState(() => {
    const defaultInputs = {
      industry_type: initialInputs.industry_type || 'General'
    };
    // Merge initialInputs with defaults, preserving all keys
    Object.keys(initialInputs).forEach(key => {
      if (key !== 'industry_type') {
        defaultInputs[key] = initialInputs[key] ?? 0;
      }
    });
    // Fallback for legacy single industry (ensure these exist)
    if (!defaultInputs.selling_price) defaultInputs.selling_price = 0;
    if (!defaultInputs.units_sold) defaultInputs.units_sold = 0;
    return defaultInputs;
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
      // Update Inputs from DB - preserve all keys from initialInputs
      const newInputs = { industry_type: db.industry_type || 'General' };
      Object.keys(inputs).forEach(key => {
        if (key !== 'industry_type') {
          newInputs[key] = db[key] ?? inputs[key];
        }
      });
      setInputs(newInputs);
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

  // --- CALCULATIONS ---
  const calculateMetrics = () => {
    // Revenue (from monthly_revenue or estimate)
    const revenue = inputs.monthly_revenue || 0;
    const lastMonthRevenue = inputs.last_month_revenue || 0;
    const unitsEstimate = inputs.monthly_revenue && inputs.cost_per_unit ? Math.ceil(inputs.monthly_revenue / (inputs.cost_per_unit + 50)) : 1;
    
    // Variable costs
    const variableCosts = (inputs.cost_per_unit || 0) + (inputs.marketing_spend || 0) + (inputs.variable_costs || 0) + (inputs.sales_spend || 0) + (inputs.utilities || 0) + (inputs.logistics_cost || 0) + (inputs.variable_salaries || 0);
    const totalVariableCost = (inputs.cost_per_unit || 0) * unitsEstimate + (inputs.logistics_cost || 0) + (inputs.variable_salaries || 0);
    
    // Fixed costs
    const fixedCosts = (inputs.fixed_costs_opex_rent_salaries || 0) + (inputs.tools || 0) + (inputs.other_fixed_costs || 0);
    
    // CapEx
    const capex = (inputs.machinery || 0) + (inputs.server || 0) + (inputs.vehicles || 0) + (inputs.office_setup || 0) + (inputs.other_capex || 0);
    
    // Totals
    const totalOpex = totalVariableCost + fixedCosts;
    const totalCapex = capex;
    const monthlyExpenses = (inputs.monthly_expenses || 0) || totalOpex;
    
    // Unit Economics (CM1, CM2, CM3)
    const sellingPrice = inputs.selling_price || 0;
    const cm1 = sellingPrice - (inputs.cost_per_unit || 0);
    const cm2 = cm1 - ((inputs.variable_salaries || 0) / Math.max(unitsEstimate, 1)) - ((inputs.logistics_cost || 0) / Math.max(unitsEstimate, 1));
    const cm3 = cm2 - ((inputs.marketing_spend || 0) / Math.max(unitsEstimate, 1)) - ((inputs.sales_spend || 0) / Math.max(unitsEstimate, 1));
    
    // Profit per unit and customer
    const currentProfit = inputs.current_profit || 0;
    const profitPerUnit = unitsEstimate > 0 ? currentProfit / unitsEstimate : 0;
    const thisMonthCustomers = inputs.this_month_customers || 1;
    const profitPerCustomer = thisMonthCustomers > 0 ? currentProfit / thisMonthCustomers : 0;
    
    // Cost Ratios
    const variableCostRatio = revenue > 0 ? (totalVariableCost / revenue) * 100 : 0;
    const fixedCostRatio = revenue > 0 ? (fixedCosts / revenue) * 100 : 0;
    const opexRatio = revenue > 0 ? (totalOpex / revenue) * 100 : 0;
    const capexRatio = revenue > 0 ? (totalCapex / revenue) * 100 : 0;
    
    // Month-over-Month changes
    const revenueMom = lastMonthRevenue > 0 ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const lastProfit = inputs.last_profit || 0;
    const profitMom = lastProfit > 0 ? ((currentProfit - lastProfit) / lastProfit) * 100 : 0;
    const lastMonthCustomers = inputs.last_month_customers || 1;
    const customerMom = lastMonthCustomers > 0 ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;
    
    return {
      variableCosts,
      fixedCosts,
      capex,
      monthlyExpenses,
      currentProfit,
      lastProfit,
      cashInBank: inputs.cash_in_bank || 0,
      profitTrend: currentProfit - lastProfit,
      // Unit Economics
      cm1,
      cm2,
      cm3,
      profitPerUnit,
      profitPerCustomer,
      // Totals
      totalVariableCost,
      fixedCost: fixedCosts,
      totalOpex,
      totalCapex,
      // Ratios
      variableCostRatio,
      fixedCostRatio,
      opexRatio,
      capexRatio,
      // MoM
      revenueMom,
      profitMom,
      customerMom,
      // Supporting
      unitsEstimate,
      revenue,
      lastMonthRevenue
    };
  };

  const metrics = calculateMetrics();

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
          {Object.keys(inputs)
            .filter(key => key !== 'industry_type')
            .map(key => (
              <InputGroup
                key={key}
                label={key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())}
                name={key}
                val={inputs[key]}
                onChange={handleInputChange}
                isDark={isDarkMode}
              />
            ))}
        </div>
      </div>

      {/* --- SECTION 1: CRITICAL METRICS (TOP) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cash in Bank - Top Priority */}
        <div className={`p-8 rounded-xl border-2 ${COLORS.cardBg} bg-gradient-to-br ${isDarkMode ? 'from-cyan-900/30 to-blue-900/20' : 'from-cyan-50 to-blue-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">💰 Cash in Bank</p>
            <span className={`text-xs px-3 py-1 rounded-full ${metrics.cashInBank > 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
              {metrics.cashInBank > 0 ? 'Available' : 'Critical'}
            </span>
          </div>
          <div className="text-5xl font-bold text-cyan-400 mb-2">${metrics.cashInBank.toLocaleString()}</div>
          <div className="text-sm text-slate-400 mb-4">
            Runway: <span className="font-bold text-orange-400">{metrics.monthlyExpenses > 0 ? (metrics.cashInBank / metrics.monthlyExpenses).toFixed(1) : '∞'} months</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Net Profit/Loss - Top Priority */}
        <div className={`p-8 rounded-xl border-2 ${COLORS.cardBg} bg-gradient-to-br ${isDarkMode ? metrics.currentProfit >= 0 ? 'from-green-900/30 to-emerald-900/20' : 'from-red-900/30 to-pink-900/20' : metrics.currentProfit >= 0 ? 'from-green-50 to-emerald-50' : 'from-red-50 to-pink-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">{metrics.currentProfit >= 0 ? '📈 Net Profit' : '📉 Net Loss'}</p>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${metrics.currentProfit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {metrics.currentProfit >= 0 ? '✅ Profitable' : '⚠️ Loss-making'}
            </span>
          </div>
          <div className={`text-5xl font-bold mb-2 ${metrics.currentProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(metrics.currentProfit).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400 mb-4">
            vs Last Month: <span className={`font-bold ${metrics.profitMom >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.profitMom >= 0 ? '+' : ''}{metrics.profitMom.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full ${metrics.currentProfit >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'}`} style={{ width: `${Math.min(Math.abs(metrics.currentProfit / 10000) * 100, 100)}%` }}></div>
          </div>
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
        <KPICard title="Variable Costs" value={`$${metrics.variableCosts.toLocaleString()}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("Variable Costs", metrics.variableCosts)} />
        <KPICard title="Fixed Costs" value={`$${metrics.fixedCosts.toLocaleString()}`} icon={Activity} theme={COLORS} onAnalyze={() => handleAiAnalyze("Fixed Costs", metrics.fixedCosts)} />
        <KPICard title="Current Profit" value={`$${metrics.currentProfit.toLocaleString()}`} icon={metrics.currentProfit >= 0 ? TrendingUp : TrendingDown} theme={COLORS} onAnalyze={() => handleAiAnalyze("Current Profit", metrics.currentProfit)} />
        <KPICard title="Cash in Bank" value={`$${metrics.cashInBank.toLocaleString()}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("Cash", metrics.cashInBank)} />
      </div>

      {/* --- SECTION 2B: UNIT ECONOMICS KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard title="CM1" value={`$${metrics.cm1.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("CM1", metrics.cm1)} />
        <KPICard title="CM2" value={`$${metrics.cm2.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("CM2", metrics.cm2)} />
        <KPICard title="CM3" value={`$${metrics.cm3.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("CM3", metrics.cm3)} />
        <KPICard title="Profit/Unit" value={`$${metrics.profitPerUnit.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={TrendingUp} theme={COLORS} onAnalyze={() => handleAiAnalyze("Profit per Unit", metrics.profitPerUnit)} />
        <KPICard title="Profit/Customer" value={`$${metrics.profitPerCustomer.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} theme={COLORS} onAnalyze={() => handleAiAnalyze("Profit per Customer", metrics.profitPerCustomer)} />
      </div>

      {/* --- SECTION 2C: COST RATIOS & MoM --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Ratios */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Cost Ratios (% of Revenue)</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Variable Cost Ratio</span>
              <span className={`font-mono font-bold ${COLORS.cardText}`}>{metrics.variableCostRatio.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.variableCostRatio, 100)}%` }}></div>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-400">Fixed Cost Ratio</span>
              <span className={`font-mono font-bold ${COLORS.cardText}`}>{metrics.fixedCostRatio.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.fixedCostRatio, 100)}%` }}></div>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-400">OpEx Ratio</span>
              <span className={`font-mono font-bold ${COLORS.cardText}`}>{metrics.opexRatio.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.opexRatio, 100)}%` }}></div>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-400">CapEx Ratio</span>
              <span className={`font-mono font-bold ${COLORS.cardText}`}>{metrics.capexRatio.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.capexRatio, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Month-over-Month Changes */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Month-over-Month Growth</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Revenue MoM</span>
                <span className={`font-mono font-bold ${metrics.revenueMom >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.revenueMom.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full ${metrics.revenueMom >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.revenueMom), 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Profit MoM</span>
                <span className={`font-mono font-bold ${metrics.profitMom >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.profitMom.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full ${metrics.profitMom >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.profitMom), 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Customer MoM</span>
                <span className={`font-mono font-bold ${metrics.customerMom >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.customerMom.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full ${metrics.customerMom >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.customerMom), 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2D: GROWTH METRICS --- */}
      <div className={`p-8 rounded-xl border ${COLORS.cardBg} bg-gradient-to-br ${isDarkMode ? 'from-slate-900 to-slate-800' : 'from-white to-slate-50'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${COLORS.cardText}`}>
            <TrendingUp className="text-green-500" size={28} /> Growth Metrics
          </h2>
          <span className={`text-sm font-semibold px-4 py-2 rounded-lg ${metrics.revenueMom >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {metrics.revenueMom >= 0 ? '📈 Growing' : '📉 Declining'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Growth */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-green-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Revenue Growth (MoM)</p>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-green-400">{metrics.revenueMom.toFixed(1)}%</div>
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className={`h-3 rounded-full ${metrics.revenueMom >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.revenueMom), 100)}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">Prev: ${metrics.lastMonthRevenue.toLocaleString()} → Now: ${metrics.revenue.toLocaleString()}</p>
          </div>

          {/* Profit Growth */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-blue-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Profit Growth (MoM)</p>
            <div className="flex items-end gap-4">
              <div className={`text-4xl font-bold ${metrics.profitMom >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{metrics.profitMom.toFixed(1)}%</div>
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className={`h-3 rounded-full ${metrics.profitMom >= 0 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.profitMom), 100)}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">Prev: ${metrics.lastProfit.toLocaleString()} → Now: ${metrics.currentProfit.toLocaleString()}</p>
          </div>

          {/* Customer Growth */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-purple-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Customer Growth (MoM)</p>
            <div className="flex items-end gap-4">
              <div className={`text-4xl font-bold ${metrics.customerMom >= 0 ? 'text-purple-400' : 'text-red-400'}`}>{metrics.customerMom.toFixed(1)}%</div>
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className={`h-3 rounded-full ${metrics.customerMom >= 0 ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(metrics.customerMom), 100)}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">Prev: {inputs.last_month_customers} → Now: {inputs.this_month_customers}</p>
          </div>
        </div>

        {/* Unit Economics Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-700">
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${COLORS.cardText} mb-4`}>Unit Economics</h3>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">CM1 (Selling Price - COGS)</span>
              <span className="text-xl font-bold text-green-400">${metrics.cm1.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">CM2 (CM1 - Var Salaries - Logistics)</span>
              <span className="text-xl font-bold text-green-400">${metrics.cm2.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">CM3 (CM2 - Marketing - Sales)</span>
              <span className="text-xl font-bold text-green-400">${metrics.cm3.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${COLORS.cardText} mb-4`}>Profitability Per</h3>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Profit per Unit</span>
              <span className="text-xl font-bold text-cyan-400">${metrics.profitPerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Profit per Customer</span>
              <span className="text-xl font-bold text-cyan-400">${metrics.profitPerCustomer.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Runway (months)</span>
              <span className="text-xl font-bold text-orange-400">
                {metrics.monthlyExpenses > 0 ? (metrics.cashInBank / metrics.monthlyExpenses).toFixed(1) : '∞'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2E: BURN RATE & COSTS --- */}
      <div className={`p-8 rounded-xl border ${COLORS.cardBg} bg-gradient-to-br ${isDarkMode ? 'from-slate-900 to-red-900/10' : 'from-white to-red-50'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${COLORS.cardText}`}>
            <Activity className="text-red-500" size={28} /> Burn Rate & Costs
          </h2>
          <span className={`text-sm font-semibold px-4 py-2 rounded-lg ${metrics.monthlyExpenses <= metrics.revenue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {metrics.monthlyExpenses <= metrics.revenue ? '✅ Profitable' : '⚠️ Burn Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Monthly Burn */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-red-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Monthly Burn Rate</p>
            <div className="text-4xl font-bold text-red-400 mb-2">${metrics.monthlyExpenses.toLocaleString()}</div>
            <div className="text-sm text-slate-400 mb-4">
              Runway: <span className="font-bold text-orange-400">{metrics.monthlyExpenses > 0 ? (metrics.cashInBank / metrics.monthlyExpenses).toFixed(1) : '∞'} months</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min((metrics.monthlyExpenses / (metrics.revenue || 1)) * 100, 100)}%` }}></div>
            </div>
          </div>

          {/* Variable Cost Burn */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-orange-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Variable Costs (Monthly)</p>
            <div className="text-4xl font-bold text-orange-400 mb-2">${metrics.totalVariableCost.toLocaleString()}</div>
            <div className="text-sm text-slate-400 mb-4">
              <span className="font-bold">{metrics.variableCostRatio.toFixed(1)}%</span> of revenue
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.variableCostRatio, 100)}%` }}></div>
            </div>
          </div>

          {/* Fixed Cost Burn */}
          <div className="bg-slate-900/30 rounded-lg p-6 border border-yellow-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Fixed Costs (Monthly)</p>
            <div className="text-4xl font-bold text-yellow-400 mb-2">${metrics.fixedCosts.toLocaleString()}</div>
            <div className="text-sm text-slate-400 mb-4">
              <span className="font-bold">{metrics.fixedCostRatio.toFixed(1)}%</span> of revenue
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.fixedCostRatio, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 overflow-x-auto">
          <h3 className={`text-lg font-bold ${COLORS.cardText} mb-4`}>Detailed Cost Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 py-2 px-3">Cost Category</th>
                <th className="text-right text-slate-400 py-2 px-3">Amount</th>
                <th className="text-right text-slate-400 py-2 px-3">% of Revenue</th>
                <th className="text-right text-slate-400 py-2 px-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 px-3 text-slate-300">Variable Costs</td>
                <td className="py-3 px-3 text-right font-mono text-orange-400">${metrics.totalVariableCost.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-orange-400">{metrics.variableCostRatio.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right"><span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Variable</span></td>
              </tr>
              <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 px-3 text-slate-300">Fixed Costs</td>
                <td className="py-3 px-3 text-right font-mono text-yellow-400">${metrics.fixedCosts.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-yellow-400">{metrics.fixedCostRatio.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right"><span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Fixed</span></td>
              </tr>
              <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 px-3 text-slate-300">Total OpEx</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-red-400">${metrics.totalOpex.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-red-400">{metrics.opexRatio.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right"><span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">Total</span></td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="py-3 px-3 text-slate-300">Total CapEx</td>
                <td className="py-3 px-3 text-right font-mono text-purple-400">${metrics.totalCapex.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-purple-400">{metrics.capexRatio.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right"><span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Capex</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cash Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-700">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-3">Cash in Bank</p>
            <div className="text-4xl font-bold text-cyan-400 mb-4">${metrics.cashInBank.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-700 rounded-full">
                <div className="h-2 bg-cyan-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-sm text-slate-400">75% funded</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-3">Net Profit (This Month)</p>
            <div className={`text-4xl font-bold mb-4 ${metrics.currentProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${metrics.currentProfit.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400">
              {metrics.currentProfit >= 0 ? '✅ Profitable' : '⚠️ Loss-making'}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Cost Structure</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Variable Costs', value: metrics.variableCosts },
                    { name: 'Fixed Costs', value: metrics.fixedCosts },
                    { name: 'CapEx', value: metrics.capex },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Variable</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Fixed</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> CapEx</div>
            </div>
          </div>
        </div>

        {/* Chart 2: Monthly Expenses Breakdown */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Monthly Expenses Distribution</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Variable', value: metrics.variableCosts, fill: '#f97316' },
                { name: 'Fixed', value: metrics.fixedCosts, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.text} opacity={0.2} />
                <XAxis dataKey="name" stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#f97316">
                  {[{ fill: '#f97316' }, { fill: '#ef4444' }].map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Profit Trend */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>Profit Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Last Month', value: metrics.lastProfit },
                { name: 'This Month', value: metrics.currentProfit }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.text} opacity={0.2} />
                <XAxis dataKey="name" stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value">
                  <Cell fill={metrics.lastProfit >= 0 ? '#10b981' : '#ef4444'} />
                  <Cell fill={metrics.currentProfit >= 0 ? '#10b981' : '#ef4444'} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3B: CapEx Breakdown Bar Chart */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>CapEx by Category</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Machinery', value: inputs.machinery || 0, fill: '#3b82f6' },
                { name: 'Server', value: inputs.server || 0, fill: '#8b5cf6' },
                { name: 'Vehicles', value: inputs.vehicles || 0, fill: '#06b6d4' },
                { name: 'Office', value: inputs.office_setup || 0, fill: '#f59e0b' },
                { name: 'Other', value: inputs.other_capex || 0, fill: '#ec4899' }
              ].filter(item => item.value > 0)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.text} opacity={0.2} />
                <XAxis dataKey="name" stroke={COLORS.text} tick={{ fontSize: 11 }} />
                <YAxis stroke={COLORS.text} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#3b82f6">
                  {[
                    { fill: '#3b82f6' },
                    { fill: '#8b5cf6' },
                    { fill: '#06b6d4' },
                    { fill: '#f59e0b' },
                    { fill: '#ec4899' }
                  ].map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: CapEx Allocation */}
        <div className={`p-6 rounded-xl border ${COLORS.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${COLORS.cardText}`}>CapEx Allocation</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Machinery', value: inputs.machinery || 0 },
                    { name: 'Server', value: inputs.server || 0 },
                    { name: 'Vehicles', value: inputs.vehicles || 0 },
                    { name: 'Office Setup', value: inputs.office_setup || 0 },
                    { name: 'Other CapEx', value: inputs.other_capex || 0 }
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#06b6d4" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* CapEx Breakdown */}
          <div className="mt-6 space-y-3 pt-6 border-t border-slate-700">
            {[
              { label: 'Machinery', value: inputs.machinery || 0, color: 'bg-blue-500/20 text-blue-400', icon: '⚙️' },
              { label: 'Server', value: inputs.server || 0, color: 'bg-purple-500/20 text-purple-400', icon: '🖥️' },
              { label: 'Vehicles', value: inputs.vehicles || 0, color: 'bg-cyan-500/20 text-cyan-400', icon: '🚗' },
              { label: 'Office Setup', value: inputs.office_setup || 0, color: 'bg-amber-500/20 text-amber-400', icon: '🏢' },
              { label: 'Other CapEx', value: inputs.other_capex || 0, color: 'bg-pink-500/20 text-pink-400', icon: '📦' }
            ]
              .filter(item => item.value > 0)
              .map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-slate-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-2 py-1 rounded ${item.color}`}>
                      {((item.value / metrics.totalCapex) * 100).toFixed(0)}%
                    </span>
                    <span className="font-mono font-bold text-slate-400 w-24 text-right">${item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600 mt-4">
              <span className="font-bold text-slate-300">Total CapEx</span>
              <span className="font-mono font-bold text-slate-200 text-lg">${metrics.totalCapex.toLocaleString()}</span>
            </div>
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