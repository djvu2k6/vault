import React, { useState } from 'react';
import { Bell, UserCircle, Sun, Moon, Database, LayoutDashboard } from 'lucide-react';

// --- COMPONENTS ---
import Sidebar from './components/layout/Sidebar';
import UniversalCore from './components/dashboard/UniversalCore';
import ModuleSelector from './components/onboarding/ModuleSelector';
import LogicBuilder from './components/onboarding/LogicBuilder';
import ChatWidget from './components/ChatWidget';
import DatabaseView from './components/DatabaseView'; // <--- NEW IMPORT

// --- PLACEHOLDERS ---
const FinancialView = () => <div className="p-8 text-slate-500">Financial View Component</div>;
const AiAnalystView = () => <div className="p-8 text-slate-500">AI Analyst View Component</div>;
const IndustryView = () => <div className="p-8 text-slate-500">Industry View Component</div>;

function App() {
  // --- STATE FOR ONBOARDING FLOW ---
  const [appState, setAppState] = useState('selector'); // 'selector' | 'builder' | 'dashboard'
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [businessData, setBusinessData] = useState(null);

  // --- STATE FOR DASHBOARD MODE ---
  const [activeTab, setActiveTab] = useState('overview'); // Controls Sidebar selection
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' (Visuals) | 'database' (Table)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- HANDLERS ---
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setAppState('builder');
  };

  const handleLaunchDashboard = (data) => {
    setBusinessData(data); // Save the customized data
    setAppState('dashboard');
  };

  // =========================================================
  // RENDER PHASE 1: INDUSTRY SELECTOR
  // =========================================================
  if (appState === 'selector') {
    return <ModuleSelector onSelect={handleIndustrySelect} />;
  }

  // =========================================================
  // RENDER PHASE 2: LOGIC BUILDER
  // =========================================================
  if (appState === 'builder') {
    return <LogicBuilder industryData={selectedIndustry} onComplete={handleLaunchDashboard} />;
  }

  // =========================================================
  // RENDER PHASE 3: MAIN APP (Dashboard & Database)
  // =========================================================
  
  // Dynamic Styles based on Dark Mode
  const bgClass = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const textClass = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const headerClass = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`flex min-h-screen font-sans ${bgClass} ${textClass}`}>
      
      {/* SIDEBAR: Only show if we are in 'Dashboard' viewMode. 
        If we are in 'Database' mode, we hide sidebar to give full width to the table.
      */}
      {viewMode === 'dashboard' && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${viewMode === 'dashboard' ? 'ml-64' : 'ml-0'}`}>
        
        {/* --- HEADER --- */}
        <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300 ${headerClass}`}>
          
          {/* Left: Title & Toggle */}
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 text-sm block leading-none mb-1">Workspace</span>
              <span className={`font-bold text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedIndustry?.label || 'Industry 5.0 Core'}
              </span>
            </div>

            {/* --- VIEW MODE TOGGLE (Dashboard vs DB) --- */}
            <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button 
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button 
                onClick={() => setViewMode('database')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'database' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Database size={16} /> Data (DB)
              </button>
            </div>
          </div>
          
          {/* Right: User & Settings */}
          <div className="flex items-center gap-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className={`h-8 w-[1px] mx-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Alok K L</p>
                <p className="text-xs text-blue-500 font-medium">Admin</p>
              </div>
              <UserCircle size={32} className={isDarkMode ? 'text-slate-300' : 'text-slate-400'} />
            </div>
          </div>
        </header>

        {/* --- DYNAMIC CONTENT BODY --- */}
        <div className={`flex-1 overflow-auto ${bgClass}`}>
          
          {/* SCENARIO A: DATABASE VIEW (Full Width) */}
          {viewMode === 'database' ? (
            <DatabaseView />
          ) : (
            /* SCENARIO B: DASHBOARD VIEW (With Sidebar Tabs) */
            <>
              {activeTab === 'overview' && <UniversalCore isDarkMode={isDarkMode} data={businessData} />} 
              {activeTab === 'financials' && <FinancialView />}
              {activeTab === 'ai-analyst' && <AiAnalystView />}
              {activeTab === 'industry' && <IndustryView />}
            </>
          )}

        </div>
        
      </main>

      {/* --- CHAT WIDGET (Always on top) --- */}
      <ChatWidget />
      
    </div>
  );
}

export default App;