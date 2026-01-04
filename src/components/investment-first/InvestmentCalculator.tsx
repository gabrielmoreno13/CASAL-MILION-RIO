'use client';

import { useState } from 'react';
import { X, DollarSign, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import styles from './InvestmentCalculator.module.css';

interface Props {
    onClose: () => void;
}

export function InvestmentCalculator({ onClose }: Props) {
    const [income, setIncome] = useState(10000);
    const [fixedExpenses, setFixedExpenses] = useState(5000);
    const [investmentGoalPercent, setInvestmentGoalPercent] = useState(20);

    const investmentAmount = (income * investmentGoalPercent) / 100;
    const remainingForMonth = income - fixedExpenses - investmentAmount;
    const dailyBudget = remainingForMonth / 30;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Motor Investimento-Primeiro 🚀</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X /></button>
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>Renda Mensal do Casal</label>
                    <div className={styles.inputGroup}>
                        <span className={styles.prefix}>R$</span>
                        <input
                            type="number"
                            value={income}
                            onChange={e => setIncome(Number(e.target.value))}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>Despesas Fixas</label>
                    <div className={styles.inputGroup}>
                        <span className={styles.prefix}>R$</span>
                        <input
                            type="number"
                            value={fixedExpenses}
                            onChange={e => setFixedExpenses(Number(e.target.value))}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>Meta de Investimento (% da Renda)</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={investmentGoalPercent}
                            onChange={e => setInvestmentGoalPercent(Number(e.target.value))}
                            style={{ width: '100%', marginRight: '1rem' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>{investmentGoalPercent}%</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                        = {formatCurrency(investmentAmount)} / mês
                    </p>
                </div>

                <div className={styles.resultCard}>
                    <div className={styles.resultLabel}>Você pode gastar por dia (Variável):</div>
                    <div className={styles.resultValue}>{formatCurrency(dailyBudget)}</div>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Isso garante que sua meta de {formatCurrency(investmentAmount)} seja cumprida!
                    </p>
                </div>

                <button className={styles.saveBtn} onClick={() => {
                    // In real app, save to settings context
                    onClose();
                }}>
                    Aplicar Orçamento Inteligente
                </button>
            </div>
        </div>
    );
}
