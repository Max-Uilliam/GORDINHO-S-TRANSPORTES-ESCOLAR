import { Users, CreditCard, TrendingUp, AlertTriangle, ChevronRight, Bus, Clock } from 'lucide-react';
import { children, payments, guardians, attendance } from '../data/mockData';
import { ActiveView } from '../types';

interface DashboardProps {
  onNavigate: (view: ActiveView) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const today = '2025-07-07';
  const currentMonth = '2025-06';

  const activeChildren = children.filter(c => c.active);
  const monthPayments = payments.filter(p => p.referenceMonth === currentMonth);
  const paidCount = monthPayments.filter(p => p.status === 'paid').length;
  const pendingCount = monthPayments.filter(p => p.status === 'pending').length;
  const overdueCount = monthPayments.filter(p => p.status === 'overdue').length;
  const totalReceived = monthPayments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = monthPayments.filter(p => p.status !== 'paid').reduce((acc, p) => acc + p.amount, 0);

  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;

  const morningChildren = activeChildren.filter(c => c.shift === 'morning');
  const afternoonChildren = activeChildren.filter(c => c.shift === 'afternoon');

  // Overdue payments details
  const overduePayments = monthPayments.filter(p => p.status === 'overdue' || p.status === 'pending');

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getChild = (childId: string) => children.find(c => c.id === childId);
  const getGuardian = (guardianId: string) => guardians.find(g => g.id === guardianId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Segunda-feira, 07 de Julho de 2025</p>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Painel de Controle</h1>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
          <Bus className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-zinc-300 font-medium">Turno Matutino em curso</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Users className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Total</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100 tabular-nums">{activeChildren.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Alunos ativos</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Jun/25</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100 tabular-nums">{formatCurrency(totalReceived)}</p>
          <p className="text-xs text-zinc-500 mt-1">{paidCount} pagamentos recebidos</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">A receber</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100 tabular-nums">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-zinc-500 mt-1">{pendingCount + overdueCount} em aberto</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Hoje</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100 tabular-nums">{presentToday}/{activeChildren.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Presentes hoje</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's route */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Rota do Dia — Turno Matutino</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{morningChildren.length} alunos programados</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
            >
              Ver presença <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {morningChildren.map((child, index) => {
              const att = attendance.find(a => a.childId === child.id && a.date === today);
              return (
                <div key={child.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors">
                  <span className="text-xs text-zinc-600 w-4 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                    {child.photoUrl ? (
                      <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-semibold">
                        {child.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{child.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{child.school} · {child.grade}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-zinc-400 truncate max-w-[140px]">{child.address.split(',')[0]}</p>
                  </div>
                  <div>
                    {att ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide
                        ${att.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' :
                          att.status === 'absent' ? 'bg-red-500/10 text-red-400' :
                          'bg-amber-500/10 text-amber-400'}`}>
                        {att.status === 'present' ? 'Presente' : att.status === 'absent' ? 'Ausente' : 'Justificado'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-zinc-800 text-zinc-500">
                        Aguardando
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Payment status summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-100 mb-4">Status Financeiro — Jun/2025</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-zinc-400">Pagos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200 tabular-nums">{paidCount}</span>
                  <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(paidCount / monthPayments.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-zinc-400">Pendentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200 tabular-nums">{pendingCount}</span>
                  <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(pendingCount / monthPayments.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-zinc-400">Em atraso</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200 tabular-nums">{overdueCount}</span>
                  <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(overdueCount / monthPayments.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Total a receber</span>
                <span className="text-sm font-bold text-amber-500 tabular-nums">{formatCurrency(totalPending)}</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {overduePayments.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-zinc-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-zinc-100">Cobranças em aberto</h2>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {overduePayments.slice(0, 4).map(p => {
                  const child = getChild(p.childId);
                  const guardian = getGuardian(p.guardianId);
                  return (
                    <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{child?.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{guardian?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-medium
                          ${p.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {p.status === 'overdue' ? 'Atraso' : 'Pendente'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-300 tabular-nums">{formatCurrency(p.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-3">
                <button
                  onClick={() => onNavigate('payments')}
                  className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Shift summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-zinc-100 mb-3">Distribuição por Turno</h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Matutino</span>
                <span className="text-xs font-semibold text-zinc-200">{morningChildren.length} alunos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Vespertino</span>
                <span className="text-xs font-semibold text-zinc-200">{afternoonChildren.length} alunos</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Total ativo</span>
                <span className="text-xs font-bold text-zinc-100">{activeChildren.length} alunos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
