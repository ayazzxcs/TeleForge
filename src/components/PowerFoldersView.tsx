import React, { useState } from 'react';
import { Folder, Chat, TeleForgeSettings, ChatType } from '../types';
import { Plus, Check, Trash2, SlidersHorizontal, Sparkles, LayoutGrid } from 'lucide-react';

interface PowerFoldersViewProps {
  folders: Folder[];
  chats: Chat[];
  settings: TeleForgeSettings;
  onUpdateSettings: (settings: Partial<TeleForgeSettings>) => void;
  onCreateFolder: (folder: Omit<Folder, 'id'>) => void;
  onDeleteFolder: (id: string) => void;
  onSelectFolder: (folderId: string) => void;
}

export const PowerFoldersView: React.FC<PowerFoldersViewProps> = ({
  folders,
  chats,
  settings,
  onUpdateSettings,
  onCreateFolder,
  onDeleteFolder,
  onSelectFolder,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('📁');
  const [newFolderColor, setNewFolderColor] = useState('#5EEAD4');
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<ChatType[]>(['direct', 'group']);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'rules'>('overview');

  const availableIcons = ['📁', '💼', '🚀', '📢', '🤖', '💎', '🎮', '⚡', '🔒', '📚'];
  const availableColors = ['#5EEAD4', '#60A5FA', '#F472B6', '#A78BFA', '#FBBF24', '#34D399'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    onCreateFolder({
      name: newFolderName.trim(),
      icon: newFolderIcon,
      color: newFolderColor,
      filterTypes: selectedFilterTypes,
    });

    setNewFolderName('');
    setShowCreateModal(false);
  };

  const toggleFilterType = (type: ChatType) => {
    if (selectedFilterTypes.includes(type)) {
      if (selectedFilterTypes.length > 1) {
        setSelectedFilterTypes(selectedFilterTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedFilterTypes([...selectedFilterTypes, type]);
    }
  };

  return (
    <div id="power-folders-view" className="flex-1 overflow-y-auto px-4 py-5 max-w-xl mx-auto w-full">
      {/* Hero Section matching TeleForgeFoldersActivity.java */}
      <div className="mb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-semibold">
          TeleForge Structure
        </span>
        <h2 id="power-folders-hero" className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Your chats, your way.
        </h2>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          Build focused spaces for work, gaming, communities and everything in between.
        </p>
      </div>

      {/* Main Action Cards matching Java source */}
      <div className="space-y-3 mb-6">
        {/* Manage Folders Card */}
        <div
          id="card-manage-folders"
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl font-bold border border-teal-500/20 group-hover:scale-105 transition-transform">
            ▦
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-100">Manage folders</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create, rename and configure your Telegram folders
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300">
            <Plus className="w-4 h-4" />
          </div>
        </div>

        {/* Advanced Rules Card */}
        <div
          id="card-advanced-rules"
          onClick={() => setActiveSubTab(activeSubTab === 'rules' ? 'overview' : 'rules')}
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-purple-500/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl font-bold border border-purple-500/20 group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">Advanced rules</h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full font-mono">
                Smart Rules
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              TeleForge-ready control surface for future smart rules
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Advanced Rules Sub-Panel */}
      {activeSubTab === 'rules' && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
            <Sparkles className="w-4 h-4" />
            Active Smart Filters
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <div>
                <div className="text-slate-200 font-medium">Auto-archive muted channels</div>
                <div className="text-slate-400 text-[11px]">Routes low-priority channels out of Main Feed</div>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <div>
                <div className="text-slate-200 font-medium">Unread-only priority sorting</div>
                <div className="text-slate-400 text-[11px]">Surfaces chats needing attention to the top</div>
              </div>
              <span className="text-teal-400 font-mono text-[11px]">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TeleForge Layout Switches matching TeleForgeFoldersActivity.java */}
      <div className="mb-6">
        <h3 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase mb-3">
          TeleForge Layout
        </h3>
        <div className="space-y-2.5">
          {/* Compact Navigation Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="pr-4">
              <h4 className="text-sm font-semibold text-slate-100">Compact navigation</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Use a denser navigation layout for power users.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                id="toggle-compact-navigation"
                type="checkbox"
                checked={settings.compactNavigation}
                onChange={(e) => onUpdateSettings({ compactNavigation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          {/* Folder-first workflow Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="pr-4">
              <h4 className="text-sm font-semibold text-slate-100">Folder-first workflow</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep Power Folders as the primary organization surface.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                id="toggle-folder-first"
                type="checkbox"
                checked={settings.folderFirstWorkflow}
                onChange={(e) => onUpdateSettings({ folderFirstWorkflow: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Configured Folders List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase">
            Active Power Folders ({folders.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            New Folder
          </button>
        </div>

        <div className="space-y-2">
          {folders.map((folder) => {
            const count = chats.filter((c) =>
              folder.id === 'all' ? true : c.folderIds.includes(folder.id) || folder.filterTypes.includes(c.type)
            ).length;

            return (
              <div
                key={folder.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 transition-colors"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => onSelectFolder(folder.id)}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                    style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                  >
                    {folder.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      {folder.name}
                      {folder.isDefault && (
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {count} {count === 1 ? 'chat' : 'chats'} • {folder.filterTypes.join(', ')}
                    </div>
                  </div>
                </div>

                {!folder.isDefault && (
                  <button
                    type="button"
                    onClick={() => onDeleteFolder(folder.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete folder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Note matching TeleForgeFoldersActivity.java lines 346-349 */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs leading-relaxed">
        <p>
          <span className="font-semibold text-slate-300">Compatibility Note:</span> Power Folders uses Telegram&apos;s existing folder engine underneath, keeping your organization compatible with normal Telegram clients.
        </p>
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-teal-400" />
              Create Power Folder
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Group chats with custom rules, badges, and automated filters.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Core Engineering, Alpha VIP, Family"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Folder Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewFolderIcon(ic)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                        newFolderIcon === ic
                          ? 'border-teal-400 bg-teal-500/20 scale-105'
                          : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newFolderColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Include Chat Types
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['direct', 'group', 'channel', 'bot'] as ChatType[]).map((type) => {
                    const isSelected = selectedFilterTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleFilterType(type)}
                        className={`p-2 rounded-lg border flex items-center justify-between capitalize transition-colors ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500/50 text-teal-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{type === 'direct' ? 'Direct Messages' : `${type}s`}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
