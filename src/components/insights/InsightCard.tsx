'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import styles from './InsightCard.module.css';

interface InsightCardProps {
    type?: 'saving' | 'investment' | 'alert';
    message?: string;
}

export function InsightCard({
    type = 'saving',
    message = "Vocês gastaram 15% menos em Ifood essa semana comparado à semana passada. Parabéns! Que tal investir essa diferença?"
}: InsightCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Sparkles size={20} fill="white" />
                    Insight da Semana
                </div>
                <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
                    <X size={14} />
                </button>
            </div>

            <div className={styles.content}>
                <p className={styles.message}>
                    {message}
                </p>
                <button className={styles.actionBtn}>
                    Investir Agora <ArrowRight size={14} style={{ display: 'inline', marginLeft: 4 }} />
                </button>
            </div>

            <div className={styles.sparkles}>
                <Sparkles size={120} />
            </div>
        </div>
    );
}
