
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, AlertCircle, DollarSign, TrendingDown, ChevronRight, Mail, Phone, ExternalLink } from 'lucide-react';
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
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Executivo</h1>
          <p className="text-slate-500 font-medium">Análise de risco e performance financeira em tempo real.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg shadow-sm">Hoje</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Mês</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Ano</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total de Clientes" value={stats.totalClients.toString()} icon={<Users size={20}/>} color="blue" />
        <KPICard title="Clientes Inadimplentes" value={stats.delinquentClients.toString()} icon={<AlertCircle size={20}/>} color="red" highlight />
        <KPICard title="Volume em Atraso" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalOverdueAmount)} icon={<DollarSign size={20}/>} color="orange" />
        <KPICard title="Taxa de Inadimplência" value={`${stats.delinquencyRate.toFixed(1)}%`} icon={<TrendingDown size={20}/>} color="purple" subtext="+2.1% este mês" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingDown className="text-blue-500" size={18} /> Fluxo de Inadimplência (Histórico)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Composição da Carteira</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Ação Imediata: Maiores Inadimplentes</h3>
            <p className="text-sm text-slate-500 font-medium">Contatos prioritários para regularização de débitos.</p>
          </div>
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold border border-red-100">
            {criticalClients.length} Clientes Críticos
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest bg-white border-b border-slate-100">
                <th className="px-8 py-5">Informações de Contato</th>
                <th className="px-8 py-5">Cliente / Empresa</th>
                <th className="px-8 py-5 text-right">Valor em Aberto</th>
                <th className="px-8 py-5 text-center">Atraso</th>
                <th className="px-8 py-5 text-center">Canal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {criticalClients.map(client => (
                <tr key={client.id} className="hover:bg-blue-50/40 transition-all duration-200 group">
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        <Mail size={14} />
                        {client.email}
                      </a>
                      <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        <Phone size={14} className="text-emerald-500" />
                        {client.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 text-base">{client.name}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{client.company}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-lg font-black text-red-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.overdueAmount)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center justify-center bg-red-100 text-red-700 w-12 h-12 rounded-2xl font-black text-sm border-2 border-red-200 shadow-sm">
                      {client.daysOverdue}d
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 transition-all">
                      <ExternalLink size={18} />
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
    blue: 'bg-blue-600 text-white shadow-blue-100',
    red: 'bg-red-600 text-white shadow-red-100',
    orange: 'bg-orange-500 text-white shadow-orange-100',
    purple: 'bg-indigo-600 text-white shadow-indigo-100',
  };

  return (
    <div className={`p-6 rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:scale-[1.02] duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]} shadow-lg`}>{icon}</div>
        {highlight && <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>}
      </div>
      <div>
        <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</h4>
        <div className="text-2xl font-black text-slate-900 mt-1">{value}</div>
        {subtext && <div className="mt-3 text-xs font-bold text-emerald-500 flex items-center gap-1">
          <TrendingDown size={12} className="rotate-180" /> {subtext}
        </div>}
      </div>
    </div>
  );
};

export default Dashboard;
