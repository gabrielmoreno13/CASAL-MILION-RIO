'use client';

import { useState } from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { Flame, Trophy, AlertTriangle } from 'lucide-react';
import { StreakDetailsModal } from './StreakDetailsModal';


export function StreakCard() {
    const { currentStreak, longestStreak, lastInvestmentDate } = useGamification();

    // Logic to check if streak is in danger (e.g., > 24h since last)
    // For visual warning. 
    // We can assume if it's been > 24h but < 48h, it's warning time.

    let isWarning = false;
    if (lastInvestmentDate) {
        const last = new Date(lastInvestmentDate);
        const now = new Date();
        const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
        isWarning = diffHours > 24 && diffHours < 48;
    }

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div
                className="bg-[#0F1115] border border-white/5 p-6 rounded-3xl hover:bg-white/5 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
                onClick={() => setShowModal(true)}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-amber-500 transition-colors">
                        <Flame size={20} className={isWarning ? 'text-amber-500' : 'text-red-500'} fill={isWarning ? "#F59E0B" : "#EF4444"} />
                        <span className="text-sm font-medium">Streak Atual</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">{currentStreak}</span>
                        <span className="text-sm text-gray-500 font-medium uppercase">Mês{currentStreak !== 1 ? 'es' : ''}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <Trophy size={12} />
                        Recorde: {longestStreak}
                    </div>

                    {isWarning ? (
                        <div className="text-amber-500 flex items-center gap-1 animate-pulse">
                            <AlertTriangle size={12} />
                            Invista!
                        </div>
                    ) : (
                        <div className="text-gray-500">Mantendo o ritmo! 🔥</div>
                    )}
                </div>
            </div>

            {showModal && (
                <StreakDetailsModal
                    currentStreak={currentStreak}
                    longestStreak={longestStreak}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
