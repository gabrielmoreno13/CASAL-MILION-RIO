'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Send, User, Sparkles, Bot, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase';


interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AdvisorPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Olá! Sou o Mestre de Finanças do Casal Milionário. Analisei seu perfil e estou pronto para ajudar. O que você gostaria de saber hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [userContext, setUserContext] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch User Context
    useEffect(() => {
        async function fetchContext() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch profile/stats
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                // Simple context construction
                setUserContext({
                    name: profile?.full_name?.split(' ')[0] || 'Investidor',
                    level: 'Nível 1 (Aprendiz)', // Fetch from gamification context ideally
                    income: profile?.income || 0
                });
            }
        }
        fetchContext();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    context: userContext
                })
            });

            const data = await response.json();

            if (data.role) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive um problema ao pensar na resposta. Tente novamente." }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Erro de conexão. Verifique sua internet." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in h-screen flex flex-col bg-[#0A0A0A] pb-20 md:pb-0">
            <Header title="Consultor IA" action={null} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 container mx-auto max-w-4xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Tip Card */}
                <div className="bg-[#0F1115]/50 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-4 mb-6 backdrop-blur-sm">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm mb-1">Dica do dia</h4>
                        <p className="text-gray-400 text-sm">
                            Lembre-se: O juro composto é a oitava maravilha do mundo. Comece cedo e deixe o tempo trabalhar por você!
                        </p>
                    </div>
                </div>

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-emerald-400'
                                }`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed border ${msg.role === 'user'
                                ? 'bg-emerald-500 text-black font-medium rounded-br-none border-emerald-500'
                                : 'bg-[#0F1115] text-gray-200 border-white/10 rounded-bl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="flex items-center gap-2 bg-[#0F1115] px-4 py-3 rounded-2xl border border-white/10 ml-11">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#0A0A0A] border-t border-white/5 p-4 z-10">
                <div className="container mx-auto max-w-4xl relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte sobre investimentos, dívidas ou metas..."
                        className="w-full bg-[#0F1115] text-white placeholder-gray-500 rounded-2xl py-4 pl-6 pr-14 border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
