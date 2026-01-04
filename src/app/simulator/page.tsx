'use client';

import { useState, useEffect } from 'react';
import { FireCalculator } from '@/lib/wealth/FireCalculator';
import { Header } from '@/components/dashboard/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import styles from './Simulator.module.css';
import { formatCurrency } from '@/lib/utils';
import { ScenarioChart } from '@/components/projections/ScenarioChart';

export default function SimulatorPage() {
    // Default States (User edits these via sliders/inputs)
    const [currentNetWorth, setCurrentNetWorth] = useState(50000); // 50k inicial
    const [monthlySavings, setMonthlySavings] = useState(2000);    // 2k aporte
    const [monthlyExpenses, setMonthlyExpenses] = useState(5000);  // 5k custo de vida
    const [annualReturn, setAnnualReturn] = useState(10);          // 10% a.a.

    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        // Recalculate whenever inputs change
        const calculation = FireCalculator.calculateTimeToFire(
            currentNetWorth,
            monthlySavings,
            monthlyExpenses,
            annualReturn / 100, // Convert to decimal
            0.045 // Fixed inflation for MVP
        );
        setResult(calculation);
    }, [currentNetWorth, monthlySavings, monthlyExpenses, annualReturn]);



    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Header title="Simulador FIRE 🔥" action={null} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Quando você será livre?</h1>
                    <p className={styles.subtitle}>Descubra o poder dos juros compostos no seu futuro.</p>
                </div>

                <div className={styles.grid}>
                    {/* Controls */}
                    <div className={styles.controls}>
                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Patrimônio Atual</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={currentNetWorth}
                                onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
                            />
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Aporte Mensal (R$)</label>
                            <input
                                type="range" className={styles.range}
                                min="0" max="20000" step="100"
                                value={monthlySavings}
                                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                            />
                            <div style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(monthlySavings)}</div>
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Gasto Mensal (Estilo de Vida)</label>
                            <input
                                type="range" className={styles.range}
                                min="2000" max="30000" step="100"
                                value={monthlyExpenses}
                                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            />
                            <div style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(monthlyExpenses)}</div>
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Rentabilidade Anual (%)</label>
                            <input
                                type="range" className={styles.range}
                                min="5" max="20" step="0.5"
                                value={annualReturn}
                                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                            />
                            <div style={{ textAlign: 'right', fontWeight: 600 }}>{annualReturn}% (CDI)</div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className={styles.results}>
                        <div className={styles.resultHeader}>
                            <div className={styles.resultItem}>
                                <h3>Liberdade em</h3>
                                <div className={styles.value}>
                                    {result ? `${Math.floor(result.monthsToFire / 12)} anos` : '...'}
                                </div>
                            </div>
                            <div className={styles.resultItem}>
                                <h3>Data Estimada</h3>
                                <div className={styles.value} style={{ color: 'var(--text-primary)' }}>
                                    {result ? result.fireDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '...'}
                                </div>
                            </div>
                            <div className={styles.resultItem}>
                                <h3>Número FIRE</h3>
                                <div className={styles.value} style={{ color: '#F59E0B' }}>
                                    {result ? formatCurrency(result.fireNumber) : '...'}
                                </div>
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            {result && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={result.projection}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="year"
                                            label={{ value: 'Anos', position: 'insideBottomRight', offset: -5 }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                                            tickLine={false}
                                            width={80}
                                        />
                                        <Tooltip
                                            formatter={(val: any) => formatCurrency(Number(val))}
                                            labelFormatter={(label) => `Ano ${label}`}
                                        />
                                        <ReferenceLine y={result.fireNumber} label="Meta FIRE" stroke="#F59E0B" strokeDasharray="5 5" />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="var(--primary)"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9CA3AF', textAlign: 'center' }}>
                            *Considerando inflação de 4.5% a.a. e regra dos 4%.
                        </p>

                        {/* V3 Feature: Scenario Comparison */}
                        <div style={{ marginTop: '2rem' }}>
                            <ScenarioChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
