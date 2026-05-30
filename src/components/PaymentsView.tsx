import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Filter, MessageCircle } from 'lucide-react';
import { payments, children, guardians } from '../data/mockData';
import { Payment } from '../types';

type StatusFilter = 'all' | 'paid' | 'pending' | 'overdue';

export default function PaymentsView() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [monthFilter, setMonthFilter] = useState('2025-06');

  const monthOptions = ['2025-06', '2025-05', '2025-04'];
  const monthNames: Record<string, string> = {
    '2025-06': 'Junho/2025',
    '2025-05': 'Maio/2025',
    '2025-04': 'Abril/2025',
  };

  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchMonth = p.referenceMonth === monthFilter;
    return matchStatus && matchMonth;
  });

  const getChild = (id: string) => children.find(c => c.id === id);
  const getGuardian = (id: string) => guardians.find(g => g.id === id);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');

  const totalPaid = filtered.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = filtered.filter(p => p.status !== 'paid').reduce((acc, p) => acc + p.amount, 0);
  const paidCount = filtered.filter(p => p.status === 'paid').length;
  const pendingCount = filtered.filter(p => p.status === 'pending').length;
  const overdueCount = filtered.filter(p => p.status === 'overdue').length;

  const allForMonth = payments.filter(p => p.referenceMonth === monthFilter);
  const paidAll = allForMonth.filter(p => p.status === 'paid').length;

  const statusConfig = {
    paid: { label: 'Pago', icon: CheckCircle, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    pending: { label: 'Pendente', icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    overdue: { label: 'Em atraso', icon: AlertTriangle, bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  };

  const handleMarkPaid = (paymentId: string) => {
    // In production, this would call an API
    alert(`Pagamento ${paymentId} marcado como pago. (Demo)`);
  };

  const sendWhatsApp = (p: Payment) => {
    const child = getChild(p.childId);
    const guardian = getGuardian(p.guardianId);
    if (!guardian || !child) return;
    const msg = `Olá ${guardian.name}! Sou o Marcelo do Gordinho's Transporte Escolar. Informo que a mensalidade de ${monthNames[p.referenceMonth]} referente a ${child.name} está ${p.status === 'overdue' ? 'em atraso' : 'pendente'} no valor de ${formatCurrency(p.amount)}. Por favor, entre em contato para regularizar.`;
    window.open(`https://wa.me/55${guardian.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Financeiro</p>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Mensalidades</h1>
        </div>
        <div className="flex gap-2">
          {monthOptions.map(m => (
            <button
              key={m}
              onClick={() => setMonthFilter(m)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border
                ${monthFilter === m
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {m === '2025-06' ? 'Jun/25' : m === '2025-05' ? 'Mai/25' : 'Abr/25'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Recebido</p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-zinc-500 mt-1">{paidCount} pagamento{paidCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">A receber</p>
          <p className="text-2xl font-bold text-amber-400 tabular-nums">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-zinc-500 mt-1">{pendingCount + overdueCount} em aberto</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Em atraso</p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">{overdueCount}</p>
          <p className="text-xs text-zinc-500 mt-1">pagamento{overdueCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Adimplência</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {allForMonth.length > 0 ? Math.round((paidAll / allForMonth.length) * 100) : 0}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">{paidAll}/{allForMonth.length} pagos</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.75} />
        {(['all', 'paid', 'pending', 'overdue'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${statusFilter === s
                ? s === 'all' ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                  : s === 'paid' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : s === 'pending' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
          >
            {s === 'all' ? 'Todos' : s === 'paid' ? 'Pagos' : s === 'pending' ? 'Pendentes' : 'Em atraso'}
          </button>
        ))}
        <span className="text-xs text-zinc-600 ml-auto">{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Payments table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
          <div className="col-span-3 text-[10px] text-zinc-600 uppercase tracking-widest">Aluno</div>
          <div className="col-span-3 text-[10px] text-zinc-600 uppercase tracking-widest">Responsável</div>
          <div className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest">Vencimento</div>
          <div className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest">Valor</div>
          <div className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest">Status / Ação</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="w-10 h-10 text-zinc-700 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-zinc-500">Nenhum registro encontrado para este período</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {filtered.map(p => {
              const child = getChild(p.childId);
              const guardian = getGuardian(p.guardianId);
              const cfg = statusConfig[p.status];
              const Icon = cfg.icon;
              return (
                <div key={p.id} className="px-5 py-4 hover:bg-zinc-800/20 transition-colors">
                  {/* Mobile layout */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">{child?.name}</p>
                        <p className="text-xs text-zinc-500">{guardian?.name}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-3 h-3" strokeWidth={1.75} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-500">Venc: {formatDate(p.dueDate)}</p>
                        {p.paidAt && <p className="text-xs text-zinc-600">Pago: {formatDate(p.paidAt)}</p>}
                      </div>
                      <p className="text-base font-bold text-zinc-200 tabular-nums">{formatCurrency(p.amount)}</p>
                    </div>
                    {p.status !== 'paid' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleMarkPaid(p.id)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-xs text-emerald-400 font-medium hover:bg-emerald-600/25 transition-colors"
                        >
                          Marcar Pago
                        </button>
                        <button
                          onClick={() => sendWhatsApp(p)}
                          className="flex-1 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" strokeWidth={1.75} />
                          WhatsApp
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-zinc-200">{child?.name}</p>
                      <p className="text-xs text-zinc-500">{child?.school}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-zinc-300">{guardian?.name}</p>
                      <p className="text-xs text-zinc-500">{guardian?.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-zinc-300 tabular-nums">{formatDate(p.dueDate)}</p>
                      {p.paidAt && <p className="text-xs text-zinc-600">Pago: {formatDate(p.paidAt)}</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-zinc-200 tabular-nums">{formatCurrency(p.amount)}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-3 h-3" strokeWidth={1.75} />
                        {cfg.label}
                      </span>
                      {p.status !== 'paid' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMarkPaid(p.id)}
                            title="Marcar como pago"
                            className="w-7 h-7 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/20 flex items-center justify-center transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => sendWhatsApp(p)}
                            title="Cobrar via WhatsApp"
                            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
