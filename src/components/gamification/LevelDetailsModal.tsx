'use client';

import React from 'react';
import { X, Trophy, Star, Lock } from 'lucide-react';

import { LEVELS } from '@/contexts/GamificationContext';

interface Props {
    currentLevel: number;
    currentXP: number;
    onClose: () => void;
}

export function LevelDetailsModal({ currentLevel, currentXP, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#12141A] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[600px] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" size={24} /> Sua Jornada
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <div className="p-6 bg-gradient-to-b from-emerald-900/10 to-transparent">
                        <div className="text-center mb-6">
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nível Atual</div>
                            <div className="text-3xl font-bold text-white">
                                {LEVELS.find(l => l.level === currentLevel)?.name || `Nível ${currentLevel}`}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 text-center">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">XP Total</div>
                                <div className="text-xl font-bold text-white">{currentXP} XP</div>
                            </div>
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 text-center">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Próximo Nível</div>
                                <div className="text-xl font-bold text-emerald-400">
                                    {LEVELS.find(l => l.level === currentLevel + 1)?.xpRequired || 'Max'} XP
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Star size={16} className="text-emerald-500" /> Todos os Níveis
                        </h3>
                        <div className="space-y-3">
                            {LEVELS.map((lvl) => {
                                const isUnlocked = currentLevel >= lvl.level;
                                const isCurrent = currentLevel === lvl.level;

                                return (
                                    <div
                                        key={lvl.level}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
                                            ${isCurrent
                                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                                : isUnlocked
                                                    ? 'bg-white/5 border-white/10'
                                                    : 'bg-white/[0.02] border-white/5 opacity-50 grayscale'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                                            ${isUnlocked ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-500'}
                                        `}>
                                            {isUnlocked ? lvl.level : <Lock size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>{lvl.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Requer {lvl.xpRequired.toLocaleString()} XP</p>
                                        </div>
                                        {isCurrent && (
                                            <div className="animate-pulse">
                                                <Star size={20} className="text-amber-500 fill-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
