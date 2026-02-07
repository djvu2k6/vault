import React from 'react';
import { LayoutDashboard, LineChart, BrainCircuit, Settings, Factory } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Universal Core', icon: LayoutDashboard },
    { id: 'financials', label: 'Financial Waterfall', icon: LineChart },
    { id: 'ai-analyst', label: 'Vault AI Analyst', icon: BrainCircuit, color: 'text-purple-400' },
    { id: 'industry', label: 'Industry Module', icon: Factory },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      {/* 1. Logo Area */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">V</div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">VAULT</h1>
          <p className="text-xs text-slate-400">Industry 5.0 Engine</p>
        </div>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon size={20} className={`${item.color || ''} ${isActive ? 'text-blue-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
              
              {/* Active Dot Indicator */}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
            </button>
          );
        })}
      </nav>

      {/* 3. Footer Settings */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full transition-colors">
          <Settings size={18} />
          <span className="text-sm">System Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;