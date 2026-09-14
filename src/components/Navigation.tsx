import React from 'react';
import { MessageSquare, FolderKanban, Users, Settings, User } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadTotal: number;
  isCompact: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unreadTotal,
  isCompact,
}) => {
  const tabs = [
    { id: 'chats' as TabType, label: 'Chats', icon: MessageSquare, badge: unreadTotal > 0 ? unreadTotal : null },
    { id: 'folders' as TabType, label: 'Folders', icon: FolderKanban, badge: null },
    { id: 'contacts' as TabType, label: 'Contacts', icon: Users, badge: null },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings, badge: null },
    { id: 'profile' as TabType, label: 'Profile', icon: User, badge: null },
  ];

  return (
    <nav
      id="teleforge-bottom-nav"
      className={`border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-xl transition-all duration-200 z-30 shrink-0 ${
        isCompact ? 'py-1.5 px-3' : 'py-2 px-4'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center transition-all duration-150 rounded-xl ${
                isCompact ? 'px-3 py-1' : 'px-4 py-1.5'
              } ${
                isActive
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`${isCompact ? 'w-5 h-5' : 'w-6 h-6'} transition-transform duration-150 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    id="nav-unread-badge"
                    className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-teal-500 text-slate-950 text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse"
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`tracking-tight ${isCompact ? 'text-[10px] mt-0.5' : 'text-[11px] mt-1'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
