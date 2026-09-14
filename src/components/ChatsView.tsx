import React from 'react';
import { Chat, Folder } from '../types';
import { Pin, VolumeX, CheckCheck, Sparkles, Plus } from 'lucide-react';

interface ChatsViewProps {
  chats: Chat[];
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onSelectChat: (chat: Chat) => void;
  searchQuery: string;
}

export const ChatsView: React.FC<ChatsViewProps> = ({
  chats,
  folders,
  activeFolderId,
  onSelectFolder,
  onSelectChat,
  searchQuery,
}) => {
  const activeFolder = folders.find((f) => f.id === activeFolderId) || folders[0];

  const filteredChats = chats.filter((chat) => {
    // Filter by active folder
    const matchesFolder =
      activeFolderId === 'all'
        ? true
        : chat.folderIds.includes(activeFolderId) || activeFolder?.filterTypes.includes(chat.type);

    if (!matchesFolder) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        chat.title.toLowerCase().includes(q) ||
        chat.lastMessage.toLowerCase().includes(q) ||
        chat.type.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div id="chats-view-container" className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Folder Tab Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-3 py-2 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {folders.map((folder) => {
            const isActive = activeFolderId === folder.id;
            const folderCount = chats.filter((c) =>
              folder.id === 'all'
                ? true
                : c.folderIds.includes(folder.id) || folder.filterTypes.includes(c.type)
            ).reduce((acc, curr) => acc + curr.unreadCount, 0);

            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => onSelectFolder(folder.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span>{folder.icon}</span>
                <span>{folder.name}</span>
                {folderCount > 0 && (
                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-teal-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {folderCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredChats.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-medium">No chats found in this space.</p>
            <p className="text-xs text-slate-600 mt-1">
              Try adjusting your search query or folder filter rules.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              id={`chat-item-${chat.id}`}
              onClick={() => onSelectChat(chat)}
              className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-800/40 cursor-pointer transition-colors group relative"
            >
              {/* Avatar with Status */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-md bg-gradient-to-tr ${chat.avatarColor}`}
                >
                  {chat.avatar}
                </div>
                {chat.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                )}
              </div>

              {/* Chat Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-teal-300 transition-colors">
                      {chat.title}
                    </h3>
                    {chat.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">
                        ✓
                      </span>
                    )}
                    {chat.isMuted && (
                      <VolumeX className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {chat.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-400 truncate">
                    {chat.lastMessageSender && (
                      <span className="text-slate-300 font-medium mr-1">
                        {chat.lastMessageSender}:
                      </span>
                    )}
                    {chat.lastMessage}
                  </p>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {chat.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-slate-500 rotate-45" />
                    )}
                    {chat.unreadCount > 0 ? (
                      <span className="min-w-[18px] h-[18px] px-1 bg-teal-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                        {chat.unreadCount}
                      </span>
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-teal-400/70" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
