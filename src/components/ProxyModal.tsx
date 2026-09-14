import React, { useState } from 'react';
import { X, Wifi, Shield, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { TeleForgeSettings } from '../types';

interface ProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeleForgeSettings;
  onUpdateSettings: (s: Partial<TeleForgeSettings>) => void;
}

export const ProxyModal: React.FC<ProxyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [testingPing, setTestingPing] = useState(false);
  const [customServer, setCustomServer] = useState(settings.proxyServer);

  if (!isOpen) return null;

  const handleTestPing = () => {
    setTestingPing(true);
    setTimeout(() => {
      const newPing = Math.floor(Math.random() * 20) + 18;
      onUpdateSettings({ proxyPing: newPing });
      setTestingPing(false);
    }, 600);
  };

  const handleSave = () => {
    onUpdateSettings({ proxyServer: customServer });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="proxy-diagnostics-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-none">Connection &amp; Proxy</h2>
              <p className="text-xs text-slate-400 mt-0.5">MTProxy &amp; SOCKS5 diagnostics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  settings.proxyEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {settings.proxyEnabled ? 'Proxy Connected' : 'Direct Connection'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {settings.proxyEnabled ? `${settings.proxyServer} • ${settings.proxyPing}ms` : 'No proxy applied'}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={testingPing || !settings.proxyEnabled}
              onClick={handleTestPing}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700/60 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${testingPing ? 'animate-spin text-teal-400' : ''}`} />
              Ping
            </button>
          </div>

          {/* Proxy Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <h4 className="text-sm font-semibold text-slate-100">Use TeleForge Proxy</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Tunnel traffic through encrypted MTProxy endpoint
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.proxyEnabled}
                onChange={(e) => onUpdateSettings({ proxyEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Protocol Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Protocol Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['MTProxy', 'SOCKS5'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateSettings({ proxyType: type })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    settings.proxyType === type
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Server Host &amp; Port
            </label>
            <input
              type="text"
              value={customServer}
              onChange={(e) => setCustomServer(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Lock className="w-3 h-3 text-emerald-400" />
              End-to-End Cryptographic Secret
            </div>
            <div>Encryption: AES-256-CTR with obfuscated TLS 1.3 framing</div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl"
          >
            Save Proxy
          </button>
        </div>
      </div>
    </div>
  );
};
