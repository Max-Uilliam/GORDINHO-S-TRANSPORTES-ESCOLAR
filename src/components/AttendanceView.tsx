import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import { children, attendance } from '../data/mockData';
import { AttendanceRecord } from '../types';

export default function AttendanceView() {
  const today = '2025-07-07';
  const [selectedDate, setSelectedDate] = useState(today);
  const [shiftFilter, setShiftFilter] = useState<'all' | 'morning' | 'afternoon'>('all');

  const activeChildren = children.filter(c => c.active);
  const filteredChildren = activeChildren.filter(c =>
    shiftFilter === 'all' || c.shift === shiftFilter
  );

  // Local state for attendance records (in production, this would sync to SQLite/API)
  const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>(attendance);

  const getRecord = (childId: string) =>
    localAttendance.find(a => a.childId === childId && a.date === selectedDate);

  const setStatus = (childId: string, status: 'present' | 'absent' | 'justified') => {
    setLocalAttendance(prev => {
      const existing = prev.findIndex(a => a.childId === childId && a.date === selectedDate);
      const newRecord: AttendanceRecord = {
        id: `a_${childId}_${selectedDate}`,
        childId,
        date: selectedDate,
        status,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newRecord;
        return updated;
      }
      return [...prev, newRecord];
    });
  };

  const todayRecords = localAttendance.filter(a => a.date === selectedDate);
  const presentCount = todayRecords.filter(a => a.status === 'present' && filteredChildren.some(c => c.id === a.childId)).length;
  const absentCount = todayRecords.filter(a => a.status === 'absent' && filteredChildren.some(c => c.id === a.childId)).length;
  const justifiedCount = todayRecords.filter(a => a.status === 'justified' && filteredChildren.some(c => c.id === a.childId)).length;
  const unmarkedCount = filteredChildren.filter(c => !todayRecords.some(a => a.childId === c.id)).length;

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${day} de ${months[parseInt(m) - 1]} de ${y}`;
  };

  const markAll = (status: 'present' | 'absent') => {
    filteredChildren.forEach(child => {
      setStatus(child.id, status);
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Controle</p>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Lista de Presença</h1>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </div>

      <p className="text-sm text-zinc-400">{formatDate(selectedDate)}</p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth={1.75} />
            <span className="text-xs text-zinc-500">Presentes</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{presentCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" strokeWidth={1.75} />
            <span className="text-xs text-zinc-500">Ausentes</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{absentCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
            <span className="text-xs text-zinc-500">Justificados</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{justifiedCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <span className="text-xs text-zinc-500">Não marcados</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">{unmarkedCount}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex gap-2">
          <button
            onClick={() => markAll('present')}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/25 transition-colors"
          >
            Marcar todos presentes
          </button>
          <button
            onClick={() => markAll('absent')}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 transition-colors"
          >
            Marcar todos ausentes
          </button>
        </div>
      </div>

      {/* Attendance list */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-950/50">
          <div className="col-span-4 text-[10px] text-zinc-600 uppercase tracking-widest">Aluno</div>
          <div className="col-span-3 text-[10px] text-zinc-600 uppercase tracking-widest">Escola / Turno</div>
          <div className="col-span-5 text-[10px] text-zinc-600 uppercase tracking-widest">Presença</div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {filteredChildren.map(child => {
            const record = getRecord(child.id);
            const status = record?.status;
            return (
              <div key={child.id} className="px-5 py-4 hover:bg-zinc-800/20 transition-colors">
                {/* Mobile */}
                <div className="sm:hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                      {child.photoUrl ? (
                        <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                          {child.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{child.name}</p>
                      <p className="text-xs text-zinc-500">{child.school}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus(child.id, 'present')}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border
                        ${status === 'present'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400'
                        }`}
                    >
                      Presente
                    </button>
                    <button
                      onClick={() => setStatus(child.id, 'absent')}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border
                        ${status === 'absent'
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-500/30 hover:text-red-400'
                        }`}
                    >
                      Ausente
                    </button>
                    <button
                      onClick={() => setStatus(child.id, 'justified')}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border
                        ${status === 'justified'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400'
                        }`}
                    >
                      Justificado
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                      {child.photoUrl ? (
                        <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                          {child.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{child.name}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-zinc-400">{child.school}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{child.shift === 'morning' ? 'Matutino' : 'Vespertino'} · {child.grade}</p>
                  </div>
                  <div className="col-span-5 flex gap-2">
                    <button
                      onClick={() => setStatus(child.id, 'present')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                        ${status === 'present'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400'
                        }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                      Presente
                    </button>
                    <button
                      onClick={() => setStatus(child.id, 'absent')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                        ${status === 'absent'
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-500/30 hover:text-red-400'
                        }`}
                    >
                      <XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                      Ausente
                    </button>
                    <button
                      onClick={() => setStatus(child.id, 'justified')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                        ${status === 'justified'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400'
                        }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                      Justificado
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save indicator */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <p className="text-xs text-zinc-400">Dados salvos localmente. Sincronização com servidor quando houver conexão.</p>
      </div>
    </div>
  );
}
