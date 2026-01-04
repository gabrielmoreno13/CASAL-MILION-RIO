'use client';

import { formatCurrency } from '@/lib/utils';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './CategoryChart.module.css';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface CategoryChartProps {
    data: { name: string; value: number }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyChart}>
                <p>Sem dados suficientes para o gráfico.</p>
            </div>
        );
    }



    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Gastos por Categoria</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => formatCurrency(Number(value))}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
