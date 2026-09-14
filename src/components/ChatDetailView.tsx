import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, CheckCheck, Check, Clock, Volume2, VolumeX, Shield } from 'lucide-react';
import { Chat, Message, TeleForgeSettings } from '../types';

interface ChatDetailViewProps {
  chat: Chat;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (chatId: string, text: string) => void;
  onToggleMute: (chatId: string) => void;
  settings: TeleForgeSettings;
}

export const ChatDetailView: React.FC<ChatDetailViewProps> = ({
  chat,
  messages,
  onBack,
  onSendMessage,
  onToggleMute,
  settings,
}) => {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [sendMode, setSendMode] = useState<'normal' | 'silent' | 'scheduled'>('normal');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(chat.id, inputText.trim());
    setInputText('');
  };

  const getSubStatus = () => {
    if (chat.type === 'bot') return 'bot • TeleForge verified';
    if (chat.type === 'channel') return `${chat.membersCount?.toLocaleString() || '45k'} subscribers`;
    if (chat.type === 'group') return `${chat.membersCount || '120'} members • 24 online`;
    return chat.isOnline ? 'online' : 'last seen recently';
  };

  return (
    <div id="chat-detail-view" className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top App Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-3 py-2.5 flex items-center justify-between shrink-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white bg-gradient-to-tr ${chat.avatarColor}`}
            >
              {chat.avatar}
            </div>
            {chat.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
            )}
          </div>

          <div className="min-w-0 cursor-pointer">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold text-slate-100 truncate">{chat.title}</h2>
              {chat.verified && (
                <span className="w-3.5 h-3.5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">
                  ✓
                </span>
              )}
            </div>
            <p className="text-[11px] text-teal-400/90 truncate capitalize">{getSubStatus()}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleMute(chat.id)}
            className={`p-2 rounded-lg transition-colors ${
              chat.isMuted ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={chat.isMuted ? 'Unmute' : 'Mute'}
          >
            {chat.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSendMode(sendMode === 'silent' ? 'normal' : 'silent');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Silent Send</span>
                  {sendMode === 'silent' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSendMode(sendMode === 'scheduled' ? 'normal' : 'scheduled');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Schedule Message</span>
                  {sendMode === 'scheduled' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  type="button"
                  onClick={() => {
                    onToggleMute(chat.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-rose-400"
                >
                  {chat.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">End-to-End Encrypted Space</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Messages in this chat are protected with TeleForge high-throughput client protocols.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === 'me';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                {!isMe && m.senderName && chat.type !== 'direct' && (
                  <span className="text-[11px] font-semibold text-teal-400 mb-0.5 ml-2">
                    {m.senderName}
                  </span>
                )}

                <div
                  className={`relative max-w-[82%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                    isMe
                      ? 'bg-teal-600 text-slate-950 font-medium rounded-br-xs'
                      : settings.bubbleStyle === 'glass'
                      ? 'bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-slate-100 rounded-bl-xs'
                      : 'bg-slate-800 border border-slate-700/50 text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {m.text}

                  {/* Message timestamp & status ticks */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMe ? 'text-slate-900/80' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isMe && (
                      <span>
                        {m.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-slate-950" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-950" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reactions if any */}
                  {m.reactions && m.reactions.length > 0 && (
                    <div className="flex gap-1 -mb-5 mt-1.5">
                      {m.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] text-slate-200 shadow"
                        >
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mode Badge if Scheduled or Silent */}
      {sendMode !== 'normal' && (
        <div className="px-4 py-1.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Mode: {sendMode === 'silent' ? 'Silent Send (No Notification)' : 'Scheduled Send (In 1 Hour)'}
          </span>
          <button
            type="button"
            onClick={() => setSendMode('normal')}
            className="text-[11px] underline text-slate-400 hover:text-slate-200"
          >
            Reset
          </button>
        </div>
      )}

      {/* Interactive Bottom Message Bar */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-md shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            id="chat-message-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              chat.type === 'bot'
                ? 'Send command (e.g. /proxy, /folders)...'
                : 'Write a message...'
            }
            className="flex-1 bg-slate-800/90 border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/70"
          />

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Emoji picker"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md shadow-teal-500/10"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
