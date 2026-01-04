'use client';

import { useCouple } from '@/contexts/CoupleContext';
import { Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import styles from './ContributionCard.module.css';

export function ContributionCard() {
    const { partner1, partner2, viewMode } = useCouple();

    if (viewMode !== 'couple' || !partner1 || !partner2) {
        return null;
    }

    const totalIncome = partner1.monthlyContribution + partner2.monthlyContribution;
    if (totalIncome === 0) return null;

    const p1Percent = Math.round((partner1.monthlyContribution / totalIncome) * 100);
    const p2Percent = Math.round((partner2.monthlyContribution / totalIncome) * 100);

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>
                <Users size={20} /> Contribuição de Cada Um
            </h3>

            <div className={styles.comparisonArea}>
                <PartnerStat
                    name={partner1.name}
                    percent={p1Percent}
                    amount={partner1.monthlyContribution}
                    invested={partner1.investments}
                    expenses={partner1.expenses}
                    color="#10B981" // Green
                />

                <div style={{ width: 1, height: 60, background: '#E5E7EB' }} />

                <PartnerStat
                    name={partner2.name}
                    percent={p2Percent}
                    amount={partner2.monthlyContribution}
                    invested={partner2.investments}
                    expenses={partner2.expenses}
                    color="#3B82F6" // Blue
                />
            </div>
        </div>
    );
}

function PartnerStat({ name, percent, amount, invested, expenses, color }: any) {
    return (
        <div className={styles.partnerSection}>
            <div className={styles.partnerHeader}>
                <span className={styles.partnerName}>{name}</span>
                <span className={styles.contributionPercent}>{percent}%</span>
            </div>

            <div className={styles.barContainer}>
                <div
                    className={styles.barFill}
                    style={{ width: `${percent}%`, background: color }}
                />
            </div>

            <p style={{ marginBottom: 12, fontWeight: 500 }}>
                {formatCurrency(amount)} <span style={{ color: '#9CA3AF', fontSize: 12 }}>este mês</span>
            </p>

            <div className={styles.details}>
                <div>Investimentos</div>
                <div className={styles.value} style={{ color }}>{formatCurrency(invested)}</div>
            </div>
            <div className={styles.details}>
                <div>Despesas</div>
                <div className={styles.value}>{formatCurrency(expenses)}</div>
            </div>
        </div>
    );
}
