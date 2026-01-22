
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, AlertCircle, DollarSign, TrendingDown, ChevronRight, Mail, Phone } from 'lucide-react';
import { Client, KPIStats } from '../types';

interface DashboardProps {
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients }) => {
  const stats: KPIStats = {
    totalClients: clients.length,
    delinquentClients: clients.filter(c => c.status === 'Inadimplente').length,
    totalOverdueAmount: clients.reduce((sum, c) => sum + c.overdueAmount, 0),
    delinquencyRate: 0,
  };
  stats.delinquencyRate = stats.totalClients > 0 ? (stats.delinquentClients / stats.totalClients) * 100 : 0;

  // Chart Data: Inadimplência por Período (Mocked monthly summary based on current client set)
  const barData = [
    { name: 'Jan', value: 45000 },
    { name: 'Fev', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Abr', value: 61000 },
    { name: 'Mai', value: 55000 },
    { name: 'Jun', value: stats.totalOverdueAmount },
  ];

  const pieData = [
    { name: 'Em dia', value: stats.totalClients - stats.delinquentClients, color: '#10b981' },
    { name: 'Inadimplentes', value: stats.delinquentClients, color: '#ef4444' },
  ];

  const criticalClients = clients
    .filter(c => c.status === 'Inadimplente')
    .sort((a, b) => b.overdueAmount - a.overdueAmount)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Executivo</h1>
          <p className="text-slate-500">Visão geral do controle financeiro e saúde da carteira.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm">
          <span className="text-slate-500">Período:</span>
          <span className="font-semibold text-slate-900">Últimos 6 meses</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total de Clientes" 
          value={stats.totalClients.toString()} 
          icon={<Users className="text-blue-600" />} 
          color="blue"
        />
        <KPICard 
          title="Inadimplentes" 
          value={stats.delinquentClients.toString()} 
          icon={<AlertCircle className="text-red-600" />} 
          color="red"
          highlight
        />
        <KPICard 
          title="Valor em Atraso" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalOverdueAmount)} 
          icon={<DollarSign className="text-orange-600" />} 
          color="orange"
        />
        <KPICard 
          title="Taxa de Inadimplência" 
          value={`${stats.delinquencyRate.toFixed(1)}%`} 
          icon={<TrendingDown className="text-purple-600" />} 
          color="purple"
          subtext="vs 12.4% mês anterior"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Evolução da Inadimplência (R$)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Status da Carteira</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Clients Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Ação Imediata: Maiores Inadimplentes</h3>
          <button className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Ver Ranking Completo <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Contato Prioritário</th>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4 text-right">Dívida Atual</th>
                <th className="px-6 py-4 text-center">Dias Atraso</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalClients.map(client => (
                <tr key={client.id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Mail size={14} className="text-blue-500" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Phone size={14} className="text-emerald-500" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{client.name}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-tight font-semibold">{client.company}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-extrabold text-red-600 text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.overdueAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black border border-red-200">
                      {client.daysOverdue} d
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-white border border-slate-200 p-2 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 shadow-sm transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; highlight?: boolean; subtext?: string }> = ({ 
  title, value, icon, color, highlight, subtext 
}) => {
  const colorMap: any = {
    blue: 'bg-blue-50 border-blue-100',
    red: 'bg-red-50 border-red-100',
    orange: 'bg-orange-50 border-orange-100',
    purple: 'bg-purple-50 border-purple-100',
  };

  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'shadow-md border-red-200' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        {highlight && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase animate-pulse">Crítico</span>}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
