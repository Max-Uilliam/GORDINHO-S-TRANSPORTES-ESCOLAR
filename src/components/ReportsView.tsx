import { BarChart2, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { payments, children, guardians } from '../data/mockData';

export default function ReportsView() {
  const months = ['2025-04', '2025-05', '2025-06'];
  const monthLabels: Record<string, string> = {
    '2025-04': 'Abr/25', '2025-05': 'Mai/25', '2025-06': 'Jun/25',
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const monthlyData = months.map(m => {
    const mp = payments.filter(p => p.referenceMonth === m);
    const received = mp.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
    const pending = mp.filter(p => p.status !== 'paid').reduce((acc, p) => acc + p.amount, 0);
    const total = mp.reduce((acc, p) => acc + p.amount, 0);
    return { month: m, label: monthLabels[m], received, pending, total };
  });

  const maxRevenue = Math.max(...monthlyData.map(d => d.total));
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const growthRate = previousMonth.received > 0
    ? ((currentMonth.received - previousMonth.received) / previousMonth.received) * 100
    : 0;

  const activeChildren = children.filter(c => c.active);
  const schoolGroups = Object.entries(
    activeChildren.reduce<Record<string, number>>((acc, child) => {
      acc[child.school] = (acc[child.school] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const annualProjection = currentMonth.received * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Análise</p>
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Relatórios</h1>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Receita Jun/25</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{formatCurrency(currentMonth.received)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {growthRate >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.75} />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={1.75} />
            )}
            <span className={`text-xs font-medium ${growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}% vs mai
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Projeção Anual</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{formatCurrency(annualProjection)}</p>
          <p className="text-xs text-zinc-500 mt-1.5">Baseado em Jun/25</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Ticket Médio</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {formatCurrency(activeChildren.length > 0 ? currentMonth.received / activeChildren.length : 0)}
          </p>
          <p className="text-xs text-zinc-500 mt-1.5">Por aluno/mês</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Taxa Adimplência</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {Math.round((currentMonth.received / (currentMonth.total || 1)) * 100)}%
          </p>
          <p className="text-xs text-zinc-500 mt-1.5">Jun/25</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-zinc-100">Receita Mensal</h2>
          </div>
          <div className="space-y-4">
            {monthlyData.map(d => (
              <div key={d.month}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-zinc-400">{d.label}</span>
                  <span className="text-xs font-bold text-zinc-200 tabular-nums">{formatCurrency(d.received)}</span>
                </div>
                <div className="h-6 bg-zinc-800 rounded-md overflow-hidden flex">
                  <div
                    className="h-full bg-amber-500 transition-all duration-700 rounded-md"
                    style={{ width: `${(d.received / maxRevenue) * 100}%` }}
                  ></div>
                  {d.pending > 0 && (
                    <div
                      className="h-full bg-zinc-700 transition-all duration-700"
                      style={{ width: `${(d.pending / maxRevenue) * 100}%` }}
                    ></div>
                  )}
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] text-zinc-600">Recebido: {formatCurrency(d.received)}</span>
                  {d.pending > 0 && (
                    <span className="text-[10px] text-zinc-600">Pendente: {formatCurrency(d.pending)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-500"></div>
              <span className="text-xs text-zinc-500">Recebido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-zinc-700"></div>
              <span className="text-xs text-zinc-500">Pendente</span>
            </div>
          </div>
        </div>

        {/* Student distribution */}
        <div className="space-y-5">
          {/* By school */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Alunos por Escola</h2>
            </div>
            <div className="space-y-3">
              {schoolGroups.map(([school, count]) => (
                <div key={school}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400 truncate max-w-[200px]">{school}</span>
                    <span className="text-xs font-bold text-zinc-200 tabular-nums">{count} aluno{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500/60 rounded-full"
                      style={{ width: `${(count / activeChildren.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By shift */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-100 mb-4">Alunos por Turno</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Matutino', shift: 'morning', color: 'text-amber-400' },
                { label: 'Vespertino', shift: 'afternoon', color: 'text-sky-400' },
              ].map(({ label, shift, color }) => {
                const count = activeChildren.filter(c => c.shift === shift).length;
                return (
                  <div key={shift} className="text-center p-3 bg-zinc-800/50 rounded-lg">
                    <p className={`text-2xl font-bold tabular-nums ${color}`}>{count}</p>
                    <p className="text-xs text-zinc-500 mt-1">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent payment log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
          <FileText className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-zinc-100">Últimos pagamentos registrados</h2>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {payments
            .filter(p => p.status === 'paid' && p.paidAt)
            .sort((a, b) => (b.paidAt || '').localeCompare(a.paidAt || ''))
            .slice(0, 6)
            .map(p => {
              const child = children.find(c => c.id === p.childId);
              const guardian = guardians.find(g => g.id === p.guardianId);
              return (
                <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{child?.name}</p>
                      <p className="text-xs text-zinc-500">{guardian?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 tabular-nums">
                      {(p.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {p.paidAt ? new Date(p.paidAt + 'T12:00:00').toLocaleDateString('pt-BR') : ''}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
