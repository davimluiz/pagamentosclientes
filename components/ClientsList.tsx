
import React, { useState } from 'react';
import { Search, Filter, Phone, Mail, MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { Client } from '../types';

interface ClientsListProps {
  clients: Client[];
}

const ClientsList: React.FC<ClientsListProps> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Em dia' | 'Inadimplente'>('Todos');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Base de Clientes</h2>
          <p className="text-slate-500">Gestão de contatos e histórico financeiro.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
            {filteredClients.length} Clientes Encontrados
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou empresa..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Em dia">Em dia</option>
            <option value="Inadimplente">Inadimplentes</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-right">Saldo Total</th>
                <th className="px-6 py-4 text-right">Em Atraso</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    {client.status === 'Em dia' ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit">
                        <CheckCircle size={12} /> Em dia
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit">
                        <AlertCircle size={12} /> Atraso
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" /> {client.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalBalance)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {client.overdueAmount > 0 ? (
                      <span className="font-bold text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.overdueAmount)}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreHorizontal size={20} />
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

export default ClientsList;
