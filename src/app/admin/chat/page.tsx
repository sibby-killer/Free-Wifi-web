"use client";

import { useEffect, useState, useRef } from "react";
import { AIChatIcon, ToolIcon } from "@/components/ui/Icons";

interface ChatUser {
    userId: string;
    fullName: string;
    phone: string;
    lastMessage: string;
    lastMessageDate: string;
    unreadCount: number;
}

interface Message {
    id: string;
    role: string;
    content: string;
    createdAt: string;
}

export default function AdminChatPage() {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUsers();
        // Poll for new messages/users
        const interval = setInterval(fetchUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
            // Poll current chat
            const interval = setInterval(() => fetchMessages(selectedUserId), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/chat?list=true");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.chats || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/chat?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                // Also refresh list to clear unread count locally if needed
                // but fetchUsers poll does that.
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedUserId) return;

        const msg = input.trim();
        setInput("");

        // Optimistic
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "admin",
            content: msg,
            createdAt: new Date().toISOString()
        }]);

        try {
            await fetch("/api/admin/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUserId, message: msg }),
            });
            fetchMessages(selectedUserId); // Refresh to get DB ID/Time
        } catch (err) {
            alert("Failed to send");
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sidebar: Users List */}
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-gray-800">Support Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-4 text-gray-500">No chats yet.</div>
                    ) : (
                        users.map(user => (
                            <button
                                key={user.userId}
                                onClick={() => setSelectedUserId(user.userId)}
                                className={`w-full text-left p-4 hover:bg-white transition-colors border-b border-gray-100 ${selectedUserId === user.userId ? "bg-white border-l-4 border-l-[#0066FF]" : ""
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-gray-900 truncate">{user.fullName}</div>
                                    {user.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {user.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">{user.phone}</div>
                                <div className="text-sm text-gray-600 truncate opacity-80">
                                    {user.lastMessage}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 text-right">
                                    {new Date(user.lastMessageDate).toLocaleDateString()} {new Date(user.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUserId ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">
                                {users.find(u => u.userId === selectedUserId)?.fullName || "User"}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F7FA]">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === "admin" || msg.role === "assistant" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.role === "admin"
                                            ? "bg-[#0066FF] text-white"
                                            : msg.role === "assistant"
                                                ? "bg-blue-400 text-white"
                                                : "bg-white text-gray-800 border border-gray-100"
                                        }`}>
                                        <div className="text-xs opacity-70 mb-1 font-bold">
                                            {msg.role === "admin" ? "You" : msg.role === "assistant" ? "AI" : "User"}
                                        </div>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        <div className="text-[10px] opacity-60 mt-2 text-right">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type a reply..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#0066FF]"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="bg-[#0066FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#0052CC] disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
                        <AIChatIcon size={64} className="opacity-20" />
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
