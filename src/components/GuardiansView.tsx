import { useState } from 'react';
import { Search, Plus, Phone, MapPin, Users, MessageCircle, ChevronRight } from 'lucide-react';
import { guardians, children } from '../data/mockData';
import { ActiveView } from '../types';

interface GuardiansViewProps {
  onNavigate: (view: ActiveView) => void;
  onSelectGuardian: (id: string) => void;
}

export default function GuardiansView({ onNavigate, onSelectGuardian }: GuardiansViewProps) {
  const [search, setSearch] = useState('');

  const filtered = guardians.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search) ||
    g.cpf.includes(search)
  );

  const getChildrenCount = (guardianId: string) =>
    children.filter(c => c.guardianId === guardianId && c.active).length;

  const getWhatsApp = (phone: string, name: string) =>
    `https://wa.me/55${phone.replace(/\D/g, '')}?text=Olá ${name}, sou o Marcelo do Gordinho's Transporte Escolar.`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Gestão</p>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Responsáveis</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" strokeWidth={2} />
          Novo Responsável
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou CPF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} responsável(eis) cadastrado(s)</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(guardian => {
          const childrenCount = getChildrenCount(guardian.id);
          const guardianChildren = children.filter(c => c.guardianId === guardian.id);
          return (
            <div
              key={guardian.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group"
            >
              {/* Name & initials */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-amber-500">
                      {guardian.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100 leading-tight">{guardian.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{guardian.cpf}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Users className="w-3 h-3" strokeWidth={1.75} />
                  {childrenCount}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-xs text-zinc-400">{guardian.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-xs text-zinc-400 leading-snug">{guardian.address}</span>
                </div>
              </div>

              {/* Children list */}
              {guardianChildren.length > 0 && (
                <div className="mb-4 pt-3 border-t border-zinc-800">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Filhos cadastrados</p>
                  <div className="space-y-1.5">
                    {guardianChildren.map(child => (
                      <div key={child.id} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${child.active ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                        <span className="text-xs text-zinc-300">{child.name}</span>
                        <span className="text-xs text-zinc-600">·</span>
                        <span className="text-xs text-zinc-500">{child.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-zinc-800">
                <a
                  href={`tel:${guardian.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition-colors"
                >
                  <Phone className="w-3 h-3" strokeWidth={1.75} />
                  Ligar
                </a>
                <a
                  href={getWhatsApp(guardian.phone, guardian.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-xs text-emerald-400 font-medium transition-colors border border-emerald-500/20"
                >
                  <MessageCircle className="w-3 h-3" strokeWidth={1.75} />
                  WhatsApp
                </a>
                <button
                  onClick={() => { onSelectGuardian(guardian.id); onNavigate('guardian-detail'); }}
                  className="w-9 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
