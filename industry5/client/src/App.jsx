import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserCircle, Sun, Moon, Database, LayoutDashboard } from 'lucide-react';

// --- COMPONENTS ---
import Sidebar from './components/layout/Sidebar';
import UniversalCore from './components/dashboard/UniversalCore';
import ModuleSelector from './components/onboarding/ModuleSelector';
import LogicBuilder from './components/onboarding/LogicBuilder';
import ChatWidget from './components/ChatWidget';
import DatabaseView from './components/DatabaseView';
import Login from './components/auth/Login';

// --- PLACEHOLDERS ---
const FinancialView = () => <div className="p-8 text-slate-500">Financial View Component</div>;
const AiAnalystView = () => <div className="p-8 text-slate-500">AI Analyst View Component</div>;
const IndustryView = () => <div className="p-8 text-slate-500">Industry View Component</div>;

function MainApp() {
  // --- STATE FOR DATA ---
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- HANDLERS ---
  const handleIndustrySelect = (industry, navigate) => {
    setSelectedIndustry(industry);
    navigate('/builder');
  };

  const handleLaunchDashboard = (data, navigate) => {
    setBusinessData(data);
    navigate('/dashboard');
  };

  return (
    <Router>
      <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/select"
            element={<SelectorWrapper onSelect={handleIndustrySelect} />}
          />

          <Route
            path="/builder"
            element={
              selectedIndustry ? (
                <BuilderWrapper
                  industryData={selectedIndustry}
                  onComplete={handleLaunchDashboard}
                />
              ) : <Navigate to="/select" />
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <DashboardLayout
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                businessData={businessData}
                selectedIndustry={selectedIndustry}
              />
            }
          />
        </Routes>

        {/* Chat Widget available globally or just on dashboard? Usually global is fine but prompt implied dashboard section. 
            Putting it here makes it available everywhere which is good for help. */}
        <ChatWidget />
      </div>
    </Router>
  );
}

// Wrapper to provide navigation prop to ModuleSelector
const SelectorWrapper = ({ onSelect }) => {
  const navigate = useNavigate();
  return <ModuleSelector onSelect={(i) => onSelect(i, navigate)} />;
};

// Wrapper for Builder
const BuilderWrapper = ({ industryData, onComplete }) => {
  const navigate = useNavigate();
  return <LogicBuilder industryData={industryData} onComplete={(d) => onComplete(d, navigate)} />;
};

// Dashboard Layout Component
const DashboardLayout = ({ isDarkMode, setIsDarkMode, businessData, selectedIndustry }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'database'

  const bgClass = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const headerClass = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="flex min-h-screen">
      {viewMode === 'dashboard' && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${viewMode === 'dashboard' ? 'ml-64' : 'ml-0'}`}>

        {/* HEADER */}
        <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300 ${headerClass}`}>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 text-sm block leading-none mb-1">Workspace</span>
              <span className={`font-bold text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedIndustry?.label || 'Industry 5.0 Core'}
              </span>
            </div>

            <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button
                onClick={() => setViewMode('database')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'database' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Database size={16} /> Data (DB)
              </button>
            </div>
          </div>

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

        {/* CONTENT */}
        <div className={`flex-1 overflow-auto ${bgClass}`}>
          {viewMode === 'database' ? (
            <DatabaseView />
          ) : (
            <>
              {activeTab === 'overview' && <UniversalCore isDarkMode={isDarkMode} data={businessData} />}
              {activeTab === 'financials' && <FinancialView />}
              {activeTab === 'ai-analyst' && <AiAnalystView />}
              {activeTab === 'industry' && <IndustryView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainApp;