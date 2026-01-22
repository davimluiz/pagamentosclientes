
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Trophy, FileUp, LogOut, Menu, X, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
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

  // Persistence simulation
  useEffect(() => {
    const savedAuth = localStorage.getItem('finance_bi_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wallet className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="text-white font-bold text-xl tracking-tight">FinanceBI</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('dashboard')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Clientes" 
            active={currentView === 'clients'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('clients')} 
          />
          <NavItem 
            icon={<Trophy size={20} />} 
            label="Ranking" 
            active={currentView === 'ranking'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('ranking')} 
          />
          <NavItem 
            icon={<FileUp size={20} />} 
            label="Importar Dados" 
            active={currentView === 'import'} 
            expanded={isSidebarOpen}
            onClick={() => setCurrentView('import')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin Financeiro</p>
              <p className="text-xs text-slate-500">Acesso Geral</p>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/40/40" 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, expanded, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <div className="shrink-0">{icon}</div>
    {expanded && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

export default App;
