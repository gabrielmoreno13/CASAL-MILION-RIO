'use client';

import { useState } from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { Flame, Trophy, AlertTriangle } from 'lucide-react';
import { StreakDetailsModal } from './StreakDetailsModal';
import styles from './StreakCard.module.css';

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
                className={`${styles.card} cursor-pointer hover:transform hover:scale-105 transition-transform duration-200`}
                onClick={() => setShowModal(true)}
            >
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Flame size={24} fill={isWarning ? "#F59E0B" : "#EF4444"} strokeWidth={0} />
                    </div>
                    <h3 className={styles.title}>Streak Atual</h3>
                </div>

                <div className={styles.content}>
                    <span className={styles.days}>{currentStreak}</span>
                    <span className={styles.label}>meses</span> {/* Changed from 'dias' assuming monthly investment context */}
                </div>

                <div className={styles.footer}>
                    <div className={styles.record}>
                        <Trophy size={12} />
                        Recorde: {longestStreak}
                    </div>
                    {isWarning && (
                        <div className={styles.warning}>
                            <AlertTriangle size={12} />
                            Invista esse mês!
                        </div>
                    )}
                    {!isWarning && (
                        <div>Mantendo o ritmo! 🔥</div>
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
