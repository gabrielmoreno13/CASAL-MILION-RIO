'use client';

import { formatCurrency } from '@/lib/utils';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import styles from './EvolutionChart.module.css';

// Mock data (Since we don't have history table yet)
// In V2.1 this will come from a 'balance_history' table
const DATA_6M = [
    { month: 'Jul', value: 45000 },
    { month: 'Ago', value: 48000 },
    { month: 'Set', value: 47500 },
    { month: 'Out', value: 52000 },
    { month: 'Nov', value: 58000 },
    { month: 'Dez', value: 65000 },
];

const DATA_1Y = [
    { month: 'Jan', value: 20000 },
    { month: 'Fev', value: 22000 },
    { month: 'Mar', value: 25000 },
    { month: 'Abr', value: 28000 },
    { month: 'Mai', value: 30000 },
    { month: 'Jun', value: 35000 },
    { month: 'Jul', value: 45000 },
    { month: 'Ago', value: 48000 },
    { month: 'Set', value: 47500 },
    { month: 'Out', value: 52000 },
    { month: 'Nov', value: 58000 },
    { month: 'Dez', value: 65000 },
];

export function EvolutionChart() {
    const [period, setPeriod] = useState<'6M' | '1Y' | 'ALL'>('6M');

    const data = period === '6M' ? DATA_6M : DATA_1Y;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Evolução Patrimonial</h3>
                <div className={styles.filter}>
                    <button
                        className={period === '6M' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setPeriod('6M')}
                    >
                        6M
                    </button>
                    <button
                        className={period === '1Y' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setPeriod('1Y')}
                    >
                        1A
                    </button>
                    <button
                        className={period === 'ALL' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setPeriod('ALL')}
                    >
                        Tudo
                    </button>
                </div>
            </div>

            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className={styles.tooltip}>
                                            <p className={styles.tooltipLabel}>{label}</p>
                                            <p className={styles.tooltipValue}>
                                                {formatCurrency(Number(payload[0].value))}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10B981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
