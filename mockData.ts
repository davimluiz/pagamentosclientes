import { Client, PaymentHistory } from './types';

const generateHistory = (isDelinquent: boolean): PaymentHistory[] => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map((month, idx) => ({
    month,
    status: (isDelinquent && idx >= 4) ? 'Atraso' : 'Pago',
    value: Math.floor(Math.random() * 5000) + 1500
  }));
};

const firstNames = ['Ricardo', 'Beatriz', 'Marcos', 'Fernanda', 'Tiago', 'Camila', 'Rodrigo', 'Larissa', 'André', 'Patrícia', 'Gustavo', 'Letícia', 'Rafael', 'Amanda', 'Felipe', 'Bárbara', 'Vinícius', 'Mônica', 'Daniel', 'Vanessa'];
const lastNames = ['Mendes', 'Teixeira', 'Ferreira', 'Batista', 'Gomes', 'Moreira', 'Nunes', 'Carvalho', 'Cardoso', 'Pinto', 'Ribeiro', 'Barbosa', 'Cavalcanti', 'Dias', 'Castro', 'Vieira', 'Macedo', 'Borges', 'Santana', 'Rocha'];
const companies = ['Tech S.A.', 'Inova Logística', 'Prime Consultoria', 'Brasil Varejo', 'Global Solutions', 'Meta Indústria', 'Nexus TI', 'Omni Health', 'Alpha Finance', 'Delta Energy', 'Sigma Mídia', 'Zeta Agronegócios'];

export const mockClients: Client[] = Array.from({ length: 55 }).map((_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i + 7) % lastNames.length];
  const isDelinquent = i % 5 === 0; // Aproximadamente 20% de inadimplência
  const overdueAmount = isDelinquent ? Math.floor(Math.random() * 25000) + 3500 : 0;
  
  return {
    id: `cl-${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@corp.com.br`,
    phone: `(11) 9${Math.floor(Math.random() * 89999) + 10000}-${Math.floor(Math.random() * 8999) + 1000}`,
    company: companies[i % companies.length],
    status: isDelinquent ? 'Inadimplente' : 'Em dia',
    totalBalance: Math.floor(Math.random() * 100000) + 15000,
    overdueAmount,
    daysOverdue: isDelinquent ? Math.floor(Math.random() * 120) + 10 : 0,
    history: generateHistory(isDelinquent),
    lastUpdate: new Date().toISOString()
  };
});