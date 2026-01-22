
import { Client, PaymentHistory } from './types';

const generateHistory = (isDelinquent: boolean): PaymentHistory[] => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map((month, idx) => ({
    month,
    status: (isDelinquent && idx >= 4) ? 'Atraso' : 'Pago',
    value: Math.floor(Math.random() * 5000) + 1000
  }));
};

const firstNames = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Juliana'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lopes'];
const companies = ['Tech Innovators', 'Global Logistics', 'Alimentos S.A.', 'Moda Brasil', 'ConstruVale', 'EcoEnergia', 'Saúde Total', 'Finanças Prime'];

export const mockClients: Client[] = Array.from({ length: 55 }).map((_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i + 3) % lastNames.length];
  const isDelinquent = i % 4 === 0; // 25% delinquency rate
  const overdueAmount = isDelinquent ? Math.floor(Math.random() * 15000) + 2000 : 0;
  
  return {
    id: `cl-${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com.br`,
    phone: `(11) 9${Math.floor(Math.random() * 89999999 + 10000000)}`,
    company: companies[i % companies.length],
    status: isDelinquent ? 'Inadimplente' : 'Em dia',
    totalBalance: Math.floor(Math.random() * 50000) + 5000,
    overdueAmount,
    daysOverdue: isDelinquent ? Math.floor(Math.random() * 90) + 5 : 0,
    history: generateHistory(isDelinquent),
    lastUpdate: new Date().toISOString()
  };
});
