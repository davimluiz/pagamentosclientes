
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Em dia' | 'Inadimplente';
  totalBalance: number;
  overdueAmount: number;
  daysOverdue: number;
  history: PaymentHistory[];
  lastUpdate: string;
}

export interface PaymentHistory {
  month: string;
  status: 'Pago' | 'Atraso';
  value: number;
}

export interface KPIStats {
  totalClients: number;
  delinquentClients: number;
  totalOverdueAmount: number;
  delinquencyRate: number;
}

export type AppView = 'dashboard' | 'clients' | 'ranking' | 'import';
