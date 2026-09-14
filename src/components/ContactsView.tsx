import React from 'react';
import { Contact, TeleForgeSettings } from '../types';
import { UserPlus, MessageSquare, Phone, Shield } from 'lucide-react';

interface ContactsViewProps {
  contacts: Contact[];
  settings: TeleForgeSettings;
  searchQuery: string;
  onOpenChatWithContact: (contact: Contact) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  settings,
  searchQuery,
  onOpenChatWithContact,
}) => {
  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div id="contacts-view" className="flex-1 overflow-y-auto px-4 py-4 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Contacts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {contacts.filter((c) => c.isOnline).length} online • {contacts.length} total
          </p>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Contact
        </button>
      </div>

      <div className="divide-y divide-slate-800/60 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onOpenChatWithContact(contact)}
            className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${contact.avatarColor}`}
                >
                  {contact.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                {contact.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 transition-colors truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{contact.username}</span>
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {settings.privacyMode ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400/90 text-[11px]">
                      <Shield className="w-3 h-3" />
                      Phone masked by Privacy Mode
                    </span>
                  ) : (
                    <span>{contact.phone}</span>
                  )}
                  <span className="mx-1.5">•</span>
                  <span className={contact.isOnline ? 'text-teal-400 font-medium' : 'text-slate-500'}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Send Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
