import { Settings, Bell, Shield, Database, Wifi, Info } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Sistema</p>
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Info className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-zinc-100">Dados do Negócio</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Razão Social', value: 'Marcelo de Souza Cortinovis' },
              { label: 'Nome Fantasia', value: "Gordinho's Transporte Escolar" },
              { label: 'CNPJ', value: '00.000.000/0001-00' },
              { label: 'Telefone Comercial', value: '(11) 99999-0000' },
              { label: 'E-mail', value: 'gordinhostransporte@email.com' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">{label}</label>
                <input
                  type="text"
                  defaultValue={value}
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            ))}
            <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
              Salvar alterações
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Configurações de Mensalidade</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">Valor padrão (Matutino)</label>
                <input type="text" defaultValue="R$ 320,00" className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">Valor padrão (Vespertino)</label>
                <input type="text" defaultValue="R$ 350,00" className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">Dia de vencimento</label>
                <input type="text" defaultValue="10" className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Notificações</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Aviso de vencimento (3 dias antes)', enabled: true },
                { label: 'Alerta de pagamento em atraso', enabled: true },
                { label: 'Resumo diário de presença', enabled: false },
                { label: 'Cobranças automáticas via WhatsApp', enabled: false },
              ].map(({ label, enabled }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-zinc-300">{label}</span>
                  <div
                    className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-all ${enabled ? 'bg-amber-500' : 'bg-zinc-700'}`}
                    style={{ height: '22px' }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Sincronização & Dados</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-500" strokeWidth={1.75} />
                  <span className="text-xs text-zinc-300">Última sincronização</span>
                </div>
                <span className="text-xs text-zinc-500">07/07/2025 - 06:45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
                  <span className="text-xs text-zinc-300">Banco local (SQLite)</span>
                </div>
                <span className="text-xs text-emerald-400">Operacional</span>
              </div>
              <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 font-medium rounded-lg transition-colors border border-zinc-700">
                Forçar sincronização agora
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-zinc-100">Segurança</h2>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2.5 text-left px-3 bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 rounded-lg transition-colors border border-zinc-700">
                Alterar senha de acesso
              </button>
              <button className="w-full py-2.5 text-left px-3 bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 rounded-lg transition-colors border border-zinc-700">
                PIN de desbloqueio offline
              </button>
              <button className="w-full py-2.5 text-left px-3 bg-red-900/20 hover:bg-red-900/30 text-sm text-red-400 rounded-lg transition-colors border border-red-500/20">
                Limpar dados locais
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
        <p className="text-xs text-zinc-600">Gordinho's Transporte Escolar — v1.0.0</p>
        <p className="text-xs text-zinc-700">Marcelo de Souza Cortinovis © 2025</p>
      </div>
    </div>
  );
}
