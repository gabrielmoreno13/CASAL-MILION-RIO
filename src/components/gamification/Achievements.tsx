'use client';

import { useState } from 'react';
import { useGamification, ACHIEVEMENTS_LIST, Achievement } from '@/contexts/GamificationContext';
import { Lock, Trophy } from 'lucide-react';


export function AchievementsGrid() {
    const { unlockedAchievements } = useGamification();
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Show first 6 or all? Prompt says grid horizontal, "5-6 visible".
    // Let's list a subset for the widget, "Ver Todas" would open a bigger modal/page.
    // For simplicity, let's just show top 6 prioritized by: Unlocked first, then Locked.
    // Or just order by ID/Difficulty.

    // Sort: Unlocked first
    const sortedBadges = [...ACHIEVEMENTS_LIST].sort((a, b) => {
        const aUnlocked = unlockedAchievements.includes(a.id);
        const bUnlocked = unlockedAchievements.includes(b.id);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    const visibleBadges = sortedBadges.slice(0, 6);

    const handleBadgeClick = (ach: Achievement) => {
        // Only show details if unlocked? Or show requirement if locked?
        // Prompt says: "Badges bloqueados: grayscale + cadeado. Click abre modal com detalhes"
        setSelectedAchievement(ach);
    };

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy size={18} className="text-emerald-500" />
                        Conquistas Recentes
                    </h3>
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Ver Todas</button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {visibleBadges.map(ach => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`
                                    relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer group
                                    ${isUnlocked
                                        ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 grayscale'}
                                `}
                                onClick={() => handleBadgeClick(ach)}
                            >
                                <div className={`mb-2 text-2xl filter drop-shadow-lg ${!isUnlocked && 'opacity-50'}`}>
                                    {ach.icon}
                                    {!isUnlocked && (
                                        <div className="absolute top-2 right-2 text-gray-400">
                                            <Lock size={12} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-center text-gray-300 group-hover:text-white transition-colors">{ach.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedAchievement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedAchievement(null)}>
                    <div className="bg-[#12141A] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl scale-100 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col items-center text-center">
                            <div className="text-6xl mb-4 p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                {selectedAchievement.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedAchievement.name}</h2>
                            <p className="text-gray-400 mb-6">{selectedAchievement.description}</p>

                            <div className="bg-emerald-500 text-black font-bold px-4 py-2 rounded-xl mb-6 shadow-lg shadow-emerald-500/20">
                                +{selectedAchievement.xpReward} XP
                            </div>

                            <button
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5"
                                onClick={() => setSelectedAchievement(null)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
