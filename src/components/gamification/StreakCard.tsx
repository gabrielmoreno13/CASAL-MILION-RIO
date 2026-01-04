'use client';

import { useGamification } from '@/contexts/GamificationContext';
import { Flame, Trophy, AlertTriangle } from 'lucide-react';
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

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Flame size={24} fill={isWarning ? "#F59E0B" : "#EF4444"} strokeWidth={0} />
                </div>
                <h3 className={styles.title}>Streak Atual</h3>
            </div>

            <div className={styles.content}>
                <span className={styles.days}>{currentStreak}</span>
                <span className={styles.label}>dias</span>
            </div>

            <div className={styles.footer}>
                <div className={styles.record}>
                    <Trophy size={12} />
                    Recorde: {longestStreak} dias
                </div>
                {isWarning && (
                    <div className={styles.warning}>
                        <AlertTriangle size={12} />
                        Invista hoje para manter!
                    </div>
                )}
                {!isWarning && (
                    <div>Continue investindo!</div>
                )}
            </div>
        </div>
    );
}
