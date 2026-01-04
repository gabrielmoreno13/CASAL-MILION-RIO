'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet } from 'lucide-react';
import styles from './DailySpendWidget.module.css';

export function DailySpendWidget({ onClick }: { onClick?: () => void }) {
    // Mock calculation logic for now. 
    // In real app: Income - Fixed Expenses - Investment Goal / Days in month
    const safeToSpend = 145.50;

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.decoration} />
            <div className={styles.decoration2} />

            <div className={styles.content}>
                <div className={styles.label}>Pode gastar hoje (Livre)</div>
                <div className={styles.amount}>
                    <Wallet size={32} />
                    {formatCurrency(safeToSpend)}
                </div>
                <div className={styles.subtext}>
                    Já descontados seus investimentos e contas fixas!
                </div>
            </div>
        </div>
    );
}
