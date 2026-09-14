import React from 'react';
import {
  X,
  Palette,
  FolderKanban,
  Wifi,
  Sliders,
  CheckCheck,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TeleForgeSettings, TabType } from '../types';

interface TeleForgeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeleForgeSettings;
  onUpdateSettings: (s: Partial<TeleForgeSettings>) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenThemeStudio: () => void;
  onOpenProxy: () => void;
  onMarkAllRead: () => void;
}

export const TeleForgeHubModal: React.FC<TeleForgeHubModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onNavigateTab,
  onOpenThemeStudio,
  onOpenProxy,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="teleforge-control-center-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-none">TeleForge Control Center</h2>
              <p className="text-xs text-slate-400 mt-0.5">Power tools &amp; customization in one place</p>
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Header block from TeleForgeHubActivity.java */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
              Power User Control Center
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              TeleForge tools and customization in one place.
            </p>
          </div>

          {/* SECTION: POWER TOOLS */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-2.5">
              POWER TOOLS
            </h4>
            <div className="space-y-2.5">
              {/* Power Folders Action */}
              <div
                onClick={() => {
                  onClose();
                  onNavigateTab('folders');
                }}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                      Power Folders
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open Telegram&apos;s folder manager with TeleForge controls planned around it.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>

              {/* Theme Studio Action */}
              <div
                onClick={() => {
                  onClose();
                  onOpenThemeStudio();
                }}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                      Theme Studio
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Open Telegram&apos;s theme editor from the TeleForge hub.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>

              {/* Proxy Diagnostics */}
              <div
                onClick={() => {
                  onClose();
                  onOpenProxy();
                }}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                      Connection &amp; Proxy Diagnostics
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      MTProxy latency, ping tests and censorship circumvention.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400">{settings.proxyPing}ms</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Bulk Message Actions */}
              <div
                onClick={onMarkAllRead}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                      Bulk Message Actions
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mark all incoming chats as read in 1 click.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg">
                  Execute
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: TELEFORGE MODES */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-2.5">
              TELEFORGE MODES
            </h4>
            <div className="space-y-2.5">
              {/* Experimental features Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-3 pr-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100">Experimental features</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enable TeleForge experimental feature flags.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-experimental-features"
                    type="checkbox"
                    checked={settings.experimentalFeatures}
                    onChange={(e) => onUpdateSettings({ experimentalFeatures: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              {/* Privacy-first mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-3 pr-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100">Privacy-first mode</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enable TeleForge privacy-oriented feature flags.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-privacy-mode"
                    type="checkbox"
                    checked={settings.privacyMode}
                    onChange={(e) => onUpdateSettings({ privacyMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              {/* Developer Diagnostics Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-3 pr-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-100">Developer Diagnostics</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Show real-time performance HUD &amp; packet logs.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-dev-diagnostics"
                    type="checkbox"
                    checked={settings.developerDiagnostics}
                    onChange={(e) => onUpdateSettings({ developerDiagnostics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Real-time Diagnostics Bar (if enabled) */}
          {settings.developerDiagnostics && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-500/30 font-mono text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-teal-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  SYSTEM TELEMETRY
                </span>
                <span>60 FPS</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Memory alloc: 42.1 MB</span>
                <span>TCP latency: {settings.proxyPing}ms</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full w-2/5 animate-pulse" />
              </div>
            </div>
          )}

          {/* Footer note matching TeleForgeHubActivity.java lines 143-144 */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 text-xs text-slate-400 text-center">
            More TeleForge-native controls will be added here as they are implemented.
          </div>
        </div>
      </div>
    </div>
  );
};
