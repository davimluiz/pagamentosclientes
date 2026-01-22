
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Client } from '../types';

interface ImportDataProps {
  onImport: (clients: Client[]) => void;
  currentClients: Client[];
}

const ImportData: React.FC<ImportDataProps> = ({ onImport, currentClients }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      
      // Simulate spreadsheet processing
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
        
        // In a real app, you would parse CSV here and merge with existing data
        // Here we just "refresh" the data by shuffling statuses to show reactivity
        const updated = currentClients.map(c => ({
          ...c,
          lastUpdate: new Date().toISOString(),
          // Randomly change status for some clients to simulate real update
          status: Math.random() > 0.8 ? (c.status === 'Em dia' ? 'Inadimplente' : 'Em dia') : c.status
        }));
        
        onImport(updated);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Importação Semanal</h2>
        <p className="text-slate-500">Atualize a base de dados enviando a planilha de fechamento.</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center text-center">
        <div className="bg-blue-50 p-4 rounded-2xl mb-6">
          <Upload className="text-blue-600 w-12 h-12" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Clique para selecionar ou arraste o arquivo</h3>
        <p className="text-slate-500 mb-8 max-w-sm">Suporta formatos .CSV, .XLS e .XLSX. Certifique-se de usar o modelo padrão do sistema.</p>

        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <span className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-blue-200 inline-block">
            {isUploading ? 'Processando...' : 'Selecionar Planilha'}
          </span>
        </label>

        {fileName && (
          <div className="mt-6 flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <FileText size={16} />
            <span className="text-sm">{fileName}</span>
          </div>
        )}
      </div>

      {uploadStatus === 'success' && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            <CheckCircle2 className="text-emerald-600 w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-emerald-900">Importação Concluída!</h4>
            <p className="text-emerald-700 text-sm mt-1">Os dados foram processados e os indicadores financeiros já estão atualizados.</p>
            <div className="mt-4 flex gap-4">
              <div className="bg-white p-3 rounded-lg border border-emerald-200 flex-1">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Registros Processados</p>
                <p className="text-xl font-bold text-emerald-900">{currentClients.length}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 flex-1">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Erros na Planilha</p>
                <p className="text-xl font-bold text-emerald-900">0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Info size={20} className="text-blue-500" /> Instruções Técnicas
        </h3>
        <ul className="space-y-4 text-sm text-slate-600">
          <li className="flex gap-3">
            <div className="bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
            <p>Coluna A: Nome do Cliente (Obrigatório)</p>
          </li>
          <li className="flex gap-3">
            <div className="bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
            <p>Coluna B: CNPJ ou CPF</p>
          </li>
          <li className="flex gap-3">
            <div className="bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
            <p>Coluna C: Valor da Fatura em Aberto (Obrigatório para cálculo de KPI)</p>
          </li>
          <li className="flex gap-3">
            <div className="bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">4</div>
            <p>Coluna D: Data de Vencimento (Formato: DD/MM/AAAA)</p>
          </li>
        </ul>
        <button className="mt-8 text-blue-600 font-semibold text-sm flex items-center gap-2 hover:underline">
          Baixar Planilha Modelo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ImportData;
