'use client';

import React, { useState } from 'react';
import { Plus, X, Target, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function FabMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const router = useRouter();

    const handleAction = (action: string) => {
        setIsOpen(false);
        if (action === 'GOAL') {
            router.push('/dashboard/goals?action=new');
        } else if (action === 'INCOME') {
            router.push('/dashboard/wallet?action=new_income');
        } else if (action === 'EXPENSE') {
            router.push('/dashboard/wallet?action=new_expense');
        } else if (action === 'ADVISOR') {
            router.push('/dashboard/advisor');
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="flex flex-col items-end gap-4 mb-4 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
                    <button
                        className="flex items-center gap-3 py-3 px-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all"
                        onClick={() => handleAction('ADVISOR')}
                    >
                        <span>Consultor IA</span>
                        <Bot size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="bg-black/80 backdrop-blur text-white text-xs font-bold py-1 px-3 rounded-lg border border-white/10 shadow-lg">
                            Nova Meta
                        </span>
                        <button
                            className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleAction('GOAL')}
                        >
                            <Target size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="bg-black/80 backdrop-blur text-white text-xs font-bold py-1 px-3 rounded-lg border border-white/10 shadow-lg">
                            Receita
                        </span>
                        <button
                            className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleAction('INCOME')}
                        >
                            <TrendingUp size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="bg-black/80 backdrop-blur text-white text-xs font-bold py-1 px-3 rounded-lg border border-white/10 shadow-lg">
                            Despesa
                        </span>
                        <button
                            className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-black shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleAction('EXPENSE')}
                        >
                            <TrendingDown size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`
                    pointer-events-auto
                    w-16 h-16 rounded-full flex items-center justify-center text-black shadow-2xl transition-all duration-300
                    ${isOpen ? 'bg-white rotate-45' : 'bg-emerald-500 hover:scale-110 hover:shadow-emerald-500/40'}
                `}
                onClick={toggleOpen}
            >
                <Plus size={32} />
            </button>
        </div>
    );
}
