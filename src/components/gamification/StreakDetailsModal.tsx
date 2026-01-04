'use client';

import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import styles from './StreakDetailsModal.module.css';

interface Props {
    currentStreak: number;
    longestStreak: number;
    onClose: () => void;
}

export function StreakDetailsModal({ currentStreak, longestStreak, onClose }: Props) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.iconWrapper}>
                    <Flame size={40} color="#F59E0B" fill="#F59E0B" />
                </div>

                <h2 className={styles.title}>Sequência de Investimentos</h2>
                <p className={styles.subtitle}>Mantenha o fogo aceso investindo mensalmente!</p>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{currentStreak}</span>
                        <span className={styles.statLabel}>Atual</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{longestStreak}</span>
                        <span className={styles.statLabel}>Recorde</span>
                    </div>
                </div>

                <div className={styles.tipsSection}>
                    <h4><Trophy size={16} color="#10B981" /> Como aumentar?</h4>
                    <p>Faça pelo menos um aporte no "Pote do Casal" ou registre um investimento todo mês para manter sua sequência.</p>
                </div>

                <div className={styles.tipsSection}>
                    <h4><Calendar size={16} color="#3B82F6" /> Próximo Marco</h4>
                    <p>Chegue a 12 meses consecutivos para desbloquear a conquista "Ano de Ouro" e ganhar 5.000 XP extras!</p>
                </div>

                <button className={styles.closeBtn} onClick={onClose}>
                    Continuar Focado 🚀
                </button>
            </div>
        </div>
    );
}
