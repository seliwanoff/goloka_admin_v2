import React from "react";
import { MessageCircleOff } from "lucide-react";

interface EmptyChatStateProps {
  onStartNewChat?: () => void;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  onStartNewChat,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MessageCircleOff className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        No Conversations Yet
      </h2>
      <p className="text-gray-500 mb-6">
        Start a new conversation or select an existing contact
      </p>
      {onStartNewChat && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={onStartNewChat}
        >
          Start New Chat
        </button>
      )}
    </div>
  );
};
