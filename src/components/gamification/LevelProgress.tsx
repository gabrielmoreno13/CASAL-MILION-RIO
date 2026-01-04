'use client';

import { useGamification, LEVELS } from '@/contexts/GamificationContext';
import { Award, Zap, Bell, Info } from 'lucide-react';
import React from 'react';
import { LevelDetailsModal } from './LevelDetailsModal';


export function LevelProgress() {
    const { level, currentXP, totalXP } = useGamification();

    const currentLevelData = LEVELS.find(l => l.level === level) || LEVELS[0];
    const nextLevelData = LEVELS.find(l => l.level === level + 1);

    // Calculate progress relative to current level range
    // If no next level, we are maxed out (100%)
    let progressPercent = 100;
    let nextLevelName = "Nível Máximo";
    let requiredXP = currentXP; // Default to showing current
    let missingXP = 0;

    if (nextLevelData) {
        // Simple progress logic based on TOTAL XP:
        // Range = NextLevel.requiredXP - CurrentLevel.requiredXP (or 0 if level 1)
        // Progress = (TotalXP - CurrentLevel.requiredXP) / Range

        // Wait, prompt says: "2.847 / 5.000 XP"
        // And "Faltam 2.153 XP para Level 4".
        // This implies TotalXP is the metric.

        const currentLevelBaseXP = currentLevelData.xpRequired;
        const nextLevelTargetXP = nextLevelData.xpRequired;
        const range = nextLevelTargetXP - currentLevelBaseXP;
        const currentProgressInLevel = totalXP - currentLevelBaseXP;

        progressPercent = Math.min(100, Math.max(0, (currentProgressInLevel / range) * 100));
        nextLevelName = nextLevelData.name;
        requiredXP = nextLevelTargetXP;
        missingXP = nextLevelTargetXP - totalXP;
    }

    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <>
            <div
                className="w-full bg-[#0F1115] border border-white/5 rounded-3xl p-6 cursor-pointer hover:bg-white/5 transition-all duration-300 group"
                onClick={() => setShowDetails(true)}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Seu Nível</span>
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-500/20">
                                Level {level}
                            </span>
                            <span className="text-white font-bold text-lg">{currentLevelData.name}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Benefícios do Nível">
                            <Award size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                        <Zap size={14} className="text-amber-500" fill="currentColor" />
                        <span className="text-white font-bold">{totalXP.toLocaleString()}</span>
                        <span>/ {requiredXP.toLocaleString()} XP</span>
                    </span>
                    {nextLevelData && (
                        <span className="text-gray-500 text-xs">
                            Faltam <span className="text-emerald-400 font-medium">{missingXP.toLocaleString()} XP</span> para {nextLevelName}
                        </span>
                    )}
                    {!nextLevelData && (
                        <span className="text-emerald-400 font-medium text-xs">Nível Máximo Atingido! 🚀</span>
                    )}
                </div>
            </div>

            {showDetails && (
                <LevelDetailsModal
                    currentLevel={level}
                    currentXP={totalXP}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
}
