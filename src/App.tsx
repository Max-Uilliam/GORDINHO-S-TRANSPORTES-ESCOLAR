import { useState } from 'react';
import Sidebar, { MobileMenuButton } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentsView from './components/StudentsView';
import StudentDetail from './components/StudentDetail';
import GuardiansView from './components/GuardiansView';
import GuardianDetail from './components/GuardianDetail';
import PaymentsView from './components/PaymentsView';
import AttendanceView from './components/AttendanceView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { ActiveView } from './types';
import { Bus } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null);

  const viewTitles: Record<ActiveView, string> = {
    dashboard: 'Painel de Controle',
    students: 'Alunos',
    'student-detail': 'Perfil do Aluno',
    guardians: 'Responsáveis',
    'guardian-detail': 'Perfil do Responsável',
    payments: 'Mensalidades',
    attendance: 'Lista de Presença',
    reports: 'Relatórios',
    settings: 'Configurações',
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'students':
        return (
          <StudentsView
            onNavigate={setActiveView}
            onSelectChild={setSelectedChildId}
          />
        );
      case 'student-detail':
        return selectedChildId ? (
          <StudentDetail childId={selectedChildId} onNavigate={setActiveView} />
        ) : (
          <StudentsView onNavigate={setActiveView} onSelectChild={setSelectedChildId} />
        );
      case 'guardians':
        return (
          <GuardiansView
            onNavigate={setActiveView}
            onSelectGuardian={setSelectedGuardianId}
          />
        );
      case 'guardian-detail':
        return selectedGuardianId ? (
          <GuardianDetail
            guardianId={selectedGuardianId}
            onNavigate={setActiveView}
            onSelectChild={setSelectedChildId}
          />
        ) : (
          <GuardiansView onNavigate={setActiveView} onSelectGuardian={setSelectedGuardianId} />
        );
      case 'payments':
        return <PaymentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 font-sans overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)} />
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
                <Bus className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="text-sm font-semibold text-amber-500">Gordinho's</span>
            </div>
            {/* Breadcrumb for desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-zinc-600 uppercase tracking-widest">
                {activeView === 'student-detail' || activeView === 'guardian-detail' ? 'Gestão' : 'Sistema'}
              </span>
              <span className="text-zinc-800">/</span>
              <span className="text-xs text-zinc-400">{viewTitles[activeView]}</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Offline indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Online</span>
            </div>
            {/* Date */}
            <div className="hidden sm:block text-xs text-zinc-600 tabular-nums">
              07/07/2025
            </div>
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">MC</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
