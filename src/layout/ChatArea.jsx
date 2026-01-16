import React, { useRef, useEffect } from "react";
import { User, Cpu, Package } from "lucide-react";

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-start pt-12 text-center">
      <Package size={32} className="text-gray-500 opacity-50 mb-4" />
      <p className="text-lg text-gray-400 mb-2">Select or add a product</p>
      <p className="text-sm text-gray-500">Choose a product from the sidebar or add a new one</p>
    </div>
  );
}

// Single Chat Message Component
function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-2 p-4 shadow-sm border rounded ${
        isUser ? "bg-gray-300 border-gray-400" : "bg-white border-gray-400"
      }`}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-600 rounded-full">
        {isUser ? (
          <User size={12} className="text-white" />
        ) : (
          <Cpu size={12} className="text-white" />
        )}
      </div>
      <span className="text-gray-700 whitespace-pre-wrap break-words">
        {message.content}
      </span>
    </div>
  );
}

// Chat Input Component
function ChatInput({ onSendMessage, currentProductId }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSendMessage(e.target.value, currentProductId);
      e.target.value = "";
    }
  };

  return (
    <div className="pt-4">
      <input
        type="text"
        placeholder="Type your question… (press Enter to send)"
        className="w-full px-4 py-3 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

// Main Chat Area Component
export default function ChatArea({ currentProductId, messages, onSendMessage }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto bg-gray-900 p-6 flex flex-col h-full">
      <div className="flex-1 mb-6 space-y-4 overflow-y-auto overflow-x-hidden">
        {currentProductId ? (
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
        ) : (
          <EmptyState />
        )}
        <div ref={chatEndRef} />
      </div>

      {currentProductId && (
        <ChatInput onSendMessage={onSendMessage} currentProductId={currentProductId} />
      )}
    </main>
  );
}
