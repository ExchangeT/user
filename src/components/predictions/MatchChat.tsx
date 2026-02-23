'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRealtime } from '@/hooks/useRealtime';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import Image from 'next/image';

interface Message {
    id: string;
    userId: string;
    userName: string;
    userImage?: string;
    message: string;
    timestamp: string;
}

export function MatchChat({ matchId }: { matchId: string }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Subscribe to match chat
    useRealtime(`chat-${matchId}`, 'new-message', (data: Message) => {
        setMessages((prev) => [...prev.slice(-49), data]);
    });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !session || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/matches/${matchId}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue.trim() }),
            });

            if (res.ok) {
                setInputValue('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Card className="flex flex-col h-full bg-cc-bg-card/40 border-cc-border-subtle backdrop-blur-md overflow-hidden rounded-3xl shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-cc-border-subtle/50 bg-cc-bg-elevated/40 flex items-center gap-3">
                <div className="p-2 bg-gradient-gold rounded-xl shadow-[0_0_15px_rgba(244,196,48,0.3)]">
                    <MessageSquare className="w-5 h-5 text-cc-bg-primary" />
                </div>
                <div>
                    <h4 className="font-extrabold text-white text-sm tracking-tight">Match Chat</h4>
                    <p className="text-[10px] text-cc-text-subtle font-black uppercase tracking-widest">Live Discussion</p>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none px-6">
                            <MessageSquare className="w-12 h-12 mb-4 text-slate-500" />
                            <p className="text-sm font-bold text-slate-400">Join the conversation!</p>
                            <p className="text-[11px] mt-1">Start chatting about this match with other predictors.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                layout
                                className={`flex gap-3 ${(msg.userId === (session?.user as any)?.id) ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-cc-bg-elevated overflow-hidden flex-shrink-0 border border-cc-border-light shadow-md">
                                    {msg.userImage ? (
                                        <Image src={msg.userImage} alt={msg.userName} width={32} height={32} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-cc-text-muted">
                                            {msg.userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${(msg.userId === (session?.user as any)?.id) ? 'items-end' : ''}`}>
                                    <span className="text-[10px] font-bold text-cc-text-muted mb-1 px-1">
                                        {msg.userName}
                                    </span>
                                    <div className={`
                    px-4 py-2.5 rounded-2xl text-sm font-medium
                    ${(msg.userId === (session?.user as any)?.id)
                                            ? 'bg-cc-gold text-cc-bg-primary font-black rounded-tr-none shadow-[0_4px_12px_rgba(244,196,48,0.3)]'
                                            : 'bg-cc-bg-elevated text-white rounded-tl-none border border-cc-border-subtle shadow-sm'
                                        }
                  `}>
                                        {msg.message}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cc-border-subtle/50 bg-cc-bg-card/40 backdrop-blur-sm">
                {session ? (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Talk about the match..."
                            className="bg-cc-bg-elevated border-cc-border-subtle text-sm h-11 rounded-2xl focus:ring-cc-gold/50 shadow-inner text-white placeholder:text-cc-text-muted"
                            disabled={sending}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="bg-gradient-gold hover:opacity-90 rounded-2xl w-11 h-11 flex-shrink-0 shadow-[0_4px_15px_rgba(244,196,48,0.3)] border-0"
                            disabled={!inputValue.trim() || sending}
                        >
                            <Send className="w-4 h-4 text-cc-bg-primary" />
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-xs font-bold text-cc-text-muted">Sign in to participate in chat</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
