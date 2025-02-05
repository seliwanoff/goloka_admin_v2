"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Paperclip,
  ImageIcon,
} from "lucide-react";

import { Contact, Message } from "@/types/messaging";
import { ContactsSidebar } from "./contacts-sidebar";
import { MessageArea } from "./message-area";

const MockContacts: Contact[] = [
  {
    id: "1",
    name: "Mohh Jumah",
    lastMessage: "Are you also going to haustin?",
    timestamp: "1:09pm",
    unreadCount: 2,
    role: "contributor",
  },
  {
    id: "2",
    name: "Eddy",
    lastMessage: "This is lit 🔥",
    timestamp: "1:32pm",
    role: "contributor",
  },
  {
    id: "3",
    name: "Sarah",
    timestamp: "12:45pm",
    role: "organization",
  },
];

const MockMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi, I'm done with the hero section design, you can check for possible corrections",
    sender: {
      id: "current_user",
      name: "Muhammad Jamiu",
      role: "Admin",
    },
    timestamp: "1:32 PM",
    isOwn: true,
  },
  {
    id: "2",
    content: "Nice one! This is lit 🔥",
    sender: {
      id: "2",
      name: "Eddy",
      role: "Designer",
    },
    timestamp: "1:33 PM",
  },
];

const MessagingInterface: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contacts] = useState<Contact[]>(MockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(
    MockContacts[0]
  );
  const [messages, setMessages] = useState<Message[]>(MockMessages);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: `${Date.now()}`,
        content: messageInput,
        sender: {
          id: "current_user",
          name: "Muhammad Jamiu",
          role: "Admin",
        },
        timestamp: new Date().toLocaleTimeString(),
        isOwn: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-[850px] bg-white p-4">
      <div className="flex w-full border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white border-r transition-all duration-300
            ${isSidebarOpen ? "w-96" : "w-20"}
            flex flex-col`}
        >
          {/* Sidebar Toggle */}
          <div className="flex items-center p-4 border-b">
            {isSidebarOpen && (
              <h2 className="text-xl font-semibold flex-1">Chats</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>

          <ContactsSidebar
            contacts={contacts}
            searchTerm={searchTerm}
            selectedContactId={selectedContact?.id}
            onSearchChange={setSearchTerm}
            onSelectContact={setSelectedContact}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          {/* Message Header */}
          {selectedContact && (
            <div className="p-4 border-b flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-sm text-green-500">Active now</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <MessageArea messages={messages} selectedContact={selectedContact} />

          {/* Message Input */}
          <div className="p-4 shadow-2xl border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Send message"
                  className="w-full pr-20 rounded-full"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-6 w-6 text-[#828282] rounded-lg" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-6 w-6 text-[#828282] rounded-lg" />
                  </Button>
                </div>
              </div>
              <Button
                variant="default"
                              onClick={handleSendMessage}
                              className="bg-blue-500 rounded-full"
                disabled={!messageInput.trim()}
              >
                <Send className="mr-2" size={18} /> Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
