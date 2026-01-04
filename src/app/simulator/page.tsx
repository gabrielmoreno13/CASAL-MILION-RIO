'use client';

import { useState, useEffect } from 'react';
import { FireCalculator } from '@/lib/wealth/FireCalculator';
import { Header } from '@/components/dashboard/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
        <div className="min-h-screen bg-black text-white pb-20">
            <Header title="Simulador FIRE 🔥" action={null} />

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Quando você será livre?
                    </h1>
                    <p className="text-gray-400 text-lg">Descubra o poder dos juros compostos no seu futuro.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 rounded-2xl space-y-6 border border-white/10">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300">Patrimônio Atual</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">R$</span>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono text-lg"
                                        value={currentNetWorth}
                                        onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-300">Aporte Mensal</label>
                                    <span className="text-emerald-400 font-bold font-mono">{formatCurrency(monthlySavings)}</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    min="0" max="20000" step="100"
                                    value={monthlySavings}
                                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-300">Gasto Mensal (Estilo de Vida)</label>
                                    <span className="text-red-400 font-bold font-mono">{formatCurrency(monthlyExpenses)}</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-red-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    min="2000" max="30000" step="100"
                                    value={monthlyExpenses}
                                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-300">Rentabilidade Anual</label>
                                    <span className="text-blue-400 font-bold font-mono">{annualReturn}% (CDI)</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    min="5" max="20" step="0.5"
                                    value={annualReturn}
                                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h3 className="text-sm text-gray-400 mb-1">Liberdade em</h3>
                                    <div className="text-2xl font-bold text-white">
                                        {result ? `${Math.floor(result.monthsToFire / 12)} anos` : '...'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h3 className="text-sm text-gray-400 mb-1">Data Estimada</h3>
                                    <div className="text-2xl font-bold text-emerald-400">
                                        {result ? result.fireDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '...'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h3 className="text-sm text-gray-400 mb-1">Número FIRE</h3>
                                    <div className="text-2xl font-bold text-amber-500">
                                        {result ? formatCurrency(result.fireNumber) : '...'}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                {result && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={result.projection}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                            <XAxis
                                                dataKey="year"
                                                stroke="#666"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                                                stroke="#666"
                                                tickLine={false}
                                                axisLine={false}
                                                width={60}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(val: any) => [formatCurrency(Number(val)), 'Patrimônio']}
                                                labelFormatter={(label) => `Ano ${label}`}
                                            />
                                            <ReferenceLine y={result.fireNumber} label={{ value: 'Meta FIRE', fill: '#F59E0B', position: 'insideTopRight' }} stroke="#F59E0B" strokeDasharray="5 5" />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                dot={false}
                                                activeDot={{ r: 6, fill: '#10B981' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                            <p className="mt-4 text-xs text-center text-gray-500">
                                *Considerando inflação de 4.5% a.a. e regra dos 4%, com reinvestimento total de dividendos.
                            </p>
                        </div>

                        {/* V3 Feature: Scenario Comparison */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-white">Comparativo de Cenários</h2>
                            <ScenarioChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
