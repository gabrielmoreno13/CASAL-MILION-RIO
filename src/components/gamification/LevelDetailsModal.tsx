'use client';

import React from 'react';
import { X, Trophy, Star, Lock } from 'lucide-react';
import styles from './LevelDetailsModal.module.css';
import { LEVELS } from '@/contexts/GamificationContext';

interface Props {
    currentLevel: number;
    currentXP: number;
    onClose: () => void;
}

export function LevelDetailsModal({ currentLevel, currentXP, onClose }: Props) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Sua Jornada</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.currentLevelSection}>
                    <div className={styles.levelLabel}>Nível Atual</div>
                    <div className={styles.levelValue}>
                        {LEVELS.find(l => l.level === currentLevel)?.name || `Nível ${currentLevel}`}
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>XP Total</div>
                            <div className={styles.statValue}>{currentXP} XP</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>Próximo Nível</div>
                            <div className={styles.statValue}>
                                {LEVELS.find(l => l.level === currentLevel + 1)?.xpRequired || 'Max'} XP
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Todos os Níveis</h3>
                <div className={styles.levelsList}>
                    {LEVELS.map((lvl) => {
                        const isUnlocked = currentLevel >= lvl.level;
                        const isCurrent = currentLevel === lvl.level;

                        return (
                            <div
                                key={lvl.level}
                                className={`${styles.levelItem} ${isCurrent ? styles.active : ''} ${!isUnlocked ? styles.locked : ''}`}
                            >
                                <div className={styles.levelNumber}>
                                    {isUnlocked ? lvl.level : <Lock size={14} />}
                                </div>
                                <div className={styles.levelInfo}>
                                    <h4>{lvl.name}</h4>
                                    <p>Requer {lvl.xpRequired.toLocaleString()} XP ou Investimento</p>
                                </div>
                                {isCurrent && (
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Star size={20} fill="#F59E0B" color="#F59E0B" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
