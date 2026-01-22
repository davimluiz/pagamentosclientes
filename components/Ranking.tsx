
import React, { useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, User, TrendingUp } from 'lucide-react';
import { Client } from '../types';

interface RankingProps {
  clients: Client[];
}

const Ranking: React.FC<RankingProps> = ({ clients }) => {
  // Score logic: Higher value means "Worse Payer"
  // Factors: (Overdue Amount * 1.5) + (Days Late * 100)
  const rankedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      const scoreA = (a.overdueAmount * 1.5) + (a.daysOverdue * 100);
      const scoreB = (b.overdueAmount * 1.5) + (b.daysOverdue * 100);
      return scoreB - scoreA;
    });
  }, [clients]);

  const top3 = rankedClients.slice(0, 3);
  const others = rankedClients.slice(3);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ranking Financeiro</h2>
          <p className="text-slate-500">Índice de risco calculado por volume e tempo de atraso.</p>
        </div>
      </div>

      {/* Podium for top 3 worse payers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((client, idx) => (
          <div key={client.id} className={`relative p-8 rounded-2xl border flex flex-col items-center text-center ${
            idx === 0 ? 'bg-red-50 border-red-200 shadow-lg' : 'bg-white border-slate-200'
          }`}>
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold uppercase ${
              idx === 0 ? 'bg-red-600' : 'bg-slate-400'
            }`}>
              {idx + 1}º Lugar (Risco)
            </div>
            
            <div className="mt-4 mb-4">
              <img src={`https://picsum.photos/seed/${client.id}/80/80`} alt="" className="w-20 h-20 rounded-full border-4 border-white shadow-sm" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{client.company}</p>

            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Valor</p>
                <p className="text-sm font-bold text-red-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.overdueAmount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Atraso</p>
                <p className="text-sm font-bold text-slate-900">{client.daysOverdue} dias</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List for the rest */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Demais Inadimplentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Posição</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Saldo em Atraso</th>
                <th className="px-6 py-4">Pontuação de Risco</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {others.filter(c => c.overdueAmount > 0).map((client, idx) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-slate-400 font-bold">#{idx + 4}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-500 font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.overdueAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-400" 
                          style={{ width: `${Math.min((client.overdueAmount / 15000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        {Math.floor((client.overdueAmount * 1.5) + (client.daysOverdue * 100))} pts
                      </span>
                    </div>
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

export default Ranking;
