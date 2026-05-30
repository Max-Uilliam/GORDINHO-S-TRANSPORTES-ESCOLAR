import { ArrowLeft, Phone, MapPin, School, CreditCard, MessageCircle, Calendar, User } from 'lucide-react';
import { children, guardians, payments, attendance } from '../data/mockData';
import { ActiveView } from '../types';

interface StudentDetailProps {
  childId: string;
  onNavigate: (view: ActiveView) => void;
}

const shiftLabel = { morning: 'Matutino', afternoon: 'Vespertino', night: 'Noturno' };
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function StudentDetail({ childId, onNavigate }: StudentDetailProps) {
  const child = children.find(c => c.id === childId);
  if (!child) return null;

  const guardian = guardians.find(g => g.id === child.guardianId);
  const childPayments = payments.filter(p => p.childId === childId).sort((a, b) => b.referenceMonth.localeCompare(a.referenceMonth));
  const childAttendance = attendance.filter(a => a.childId === childId);
  const presentDays = childAttendance.filter(a => a.status === 'present').length;

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const whatsappUrl = guardian
    ? `https://wa.me/55${guardian.phone.replace(/\D/g, '')}?text=Olá ${guardian.name}, sou o Marcelo do Gordinho's Transporte Escolar.`
    : '#';

  const formatMonth = (ref: string) => {
    const [year, month] = ref.split('-');
    return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
  };

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={() => onNavigate('students')}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Alunos
      </button>

      {/* Profile header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0">
            {child.photoUrl ? (
              <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-2xl font-bold">
                {child.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-zinc-100">{child.name}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <School className="w-3.5 h-3.5" strokeWidth={1.75} />
                    {child.school}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-400">{child.grade}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-400">{shiftLabel[child.shift]}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.75} />
                  <span className="text-xs text-zinc-500">{child.address}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-widest font-medium flex-shrink-0
                ${child.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                {child.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Guardian card */}
        <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-zinc-100">Responsável</h2>
          </div>
          {guardian && (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Nome</p>
                <p className="text-sm font-medium text-zinc-200">{guardian.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">CPF</p>
                <p className="text-sm text-zinc-400">{guardian.cpf}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Telefone</p>
                <p className="text-sm text-zinc-400">{guardian.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Endereço</p>
                <p className="text-sm text-zinc-400 leading-snug">{guardian.address}</p>
              </div>
              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${guardian.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Ligar
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-xs text-emerald-400 font-medium transition-colors border border-emerald-500/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Payment history */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <CreditCard className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-zinc-100">Histórico de Mensalidades</h2>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {childPayments.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-zinc-500">Nenhum registro de pagamento</p>
              </div>
            ) : (
              childPayments.map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0
                      ${p.status === 'paid' ? 'bg-emerald-500' : p.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{formatMonth(p.referenceMonth)}</p>
                      <p className="text-xs text-zinc-500">Venc: {new Date(p.dueDate + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.paidAt && (
                      <span className="text-xs text-zinc-500 hidden sm:inline">
                        Pago em {new Date(p.paidAt + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-medium
                      ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {p.status === 'paid' ? 'Pago' : p.status === 'overdue' ? 'Em atraso' : 'Pendente'}
                    </span>
                    <span className="text-sm font-bold text-zinc-200 tabular-nums w-20 text-right">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Attendance summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-zinc-100">Presença — Julho 2025</h2>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">{presentDays}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Presenças</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">{childAttendance.filter(a => a.status === 'absent').length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Ausências</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">{childAttendance.filter(a => a.status === 'justified').length}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Justificadas</p>
          </div>
          {childAttendance.length > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500 tabular-nums">
                {Math.round((presentDays / childAttendance.length) * 100)}%
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Frequência</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
