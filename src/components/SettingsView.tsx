import React from 'react';
import {
  Sliders,
  ChevronRight,
  FolderKanban,
  Shield,
  Palette,
  HardDrive,
  Laptop,
  Globe,
  Bell,
  Sparkles,
  Download,
} from 'lucide-react';
import { TeleForgeSettings } from '../types';

interface SettingsViewProps {
  settings: TeleForgeSettings;
  onOpenHub: () => void;
  onOpenFolders: () => void;
  onOpenThemeStudio: () => void;
  onOpenProxy: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onOpenHub,
  onOpenFolders,
  onOpenThemeStudio,
  onOpenProxy,
}) => {
  return (
    <div id="settings-view" className="flex-1 overflow-y-auto px-4 py-4 max-w-xl mx-auto w-full space-y-4">
      {/* Account Profile Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/10">
          TF
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
            TeleForge Power User
            <span className="w-3.5 h-3.5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">@teleforge_user • +1 (555) 014-992</p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-teal-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            TeleForge Client v3.0.4 Active
          </div>
        </div>
      </div>

      {/* PROMINENT TELEFORGE SETTINGS ENTRY (Item 9001 in SettingsActivity.java) */}
      <div
        id="settings-teleforge-hub-row"
        onClick={onOpenHub}
        className="group p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-teal-500/40 hover:border-teal-400/80 transition-all cursor-pointer shadow-lg shadow-teal-500/5 relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <Sliders className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  TeleForge
                </h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                  Control Center
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Power tools and customization</p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Main Settings Categories */}
      <div className="space-y-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 p-2 text-xs">
        <div
          onClick={onOpenFolders}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Power Folders</div>
              <div className="text-slate-400 text-[11px]">Chat spaces, rules and organization</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={onOpenThemeStudio}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Theme Studio</div>
              <div className="text-slate-400 text-[11px]">Colors, bubble radius and appearance</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={onOpenProxy}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Connection &amp; Proxy</div>
              <div className="text-slate-400 text-[11px]">
                {settings.proxyEnabled ? `MTProxy Connected (${settings.proxyPing}ms)` : 'Direct connection'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Privacy and Security</div>
              <div className="text-slate-400 text-[11px]">Two-step verification, passcodes, lock</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Notifications and Sounds</div>
              <div className="text-slate-400 text-[11px]">In-app alerts, badges and vibration</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Devices</div>
              <div className="text-slate-400 text-[11px]">1 active session (TeleForge Web Client)</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Language</div>
              <div className="text-slate-400 text-[11px]">English</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Client Build Information & APK Distribution */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="text-center space-y-1">
          <div className="font-semibold text-slate-200 text-sm">TeleForge for Android &amp; Web</div>
          <div className="text-xs text-slate-400">The Power User Telegram Client • v1.0.0 (Phase 1)</div>
          <div className="text-[11px] text-teal-400 font-mono">Package: org.telegram.messenger (Build 10001)</div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-xs font-semibold text-slate-300 block">Latest Android APK</span>
            <span className="text-[11px] text-slate-400">TeleForge-1.0.0-debug.apk (verified build)</span>
          </div>
          <a
            id="download-latest-apk-btn"
            href="/apk/TeleForge-latest.apk"
            download="TeleForge-latest.apk"
            className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/10 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download APK
          </a>
        </div>
      </div>
    </div>
  );
};
