import React from 'react';
import { Bookmark, Shield, Sparkles, QrCode, Share2, Key, HardDrive } from 'lucide-react';
import { TeleForgeSettings } from '../types';

interface ProfileViewProps {
  settings: TeleForgeSettings;
  onOpenSavedMessages: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onOpenSavedMessages,
}) => {
  return (
    <div id="profile-view" className="flex-1 overflow-y-auto px-4 py-5 max-w-xl mx-auto w-full space-y-5">
      {/* Profile Header Card */}
      <div className="text-center p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-blue-600 p-1 shadow-xl shadow-teal-500/20 mb-3.5">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl font-extrabold text-teal-300">
            TF
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-1.5">
          TeleForge Power User
          <span className="w-4 h-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
            ✓
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">@teleforge_user</p>
        <p className="text-xs text-slate-300 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Exploring custom client architectures, power folders, and native performance tweaks.
        </p>

        <div className="flex items-center justify-center gap-2 mt-3.5">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            TeleForge Client Active
          </span>
          {settings.privacyMode && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Privacy Shield On
            </span>
          )}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={onOpenSavedMessages}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
            Saved Messages
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Your personal cloud scratchpad</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
            Media &amp; Files
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Photos, documents, audio clips</p>
        </div>
      </div>

      {/* Account Specs */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
        <h4 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase">
          Client Security Details
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Telegram API ID</span>
            <span className="font-mono text-slate-200">28491024</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Encrypted MTProto Layer</span>
            <span className="font-mono text-teal-400">Layer 182 (obfuscated)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Database Cache Size</span>
            <span className="font-mono text-slate-200">14.2 MB (InMemory)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Experimental Flags</span>
            <span className="font-mono text-emerald-400">
              {settings.experimentalFeatures ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
