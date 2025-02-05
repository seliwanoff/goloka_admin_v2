import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Contact } from "@/types/messaging";

interface MessageHeaderProps {
  contact?: Contact;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  contact,
  isSidebarOpen,
  onOpenSidebar,
}) => {
  if (!contact) return null;

  return (
    <div className="p-4 border-b flex items-center">
      {isSidebarOpen ? (
        <div className="flex items-center">
          <Avatar className="mr-3">
            {contact.avatar && <AvatarImage src={contact.avatar} />}
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{contact.name}</span>
            <p className="text-sm text-green-500">Active now</p>
          </div>
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
          <Menu className="h-7 w-7" />
        </Button>
      )}
    </div>
  );
};
