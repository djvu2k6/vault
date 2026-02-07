import React, { useMemo } from 'react';
import {
  TrendingUp, Users, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const SaasDashboard = ({ data, isDarkMode }) => {

  // --- SAFE PARSING HELPER ---
  const getVal = (category, id) => {
    if (!data || !data[category] || !Array.isArray(data[category])) return 0;
    const item = data[category].find(i => i.id === id);
    return item ? (parseFloat(item.value) || 0) : 0;
  };

  // --- METRICS CALCULATION ---
  const metrics = useMemo(() => {
    // Default safe values
    const safeMetrics = {
      mrr: 0, arr: 0, arpu: 0, churnRate: 0, ltv: 0,
      netRevenue: 0, grossRevenue: 0, trialConversionRate: 0,
      activeUsers: 0, totalUsers: 0, paidUsers: 0, newSignups: 0
    };

    if (!data) return safeMetrics;

    try {
      // Basic Inputs
      const totalUsers = getVal('users', 'total_users');
      const activeUsers = getVal('users', 'active_users');
      const paidUsers = getVal('users', 'paid_users');
      const churnedUsers = getVal('users', 'churned_users');
      const newSignups = getVal('users', 'new_signups');

      const paymentsReceived = getVal('revenue', 'payments_received');
      const refunds = getVal('revenue', 'refunds_issued');

      const trialStarts = getVal('usage', 'trial_starts');
      const trialConversions = getVal('usage', 'trial_conversions');

      // Logic
      const grossRevenue = paymentsReceived;
      const netRevenue = paymentsReceived - refunds;
      const mrr = netRevenue;
      const arr = mrr * 12;

      const arpu = activeUsers > 0 ? (mrr / activeUsers) : 0;
      const churnRate = activeUsers > 0 ? (churnedUsers / activeUsers) * 100 : 0;
      const trialConversionRate = trialStarts > 0 ? (trialConversions / trialStarts) * 100 : 0;

      // LTV
      const churnDecimal = churnRate / 100;
      // Cap LTV arithmetic to avoid infinity
      const ltv = churnDecimal > 0.001 ? (arpu / churnDecimal) : (arpu * 24);

      return {
        mrr, arr, arpu, churnRate, ltv,
        netRevenue, grossRevenue, trialConversionRate,
        activeUsers, totalUsers, paidUsers, newSignups
      };
    } catch (e) {
      console.warn("Error calculating SaaS metrics:", e);
      return safeMetrics;
    }
  }, [data]);

  // --- THEME COLORS ---
  const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    background: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#e2e8f0' : '#1e293b',
    grid: isDarkMode ? '#334155' : '#e2e8f0'
  };

  const cardClass = `p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm transition-all hover:shadow-md`;

  // --- RENDER CHECK ---
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 animate-in fade-in">
        <div className="p-4 rounded-full bg-slate-800/50 mb-4">
          <Activity className="text-slate-400" size={32} />
        </div>
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Data Available</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          Please iterate through the SaaS Configuration Builder to generate insights.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SaaS Executive Overview</h1>
        <p className="text-slate-500">Real-time performance metrics and growth analysis.</p>
      </div>

      {/* --- KPI ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="MRR"
          value={`$${metrics.mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subValue={`ARR: $${metrics.arr.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={DollarSign} color="text-blue-500" trend="+12%" cardClass={cardClass}
        />
        <KpiCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          subValue={`${metrics.paidUsers.toLocaleString()} Paid`}
          icon={Users} color="text-emerald-500" trend="+5%" cardClass={cardClass}
        />
        <KpiCard
          title="Churn Rate"
          value={`${metrics.churnRate.toFixed(2)}%`}
          subValue="Monthly"
          icon={Activity} color="text-red-500" trend="-0.5%" positiveTrend={true} cardClass={cardClass}
        />
        <KpiCard
          title="LTV"
          value={`$${metrics.ltv.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subValue={`ARPU: $${metrics.arpu.toFixed(2)}`}
          icon={TrendingUp} color="text-purple-500" trend="+8%" cardClass={cardClass}
        />
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart: MRR Trend */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trajectory (Projection)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateDummyTrendData(metrics.mrr)}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: COLORS.background, borderColor: COLORS.grid, borderRadius: '12px', color: COLORS.text }}
                  itemStyle={{ color: COLORS.text }}
                />
                <Area type="monotone" dataKey="value" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Users */}
        <div className={cardClass}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>User Distribution</h3>
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Paid', value: metrics.paidUsers || 0 },
                    { name: 'Free', value: (metrics.activeUsers - metrics.paidUsers) > 0 ? (metrics.activeUsers - metrics.paidUsers) : 0 },
                    { name: 'Churned', value: (metrics.totalUsers - metrics.activeUsers) > 0 ? (metrics.totalUsers - metrics.activeUsers) : 0 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS.success} />
                  <Cell fill={COLORS.primary} />
                  <Cell fill={COLORS.grid} />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{metrics.totalUsers}</span>
              <span className="text-sm text-slate-500">Total Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SUMMARY GRID --- */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Detailed Unit Economics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <MetricItem label="Trial Conversion" value={`${metrics.trialConversionRate.toFixed(1)}%`} isDark={isDarkMode} />
          <MetricItem label="New Signups" value={metrics.newSignups} isDark={isDarkMode} />
          <MetricItem label="Net Revenue" value={`$${metrics.netRevenue.toLocaleString()}`} isDark={isDarkMode} />
          <MetricItem label="Gross Revenue" value={`$${metrics.grossRevenue.toLocaleString()}`} isDark={isDarkMode} />
        </div>
      </div>

    </div>
  );
};

// --- HELPER COMPONENTS ---
const KpiCard = ({ title, value, subValue, icon: Icon, color, trend, positiveTrend, cardClass }) => (
  <div className={cardClass}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-')}/10`}>
        <Icon className={color} size={24} />
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${positiveTrend !== false ? 'text-emerald-500' : 'text-red-500'} bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg`}>
          {positiveTrend !== false ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
    {subValue && <div className="text-sm text-slate-400">{subValue}</div>}
  </div>
);

const MetricItem = ({ label, value, isDark }) => (
  <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-lg font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
  </div>
);

// Safely generate dummy data
const generateDummyTrendData = (baseValue) => {
  const safeBase = (baseValue && !isNaN(baseValue) && baseValue > 0) ? baseValue : 1000;
  return Array.from({ length: 6 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    value: safeBase * (0.8 + (i * 0.1) + (Math.random() * 0.1))
  }));
};

export default SaasDashboard;
