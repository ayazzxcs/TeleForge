import React from 'react';
import { Sliders, Shield, Wifi, Search, X, Sparkles } from 'lucide-react';
import { TeleForgeSettings } from '../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenHub: () => void;
  onOpenProxy: () => void;
  onOpenOnboarding: () => void;
  settings: TeleForgeSettings;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'TeleForge',
  subtitle,
  searchQuery,
  onSearchChange,
  onOpenHub,
  onOpenProxy,
  onOpenOnboarding,
  settings,
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header
      id="teleforge-app-header"
      className="bg-slate-900/95 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 shrink-0 z-20"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Branding or Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl bg-slate-900 border border-teal-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/10 cursor-pointer hover:border-teal-400 transition-colors"
            onClick={onOpenHub}
            title="TeleForge Hub"
          >
            {/* Custom TeleForge Launcher Vector representation */}
            <svg viewBox="0 0 108 108" className="w-full h-full">
              <path fill="#111827" d="M14 4h80c5.5 0 10 4.5 10 10v80c0 5.5-4.5 10-10 10H14c-5.5 0-10-4.5-10-10V14C4 8.5 8.5 4 14 4z" />
              <path fill="#5EEAD4" d="M18 25h46v11H47v46H35V36H18z" />
              <path fill="#FFFFFF" d="M58 25h33v11H70v12h18v11H70v23H58z" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 id="header-app-title" className="text-lg font-bold text-slate-100 tracking-tight truncate">
                {title}
              </h1>
              {settings.privacyMode && (
                <span className="flex items-center gap-1 text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" />
                  Privacy
                </span>
              )}
            </div>
            {subtitle ? (
              <p className="text-xs text-slate-400 truncate">{subtitle}</p>
            ) : (
              <p className="text-[11px] text-teal-400/90 font-mono flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping shrink-0" />
                The Power User Telegram Client.
              </p>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Onboarding / Branding Guide */}
          <button
            id="header-onboarding-btn"
            type="button"
            onClick={onOpenOnboarding}
            className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors"
            title="TeleForge Onboarding & Intro"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
          </button>

          {/* Proxy Ping Button */}
          <button
            id="header-proxy-indicator"
            type="button"
            onClick={onOpenProxy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono bg-slate-800/80 border border-slate-700/60 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-colors"
            title="Proxy Diagnostics"
          >
            <Wifi className={`w-3.5 h-3.5 ${settings.proxyEnabled ? 'text-teal-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{settings.proxyPing}ms</span>
          </button>

          {/* Search Toggle */}
          <button
            id="header-search-toggle"
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              showSearch
                ? 'bg-teal-500/20 text-teal-300'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* TeleForge Hub Shortcut */}
          <button
            id="header-open-hub-btn"
            type="button"
            onClick={onOpenHub}
            className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 transition-colors"
            title="TeleForge Control Center"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {showSearch && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-2 animate-in fade-in duration-150">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chats, messages, power folders..."
              className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-8 py-1.5 rounded-lg border border-slate-700/60 focus:outline-none focus:border-teal-500/70"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
