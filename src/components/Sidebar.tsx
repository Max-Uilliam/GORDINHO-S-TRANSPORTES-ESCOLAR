import {
  LayoutDashboard,
  Users,
  UserCircle,
  CreditCard,
  CalendarCheck,
  BarChart2,
  Settings,
  Bus,
  Menu,
  X,
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

const navItems = [
  { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students' as ActiveView, label: 'Alunos', icon: Users },
  { id: 'guardians' as ActiveView, label: 'Responsáveis', icon: UserCircle },
  { id: 'payments' as ActiveView, label: 'Mensalidades', icon: CreditCard },
  { id: 'attendance' as ActiveView, label: 'Presença', icon: CalendarCheck },
  { id: 'reports' as ActiveView, label: 'Relatórios', icon: BarChart2 },
  { id: 'settings' as ActiveView, label: 'Configurações', icon: Settings },
];

export default function Sidebar({ activeView, onNavigate, mobileOpen, onMobileToggle }: SidebarProps) {
  const handleNav = (view: ActiveView) => {
    onNavigate(view);
    if (mobileOpen) onMobileToggle();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Bus className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-500 tracking-widest uppercase leading-none">Gordinho's</p>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Transporte Escolar</p>
            </div>
          </div>
          <button
            className="lg:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
            onClick={onMobileToggle}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver card */}
        <div className="mx-4 mt-4 mb-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Motorista</p>
          <p className="text-sm font-medium text-zinc-100 leading-tight">Marcelo de Souza</p>
          <p className="text-xs text-zinc-400 mt-0.5">Cortinovis</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-zinc-400">Turno ativo</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest px-2 mb-2 mt-1">Menu principal</p>
          <ul className="space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => handleNav(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActive
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            Marcelo de Souza Cortinovis<br />
            <span className="text-zinc-700">CNPJ: 00.000.000/0001-00</span>
          </p>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
