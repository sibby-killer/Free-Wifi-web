"use client";

import { useEffect, useState, useRef } from "react";
import { AIChatIcon, AlertIcon } from "@/components/ui/Icons";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  mentionAdmin: boolean;
}

export function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChatHistory();
    markAsRead();
  }, []);

  const markAsRead = async () => {
    try {
      await fetch("/api/chat/unread", { method: "POST" });
    } catch (err) {
      console.error("Failed to mark chat as read");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Keep focus on input
    inputRef.current?.focus();

    // Add user message optimistically
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
      mentionAdmin: userMessage.toLowerCase().includes("@admin"),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // If response is not JSON (e.g. HTML error page), handle gracefully
        console.error("Failed to parse response:", parseError);
        throw new Error("Server response was not valid JSON");
      }

      if (res.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          createdAt: new Date().toISOString(),
          mentionAdmin: false,
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (data.mentionAdmin) {
          // Show notification that admin was mentioned
          const notificationMsg: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "Your message has been flagged for human support. An admin will contact you soon via email or WhatsApp.",
            createdAt: new Date().toISOString(),
            mentionAdmin: false,
          };
          setTimeout(() => {
            setMessages((prev) => [...prev, notificationMsg]);
          }, 500);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.error || "Sorry, I encountered an error. Please try again.",
          createdAt: new Date().toISOString(),
          mentionAdmin: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date().toISOString(),
        mentionAdmin: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Ensure focus is kept after loading finishes
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <AIChatIcon size={32} />
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">AI Chat</h1>
          <p className="text-[#6B7280]">Get instant help from our AI assistant</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-md">
        {/* Chat Area */}
        <div className="h-[500px] space-y-4 overflow-y-auto p-6">
          {initialLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#6B7280]">Loading chat...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-sm font-semibold text-white">
                AI
              </div>
              <div className="max-w-[80%] rounded-2xl bg-gray-100 p-4">
                <p className="text-[#1A1A2E]">
                  Hello! I&apos;m your FreeWiFi KE assistant. How can I help you today?
                  <br />
                  <br />
                  <strong>Tip:</strong> Type <code className="rounded bg-gray-200 px-1">@admin</code> in your message to get human support!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${message.role === "user"
                    ? "bg-[#00CC88] text-white"
                    : message.role === "admin"
                      ? "bg-[#FF6600] text-white" // Different color for Admin
                      : "bg-[#0066FF] text-white"
                    }`}
                >
                  {message.role === "user" ? "U" : message.role === "admin" ? "AD" : "AI"}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${message.role === "user"
                    ? "bg-[#0066FF] text-white"
                    : "bg-gray-100 text-[#1A1A2E]"
                    }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.mentionAdmin && message.role === "user" && (
                    <p className="mt-2 flex items-center gap-1 text-xs opacity-80">
                      <AlertIcon size={12} /> Admin notification sent
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-sm font-semibold text-white">
                AI
              </div>
              <div className="max-w-[80%] rounded-2xl bg-gray-100 p-4">
                <p className="text-[#1A1A2E]">Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (use @admin for human support)"
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="rounded-full bg-[#0066FF] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0052CC] disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
