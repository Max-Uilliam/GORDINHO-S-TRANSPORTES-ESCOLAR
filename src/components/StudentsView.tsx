import { useState } from 'react';
import { Search, Plus, Phone, MapPin, School, ChevronRight, UserCircle } from 'lucide-react';
import { children, guardians } from '../data/mockData';
import { ActiveView } from '../types';

interface StudentsViewProps {
  onNavigate: (view: ActiveView) => void;
  onSelectChild: (id: string) => void;
}

const shiftLabel = { morning: 'Matutino', afternoon: 'Vespertino', night: 'Noturno' };
const shiftColor = { morning: 'bg-amber-500/10 text-amber-400', afternoon: 'bg-sky-500/10 text-sky-400', night: 'bg-violet-500/10 text-violet-400' };

export default function StudentsView({ onNavigate, onSelectChild }: StudentsViewProps) {
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [showInactive, setShowInactive] = useState(false);

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.school.toLowerCase().includes(search.toLowerCase());
    const matchShift = shiftFilter === 'all' || c.shift === shiftFilter;
    const matchActive = showInactive ? true : c.active;
    return matchSearch && matchShift && matchActive;
  });

  const getGuardian = (id: string) => guardians.find(g => g.id === id);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Gestão</p>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Alunos</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" strokeWidth={2} />
          Cadastrar Aluno
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Buscar por nome ou escola..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'morning', 'afternoon'] as const).map(s => (
            <button
              key={s}
              onClick={() => setShiftFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border
                ${shiftFilter === s
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {s === 'all' ? 'Todos' : s === 'morning' ? 'Matutino' : 'Vespertino'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border
            ${showInactive
              ? 'bg-zinc-700/30 border-zinc-600 text-zinc-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
        >
          {showInactive ? 'Ocultar inativos' : 'Ver inativos'}
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-xs text-zinc-500">
        <span>{filtered.length} aluno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
        <span>·</span>
        <span>{filtered.filter(c => c.active).length} ativo{filtered.filter(c => c.active).length !== 1 ? 's' : ''}</span>
      </div>

      {/* Student list */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <UserCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-zinc-500">Nenhum aluno encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {filtered.map(child => {
              const guardian = getGuardian(child.guardianId);
              return (
                <div
                  key={child.id}
                  onClick={() => { onSelectChild(child.id); onNavigate('student-detail'); }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                    {child.photoUrl ? (
                      <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold">
                        {child.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-zinc-100 truncate">{child.name}</p>
                      {!child.active && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded uppercase tracking-wide flex-shrink-0">
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <School className="w-3 h-3" strokeWidth={1.75} />
                        {child.school}
                      </span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-xs text-zinc-500">{child.grade}</span>
                    </div>
                  </div>

                  {/* Shift & guardian */}
                  <div className="hidden md:flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-medium ${shiftColor[child.shift]}`}>
                      {shiftLabel[child.shift]}
                    </span>
                    <span className="text-xs text-zinc-500 truncate max-w-[140px]">{guardian?.name}</span>
                  </div>

                  {/* Contact */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${guardian?.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(child.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
                    </a>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
