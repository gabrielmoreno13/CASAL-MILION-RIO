'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const DATA = [
    { year: 2024, conservative: 100000, moderate: 100000, aggressive: 100000 },
    { year: 2025, conservative: 110000, moderate: 115000, aggressive: 125000 },
    { year: 2026, conservative: 121000, moderate: 132000, aggressive: 156000 },
    { year: 2027, conservative: 133000, moderate: 152000, aggressive: 195000 },
    { year: 2028, conservative: 146000, moderate: 175000, aggressive: 243000 },
    { year: 2029, conservative: 160000, moderate: 201000, aggressive: 304000 },
    { year: 2030, conservative: 176000, moderate: 231000, aggressive: 380000 },
    { year: 2035, conservative: 250000, moderate: 450000, aggressive: 900000 },
];

export function ScenarioChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Simulação de Cenários
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Projeção baseada em diferentes taxas de retorno
            </p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(val) => `R$ ${val / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: any) => formatCurrency(value)}
                        />
                        <Legend iconType="circle" />

                        <Line
                            type="monotone"
                            dataKey="conservative"
                            name="Conservador (6%)"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="moderate"
                            name="Moderado (10%)"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="aggressive"
                            name="Agressivo (14%)"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-blue-800 text-xs">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                    O cenário <strong>Moderado</strong> é o mais recomendado para o seu perfil.
                    Mantenha aportes constantes para atingir o primeiro milhão em <strong>2032</strong>.
                </p>
            </div>
        </div>
    );
}
