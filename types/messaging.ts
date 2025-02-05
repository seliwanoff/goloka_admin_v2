export interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  avatar?: string;
//   role: "contributor";
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  isOwn?: boolean;
  attachments?: string[];
}
