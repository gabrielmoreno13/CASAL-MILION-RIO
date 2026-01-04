'use client';

import { useGamification, LEVELS } from '@/contexts/GamificationContext';
import { Award, Zap, Bell, Info } from 'lucide-react';
import React from 'react';
import { LevelDetailsModal } from './LevelDetailsModal';
import styles from './LevelProgress.module.css';

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
            <div className={styles.container} onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
                <div className={styles.header}>
                    <div className={styles.levelInfo}>
                        <span className={styles.levelBadge}>Level {level}</span>
                        <span className={styles.levelName}>{currentLevelData.name}</span>
                    </div>
                    <div className={styles.levelBenefits}>
                        <button className={styles.iconButton} title="Benefícios do Nível">
                            <Award size={16} />
                        </button>
                        <button className={styles.iconButton} title="Notificações">
                            <Bell size={16} />
                        </button>
                    </div>
                </div>

                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className={styles.progressText}>
                    <span>
                        <Zap size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle', color: '#F59E0B' }} />
                        <span className={styles.highlight}>{totalXP.toLocaleString()}</span> / {requiredXP.toLocaleString()} XP
                    </span>
                    {nextLevelData && (
                        <span>
                            Faltam <span className={styles.highlight}>{missingXP.toLocaleString()} XP</span> para {nextLevelName}
                        </span>
                    )}
                    {!nextLevelData && (
                        <span>Você atingiu o nível máximo! 🚀</span>
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
