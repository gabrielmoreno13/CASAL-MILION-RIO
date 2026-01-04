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
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Evolução Patrimonial</h3>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                    <button
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === '6M' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setPeriod('6M')}
                    >
                        6M
                    </button>
                    <button
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === '1Y' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setPeriod('1Y')}
                    >
                        1A
                    </button>
                    <button
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === 'ALL' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setPeriod('ALL')}
                    >
                        Tudo
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-[#1A1D24] border border-white/10 rounded-xl p-3 shadow-xl">
                                            <p className="text-gray-400 text-xs mb-1">{label}</p>
                                            <p className="text-emerald-400 font-bold text-lg">
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
