import React, { useMemo } from "react";
import { Contact } from "@/types/messaging";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ContactsSidebarProps {
  contacts: Contact[];
  searchTerm: string;
  selectedContactId?: string;
  onSearchChange: (term: string) => void;
  onSelectContact: (contact: Contact) => void;
  isSidebarOpen: boolean;
}

export const ContactsSidebar: React.FC<ContactsSidebarProps> = ({
  contacts,
  searchTerm,
  selectedContactId,
  onSearchChange,
  onSelectContact,
  isSidebarOpen,
}) => {
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      {isSidebarOpen && (
        <div className="p-4 border-b relative">
          <Input
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}

      <ScrollArea className="flex-1">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No contacts found</div>
        ) : (
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`
                  flex items-center p-3 cursor-pointer rounded-lg
                  ${
                    selectedContactId === contact.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-100"
                  }
                `}
                onClick={() => onSelectContact(contact)}
              >
                <Avatar className="mr-3">
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                </Avatar>
                {isSidebarOpen && (
                  <div className="flex-1 ">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="text-[#2E2E2E]">{contact.name}</div>
                        <div className="bg-[#828282] h-2 w-2 rounded-full"></div>
                        <div className="text-xs text-[#828282]">
                          {contact?.role}
                        </div>
                      </div>
                      <span className="text-xs text-[#828282]">
                        {contact.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {contact.lastMessage && (
                          <p className="text-sm text-[#2E2E2E] truncate">
                            {contact.lastMessage}
                          </p>
                        )}
                      </div>

                      <div>
                        {contact.unreadCount && (
                          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
