'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';


interface InsightCardProps {
    type?: 'saving' | 'investment' | 'alert';
    message?: string;
}

export function InsightCard({
    type = 'saving',
    message = "Vocês gastaram 15% menos em Ifood essa semana comparado à semana passada. Parabéns! Que tal investir essa diferença?"
}: InsightCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/40 to-black border border-emerald-500/20 rounded-3xl p-6 group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 text-emerald-500/5 rotate-12 pointer-events-none">
                <Sparkles size={150} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles size={12} fill="currentColor" />
                        Insight da Semana
                    </div>
                    <button
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        onClick={() => setIsVisible(false)}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <p className="text-lg md:text-xl text-white font-medium leading-relaxed max-w-3xl">
                        {message}
                    </p>
                    <button className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group-hover:scale-105 active:scale-95">
                        Investir Agora <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
