import React, { useState, useEffect, useRef } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { useSocketStore } from '../../store/useSocketStore';
import { Button } from '../ui/Button';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RoomChat = ({ className }) => {
  const [inputText, setInputText] = useState('');
  const messages = useRoomStore((state) => state.messages);
  const socket = useSocketStore((state) => state.socket);
  const messagesEndRef = useRef(null);

  const selfSocketId = socket?.id;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || !socket) return;

    socket.emit('send-chat-message', { message: text });
    setInputText('');
  };

  return (
    <div className={cn("border-3 border-main bg-card flex flex-col h-[360px] shadow-flat-sm", className)}>
      {/* Header */}
      <div className="bg-main text-white px-3 py-2.5 flex items-center justify-between border-b-3 border-main select-none">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent-light flex-shrink-0" />
          <span className="font-extrabold text-xs tracking-wider uppercase">Room Chat</span>
        </div>
        <span className="text-[10px] font-bold bg-white text-main px-1.5 py-0.5 rounded-none font-mono">
          {messages.length} msgs
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-neutral-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted py-6">
            <MessageSquare className="h-6 w-6 mb-1 opacity-40" />
            <p className="text-xs font-semibold text-center">No messages yet.</p>
            <p className="text-[10px] text-muted text-center">Say hi to everyone in the room!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === selfSocketId;
            const isSystem = msg.isSystem || msg.senderId === 'system';

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="flex items-center justify-center my-1"
                >
                  <div className="bg-neutral-200 border border-neutral-400 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-none flex items-center gap-1.5 max-w-[90%] text-center">
                    <Bot className="h-3 w-3 text-primary flex-shrink-0" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={cn("flex flex-col max-w-[85%]", {
                  "self-end items-end": isSelf,
                  "self-start items-start": !isSelf,
                })}
              >
                <div className="flex items-center gap-1.5 mb-0.5 px-0.5">
                  <span className={cn("text-[10px] font-black uppercase tracking-wide", {
                    "text-primary": isSelf,
                    "text-main": !isSelf
                  })}>
                    {isSelf ? "You" : msg.senderName}
                  </span>
                  {msg.timestamp && (
                    <span className="text-[9px] text-muted font-mono">{msg.timestamp}</span>
                  )}
                </div>
                <div
                  className={cn("px-3 py-2 text-xs font-semibold border-2 border-main break-words select-text", {
                    "bg-primary text-white shadow-[2px_2px_0px_#111111]": isSelf,
                    "bg-white text-main shadow-[2px_2px_0px_#111111]": !isSelf,
                  })}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="p-2 border-t-3 border-main bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
          className="flex-1 border-2 border-main px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary rounded-none"
        />
        <Button
          type="submit"
          variant="default"
          className="h-8 px-3 py-0 flex items-center justify-center gap-1 text-xs"
          disabled={!inputText.trim()}
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default RoomChat;
