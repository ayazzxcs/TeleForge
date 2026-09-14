import React, { useState, useEffect } from 'react';
import { TabType, Chat, Message, Folder, Contact, TeleForgeSettings } from './types';
import {
  INITIAL_SETTINGS,
  INITIAL_FOLDERS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_CONTACTS,
} from './mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ChatsView } from './components/ChatsView';
import { ChatDetailView } from './components/ChatDetailView';
import { PowerFoldersView } from './components/PowerFoldersView';
import { ContactsView } from './components/ContactsView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { TeleForgeHubModal } from './components/TeleForgeHubModal';
import { ThemeStudioModal } from './components/ThemeStudioModal';
import { ProxyModal } from './components/ProxyModal';
import { OnboardingModal } from './components/OnboardingModal';

const SETTINGS_KEY = 'teleforge_settings_v3';
const FOLDERS_KEY = 'teleforge_folders_v3';
const CHATS_KEY = 'teleforge_chats_v3';
const MESSAGES_KEY = 'teleforge_messages_v3';

export const App: React.FC = () => {
  // Load state from localStorage with fallback to initial data
  const [settings, setSettings] = useState<TeleForgeSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const saved = localStorage.getItem(FOLDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem(CHATS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [isProxyOpen, setIsProxyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error(err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    } catch (err) {
      console.error(err);
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch (err) {
      console.error(err);
    }
  }, [chats]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }
  }, [messages]);

  const updateSettings = (newSettings: Partial<TeleForgeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleCreateFolder = (newFolderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...newFolderData,
      id: `folder-${Date.now()}`,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (activeFolderId === folderId) {
      setActiveFolderId('all');
    }
  };

  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
    setActiveTab('chats');
  };

  const handleSelectChat = (chat: Chat) => {
    // Clear unread count for this chat
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChat(chat);
  };

  const handleToggleMute = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isMuted: !c.isMuted } : c))
    );
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
    }
  };

  const handleMarkAllRead = () => {
    setChats((prev) => prev.map((c) => ({ ...c, unreadCount: 0 })));
    setIsHubOpen(false);
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'me',
      text,
      timestamp: timeStr,
      status: 'read',
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    // Update last message in chat list
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, lastMessage: text, timestamp: timeStr } : c
      )
    );

    // If chatting with Bot, trigger automated TeleForge response
    if (selectedChat?.type === 'bot') {
      setTimeout(() => {
        let replyText = `🤖 Command received: "${text}". All TeleForge subsystem metrics nominal.`;
        if (text.startsWith('/proxy')) {
          replyText = `📡 Active MTProxy node: ${settings.proxyServer}\nPing: ${settings.proxyPing}ms\nCipher: TLS 1.3 / AES-256-CTR`;
        } else if (text.startsWith('/folders')) {
          replyText = `📁 Configured Power Folders: ${folders.length}\nActive space: ${
            folders.find((f) => f.id === activeFolderId)?.name || 'All Chats'
          }`;
        } else if (text.startsWith('/stats')) {
          replyText = `⚡ TeleForge Engine Telemetry:\n- Version: v3.0.4\n- Memory: 38.4MB\n- State sync: Local Storage (Active)\n- Privacy Mode: ${
            settings.privacyMode ? 'ON' : 'OFF'
          }`;
        }

        const botMsg: Message = {
          id: `bot-msg-${Date.now()}`,
          chatId,
          sender: 'them',
          senderName: 'TeleForge Bot',
          text: replyText,
          timestamp: timeStr,
          status: 'read',
        };

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), botMsg],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, lastMessage: replyText, timestamp: timeStr } : c
          )
        );
      }, 700);
    }
  };

  const handleOpenChatWithContact = (contact: Contact) => {
    // Check if chat exists with this contact name
    let existingChat = chats.find((c) => c.title === contact.name);
    if (!existingChat) {
      existingChat = {
        id: `chat-${contact.id}`,
        title: contact.name,
        type: 'direct',
        avatar: contact.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2),
        avatarColor: 'from-blue-600 to-indigo-700',
        lastMessage: 'Chat opened via TeleForge Contacts',
        timestamp: 'Just now',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isOnline: contact.isOnline,
        folderIds: ['all'],
      };
      setChats((prev) => [existingChat!, ...prev]);
    }

    setSelectedChat(existingChat);
  };

  const handleOpenSavedMessages = () => {
    let savedChat = chats.find((c) => c.id === 'saved_messages');
    if (!savedChat) {
      savedChat = {
        id: 'saved_messages',
        title: 'Saved Messages',
        type: 'direct',
        avatar: '★',
        avatarColor: 'from-teal-400 to-cyan-600',
        lastMessage: 'Personal cloud notes',
        timestamp: 'Now',
        unreadCount: 0,
        isPinned: true,
        isMuted: false,
        folderIds: ['all'],
      };
      setChats((prev) => [savedChat!, ...prev]);
    }
    setSelectedChat(savedChat);
  };

  const totalUnreads = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Determine theme styling classes
  const getThemeClass = () => {
    switch (settings.activeTheme) {
      case 'telegram':
        return 'bg-[#0f1721] text-slate-100';
      case 'nord':
        return 'bg-[#242933] text-slate-100';
      case 'amoled':
        return 'bg-[#000000] text-slate-100';
      case 'emerald':
        return 'bg-[#021c14] text-slate-100';
      case 'teleforge':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans ${getThemeClass()}`}>
      {selectedChat ? (
        <ChatDetailView
          chat={selectedChat}
          messages={messages[selectedChat.id] || []}
          onBack={() => setSelectedChat(null)}
          onSendMessage={handleSendMessage}
          onToggleMute={handleToggleMute}
          settings={settings}
        />
      ) : (
        <>
          <Header
            title={
              activeTab === 'chats'
                ? 'TeleForge'
                : activeTab === 'folders'
                ? 'Power Folders'
                : activeTab === 'contacts'
                ? 'Contacts'
                : activeTab === 'settings'
                ? 'Settings'
                : 'My Profile'
            }
            subtitle={
              activeTab === 'folders'
                ? 'Your chats, your way'
                : undefined
            }
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenHub={() => setIsHubOpen(true)}
            onOpenProxy={() => setIsProxyOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            settings={settings}
          />

          <main className="flex-1 overflow-hidden flex flex-col relative">
            {activeTab === 'chats' && (
              <ChatsView
                chats={chats}
                folders={folders}
                activeFolderId={activeFolderId}
                onSelectFolder={setActiveFolderId}
                onSelectChat={handleSelectChat}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'folders' && (
              <PowerFoldersView
                folders={folders}
                chats={chats}
                settings={settings}
                onUpdateSettings={updateSettings}
                onCreateFolder={handleCreateFolder}
                onDeleteFolder={handleDeleteFolder}
                onSelectFolder={handleSelectFolder}
              />
            )}

            {activeTab === 'contacts' && (
              <ContactsView
                contacts={INITIAL_CONTACTS}
                settings={settings}
                searchQuery={searchQuery}
                onOpenChatWithContact={handleOpenChatWithContact}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onOpenHub={() => setIsHubOpen(true)}
                onOpenFolders={() => setActiveTab('folders')}
                onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
                onOpenProxy={() => setIsProxyOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                settings={settings}
                onOpenSavedMessages={handleOpenSavedMessages}
              />
            )}
          </main>

          <Navigation
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
            unreadTotal={totalUnreads}
            isCompact={settings.compactNavigation}
          />
        </>
      )}

      {/* TeleForge Control Center Modal (Item 9001 in SettingsActivity) */}
      <TeleForgeHubModal
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsHubOpen(false);
        }}
        onOpenThemeStudio={() => setIsThemeStudioOpen(true)}
        onOpenProxy={() => setIsProxyOpen(true)}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Theme Studio Modal */}
      <ThemeStudioModal
        isOpen={isThemeStudioOpen}
        onClose={() => setIsThemeStudioOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Proxy Diagnostics Modal */}
      <ProxyModal
        isOpen={isProxyOpen}
        onClose={() => setIsProxyOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Onboarding & Intro Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};
