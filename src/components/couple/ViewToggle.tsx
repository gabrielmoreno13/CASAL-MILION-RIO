'use client';

import { useCouple } from '@/contexts/CoupleContext';
import { RefreshCw } from 'lucide-react';
import styles from './ViewToggle.module.css';

export function ViewToggle() {
    const { viewMode, toggleViewMode, refreshCoupleData } = useCouple();

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.container} onClick={toggleViewMode}>
                {/* 
                  Simple implementation: Two labels. 
                  Slider logic assumes equal width. 
                  Better: translate based on ref, but for MVP keep simple CSS 
                */}
                <div
                    className={`${styles.slider} ${viewMode === 'couple' ? styles.sliderRight : ''}`}
                    style={{ width: 'calc(50% - 4px)' }}
                />

                <div className={`${styles.option} ${viewMode === 'individual' ? styles.optionActive : ''}`}>
                    Individual
                </div>
                <div className={`${styles.option} ${viewMode === 'couple' ? styles.optionActive : ''}`}>
                    Casal
                </div>
            </div>

            <RefreshCw
                size={16}
                className={styles.refreshIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    refreshCoupleData();
                }}
            />
        </div>
    );
}
