'use client';

import Link from 'next/link';
import React from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export function InsightCard() {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative group overflow-hidden bg-gradient-to-r from-emerald-900/40 to-[#0F1115] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-emerald-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-medium text-sm uppercase tracking-wider mb-2">
                    <Sparkles size={16} className="animate-pulse" />
                    <span>Dica de Especialista</span>
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight">
                    Potencialize seu Patrimônio
                </h3>
                <p className="text-gray-400 text-sm md:text-base max-w-xl">
                    Baseado nos seus gastos, você poderia ter investido R$ 450,00 a mais este mês.
                    Que tal começar agora com nossa carteira recomendada?
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <Link href="/dashboard/investments">
                    <button className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group-hover:scale-105 active:scale-95">
                        Investir Agora <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </Link>

                <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                    aria-label="Fechar dica"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
