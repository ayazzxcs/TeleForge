export type TabType = 'chats' | 'folders' | 'contacts' | 'settings' | 'profile';

export type ChatType = 'direct' | 'group' | 'channel' | 'bot';

export interface Chat {
  id: string;
  title: string;
  type: ChatType;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageSender?: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isOnline?: boolean;
  verified?: boolean;
  folderIds: string[];
  membersCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  sender: 'me' | 'them';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { emoji: string; count: number }[];
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
  filterTypes: ChatType[];
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: string;
  isOnline: boolean;
  avatarColor: string;
}

export type ThemePreset = 'teleforge' | 'telegram' | 'nord' | 'amoled' | 'emerald';

export interface TeleForgeSettings {
  experimentalFeatures: boolean;
  privacyMode: boolean;
  compactNavigation: boolean;
  folderFirstWorkflow: boolean;
  activeTheme: ThemePreset;
  hidePhoneNumber: boolean;
  disableLinkPreviews: boolean;
  proxyEnabled: boolean;
  proxyType: 'MTProxy' | 'SOCKS5';
  proxyServer: string;
  proxyPing: number;
  developerDiagnostics: boolean;
  bubbleStyle: 'classic' | 'modern' | 'glass';
}
