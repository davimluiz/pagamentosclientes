
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Trophy, FileUp, LogOut, Menu, X, Wallet } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientsList from './components/ClientsList';
import Ranking from './components/Ranking';
import ImportData from './components/ImportData';
import { AppView, Client } from './types';
import { mockClients } from './mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('finance_bi_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('finance_bi_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('finance_bi_auth');
  };

  const updateClients = (newClients: Client[]) => {
    setClients(newClients);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard clients={clients} />;
      case 'clients': return <ClientsList clients={clients} />;
      case 'ranking': return <Ranking clients={clients} />;
      case 'import': return <ImportData onImport={updateClients} currentClients={clients} />;
      default: return <Dashboard clients={clients} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-slate-900 transition-all duration-500 ease-in-out flex flex-col z-50`}>
        <div className="p-8 flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="text-white font-black text-2xl tracking-tighter">FinanceBI</span>}
        </div>

        <nav className="flex-1 mt-6 px-6 space-y-3">
          <NavItem icon={<LayoutDashboard size={22} />} label="Dashboard" active={currentView === 'dashboard'} expanded={isSidebarOpen} onClick={() => setCurrentView('dashboard')} />
          <NavItem icon={<Users size={22} />} label="Base de Clientes" active={currentView === 'clients'} expanded={isSidebarOpen} onClick={() => setCurrentView('clients')} />
          <NavItem icon={<Trophy size={22} />} label="Ranking de Risco" active={currentView === 'ranking'} expanded={isSidebarOpen} onClick={() => setCurrentView('ranking')} />
          <NavItem icon={<FileUp size={22} />} label="Importação" active={currentView === 'import'} expanded={isSidebarOpen} onClick={() => setCurrentView('import')} />
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-4 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-300 font-bold text-sm">
            <LogOut size={22} />
            {isSidebarOpen && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F1F5F9]">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">Admin Financeiro</p>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sessão Ativa</p>
              </div>
            </div>
            <div className="p-1 border-2 border-slate-100 rounded-2xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Profile" className="w-10 h-10 rounded-xl bg-slate-50" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<any> = ({ icon, label, active, expanded, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 font-bold' : 'text-slate-500 hover:text-white hover:bg-slate-800/50 font-semibold'}`}>
    <div className="shrink-0">{icon}</div>
    {expanded && <span className="whitespace-nowrap text-sm">{label}</span>}
  </button>
);

export default App;
