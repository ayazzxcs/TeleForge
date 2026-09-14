import React from 'react';
import { X, Palette, Check, Sparkles } from 'lucide-react';
import { TeleForgeSettings, ThemePreset } from '../types';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeleForgeSettings;
  onUpdateSettings: (s: Partial<TeleForgeSettings>) => void;
}

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes: { id: ThemePreset; name: string; bg: string; accent: string; desc: string }[] = [
    {
      id: 'teleforge',
      name: 'TeleForge Cyber',
      bg: '#090d16',
      accent: '#5EEAD4',
      desc: 'The signature power user palette: deep slate with vivid cyan.',
    },
    {
      id: 'telegram',
      name: 'Telegram Classic',
      bg: '#17212b',
      accent: '#5288c1',
      desc: 'Original Telegram dark blues and comfortable contrast.',
    },
    {
      id: 'nord',
      name: 'Nord Arctic',
      bg: '#2e3440',
      accent: '#88c0d0',
      desc: 'Cool frosted slate inspired by Scandinavian auroras.',
    },
    {
      id: 'amoled',
      name: 'Midnight AMOLED',
      bg: '#000000',
      accent: '#38bdf8',
      desc: 'Pure true-black substrate engineered to save battery.',
    },
    {
      id: 'emerald',
      name: 'Emerald Matrix',
      bg: '#052e16',
      accent: '#34d399',
      desc: 'High-contrast botanical dark with emerald accents.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="theme-studio-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-none">Theme Studio</h2>
              <p className="text-xs text-slate-400 mt-0.5">Deep visual customization &amp; accents</p>
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

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Live Preview Card */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-2 block">
              LIVE BUBBLE PREVIEW
            </span>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-xs flex items-center justify-center font-bold text-slate-200 shrink-0">
                  TF
                </div>
                <div
                  className={`p-3 rounded-2xl rounded-bl-sm text-xs leading-relaxed ${
                    settings.bubbleStyle === 'glass'
                      ? 'bg-slate-800/40 backdrop-blur-md border border-slate-700/50 text-slate-200'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  Theme Studio lets you fine-tune appearance without breaking upstream Telegram updates.
                  <span className="block text-[10px] text-slate-400 mt-1 text-right">18:42</span>
                </div>
              </div>

              <div className="flex items-end justify-end gap-2">
                <div
                  className="p-3 rounded-2xl rounded-br-sm text-xs leading-relaxed max-w-[80%] shadow-sm"
                  style={{
                    backgroundColor:
                      settings.activeTheme === 'teleforge'
                        ? '#0d9488'
                        : settings.activeTheme === 'telegram'
                        ? '#2563eb'
                        : settings.activeTheme === 'nord'
                        ? '#0284c7'
                        : settings.activeTheme === 'amoled'
                        ? '#0284c7'
                        : '#059669',
                    color: '#ffffff',
                  }}
                >
                  Looks incredibly clean! Instant live preview is responsive.
                  <span className="block text-[10px] text-white/80 mt-1 text-right">18:43 ✓✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-2.5 block">
              THEME PRESETS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const isActive = settings.activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateSettings({ activeTheme: t.id })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-slate-800 border-teal-400 shadow-md ring-1 ring-teal-400/50'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-600 flex items-center justify-center text-xs shrink-0"
                        style={{ backgroundColor: t.bg }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{t.desc.slice(0, 32)}...</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bubble Styling */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-2 block">
              BUBBLE STYLING
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'modern', label: 'Modern Rounded' },
                { id: 'glass', label: 'Glassmorphic' },
                { id: 'classic', label: 'Compact Classic' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onUpdateSettings({ bubbleStyle: b.id as any })}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    settings.bubbleStyle === b.id
                      ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-semibold'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
};
