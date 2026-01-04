'use client';

import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { X } from 'lucide-react';

interface Props {
    currentStreak: number;
    longestStreak: number;
    onClose: () => void;
}

export function StreakDetailsModal({ currentStreak, longestStreak, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#12141A] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center text-center p-8 animate-in zoom-in-95 duration-200 relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button Absolute */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20 animate-pulse">
                    <Flame size={40} className="fill-amber-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Sequência de Investimentos</h2>
                <p className="text-gray-400 mb-8 leading-relaxed max-w-[250px]">
                    Mantenha o fogo aceso investindo mensalmente!
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4">
                        <div className="text-4xl font-bold text-white mb-1">{currentStreak}</div>
                        <div className="text-amber-500 text-xs font-bold uppercase tracking-wider">Atual</div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4">
                        <div className="text-4xl font-bold text-gray-500 mb-1">{longestStreak}</div>
                        <div className="text-gray-600 text-xs font-bold uppercase tracking-wider">Recorde</div>
                    </div>
                </div>

                <div className="space-y-4 w-full text-left mb-8">
                    <div className="flex gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="text-emerald-500 shrink-0 mt-0.5">
                            <Trophy size={18} />
                        </div>
                        <div>
                            <h4 className="text-emerald-400 font-bold text-sm mb-1">Como aumentar?</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">Faça pelo menos um aporte no "Pote do Casal" ou registre um investimento todo mês.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <div className="text-blue-500 shrink-0 mt-0.5">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <h4 className="text-blue-400 font-bold text-sm mb-1">Próximo Marco</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">Chegue a 12 meses consecutivos para desbloquear a conquista "Ano de Ouro"!</p>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                    onClick={onClose}
                >
                    Continuar Focado 🚀
                </button>
            </div>
        </div>
    );
}
