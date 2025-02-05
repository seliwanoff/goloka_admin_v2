import React from "react";
import { Message, Contact } from "@/types/messaging";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyChatState } from "./empty-chat-state";

interface MessageAreaProps {
  messages: Message[];
  selectedContact?: Contact;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  selectedContact,
}) => {
  if (!selectedContact) {
    return <EmptyChatState />;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[70%] p-3 rounded-lg
                  ${
                    message.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }
                `}
              >
                {message.content}
                {message.attachments &&
                  message.attachments.map((attachment) => (
                    <div key={attachment} className="mt-2">
                      <img
                        src={attachment}
                        alt="Attachment"
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
