import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Shield, Zap, FolderKanban, Check, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const pages = [
    {
      title: 'TeleForge',
      subtitle: 'The Power User Telegram Client.',
      desc: 'Engineered on Telegram\'s proven core, supercharged with modern power-user tools and precision navigation.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-teal-500/40 p-2 shadow-2xl shadow-teal-500/20 flex items-center justify-center">
          <svg viewBox="0 0 108 108" className="w-16 h-16">
            <path fill="#0F172A" d="M14 4h80c5.5 0 10 4.5 10 10v80c0 5.5-4.5 10-10 10H14c-5.5 0-10-4.5-10-10V14C4 8.5 8.5 4 14 4z" />
            <path fill="#5EEAD4" d="M18 25h46v11H47v46H35V36H18z" />
            <path fill="#FFFFFF" d="M58 25h33v11H70v12h18v11H70v23H58z" />
          </svg>
        </div>
      ),
      badge: 'PHASE 1: BRANDING INITIALIZED',
    },
    {
      title: 'Ultra-Fast MTProto Core',
      subtitle: 'Native High-Throughput Engine',
      desc: 'TeleForge preserves Telegram\'s direct C++ cryptographic substrate, native database, and instant push notification delivery.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/40 text-teal-300 flex items-center justify-center shadow-xl">
          <Zap className="w-10 h-10" />
        </div>
      ),
      badge: 'PROVEN CORE',
    },
    {
      title: 'Power Folders',
      subtitle: 'Your chats, your way.',
      desc: 'Organize high-traffic chats, channels, and groups into custom spaces with dedicated tabs, badges, and smart rules.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/40 text-blue-300 flex items-center justify-center shadow-xl">
          <FolderKanban className="w-10 h-10" />
        </div>
      ),
      badge: 'TELEFORGE WORKSPACES',
    },
    {
      title: 'Privacy & Stability',
      subtitle: 'Zero Destructive Core Modifications',
      desc: 'Strict isolation between UI and core systems guarantees your client stays responsive and never crashes on startup.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-xl">
          <Shield className="w-10 h-10" />
        </div>
      ),
      badge: '100% STABLE',
    },
  ];

  const current = pages[currentPage];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="teleforge-onboarding-modal"
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 flex flex-col shadow-2xl overflow-hidden relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Carousel Content */}
        <div className="flex flex-col items-center text-center pt-4 pb-6 space-y-4">
          {current.icon}

          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-bold tracking-wider">
            {current.badge}
          </span>

          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">
              {current.title}
            </h2>
            <h3 className="text-sm font-semibold text-teal-400 mt-1">
              {current.subtitle}
            </h3>
            <p className="text-xs text-slate-300 mt-2.5 max-w-xs leading-relaxed">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentPage ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Nav Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentPage < pages.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-teal-500/10"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-teal-500/20"
            >
              Start Messaging
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
