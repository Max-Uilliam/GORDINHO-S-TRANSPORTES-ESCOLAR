import { ArrowLeft, Phone, MapPin, Users, CreditCard, MessageCircle } from 'lucide-react';
import { guardians, children, payments } from '../data/mockData';
import { ActiveView } from '../types';

interface GuardianDetailProps {
  guardianId: string;
  onNavigate: (view: ActiveView) => void;
  onSelectChild: (id: string) => void;
}

const shiftLabel = { morning: 'Matutino', afternoon: 'Vespertino', night: 'Noturno' };

export default function GuardianDetail({ guardianId, onNavigate, onSelectChild }: GuardianDetailProps) {
  const guardian = guardians.find(g => g.id === guardianId);
  if (!guardian) return null;

  const guardianChildren = children.filter(c => c.guardianId === guardianId);
  const guardianPayments = payments.filter(p => p.guardianId === guardianId)
    .sort((a, b) => b.referenceMonth.localeCompare(a.referenceMonth));

  const totalPaid = guardianPayments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = guardianPayments.filter(p => p.status !== 'paid').reduce((acc, p) => acc + p.amount, 0);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const whatsappUrl = `https://wa.me/55${guardian.phone.replace(/\D/g, '')}?text=Olá ${guardian.name}, sou o Marcelo do Gordinho's Transporte Escolar.`;

  return (
    <div className="space-y-5">
      <button
        onClick={() => onNavigate('guardians')}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Responsáveis
      </button>

      {/* Profile card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-amber-500">
              {guardian.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-zinc-100">{guardian.name}</h1>
            <p className="text-xs text-zinc-500 mt-1">CPF: {guardian.cpf}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                {guardian.phone}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                {guardian.address}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${guardian.phone}`}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
              Ligar
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Financial summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-zinc-100">Resumo Financeiro</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-zinc-800 rounded-lg text-center">
              <p className="text-lg font-bold text-emerald-400 tabular-nums">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Pago</p>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg text-center">
              <p className="text-lg font-bold text-amber-400 tabular-nums">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Em aberto</p>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {guardianPayments.slice(0, 5).map(p => {
              const child = children.find(c => c.id === p.childId);
              const [year, month] = p.referenceMonth.split('-');
              const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
              return (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-medium text-zinc-300">{child?.name}</p>
                    <p className="text-[10px] text-zinc-600">{months[parseInt(month) - 1]}/{year.slice(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-medium
                      ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {p.status === 'paid' ? 'Pago' : p.status === 'overdue' ? 'Atraso' : 'Pendente'}
                    </span>
                    <span className="text-xs font-semibold text-zinc-300 tabular-nums">{formatCurrency(p.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Children */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Filhos cadastrados</h2>
            </div>
            <span className="text-xs text-zinc-500">{guardianChildren.length} filho{guardianChildren.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            {guardianChildren.map(child => (
              <div
                key={child.id}
                onClick={() => { onSelectChild(child.id); onNavigate('student-detail'); }}
                className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                    {child.photoUrl ? (
                      <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                        {child.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-200">{child.name}</p>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${child.active ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                    </div>
                    <p className="text-xs text-zinc-500">{child.school} · {child.grade} · {shiftLabel[child.shift]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
