'use client';

import { useState } from 'react';
import { useGamification, ACHIEVEMENTS_LIST, Achievement } from '@/contexts/GamificationContext';
import { Lock, Trophy } from 'lucide-react';
import styles from './Achievements.module.css';

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
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}><Trophy size={18} /> Conquistas Recentes</h3>
                    <button className={styles.viewAll}>Ver Todas</button>
                </div>

                <div className={styles.grid}>
                    {visibleBadges.map(ach => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`${styles.badgeCard} ${isUnlocked ? styles.unlocked : ''}`}
                                onClick={() => handleBadgeClick(ach)}
                            >
                                <div className={styles.iconWrapper}>
                                    {ach.icon}
                                    {!isUnlocked && (
                                        <div className={styles.lockIcon}>
                                            <Lock size={12} />
                                        </div>
                                    )}
                                </div>
                                <span className={styles.badgeName}>{ach.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedAchievement && (
                <div className={styles.modalOverlay} onClick={() => setSelectedAchievement(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            {selectedAchievement.icon}
                        </div>
                        <h2 className={styles.modalTitle}>{selectedAchievement.name}</h2>
                        <p className={styles.modalDesc}>{selectedAchievement.description}</p>

                        <div className={styles.modalReward}>
                            +{selectedAchievement.xpReward} XP
                        </div>

                        <div>
                            <button className={styles.closeButton} onClick={() => setSelectedAchievement(null)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
