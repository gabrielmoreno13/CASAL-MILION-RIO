'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export function FIRECalculator() {
    const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
    const [currentNetWorth, setCurrentNetWorth] = useState(50000);
    const [monthlyContribution, setMonthlyContribution] = useState(2000);
    const [annualReturn, setAnnualReturn] = useState(8);
    const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(4);

    const [fireNumber, setFireNumber] = useState(0);
    const [yearsToFire, setYearsToFire] = useState(0);
    const [ageAtFire, setAgeAtFire] = useState(0); // Assuming start age 30 for simplicity or just years

    useEffect(() => {
        calculateFIRE();
    }, [monthlyExpenses, currentNetWorth, monthlyContribution, annualReturn, safeWithdrawalRate]);

    const calculateFIRE = () => {
        const annualExpenses = monthlyExpenses * 12;
        const target = annualExpenses / (safeWithdrawalRate / 100);
        setFireNumber(target);

        if (currentNetWorth >= target) {
            setYearsToFire(0);
            return;
        }

        // Simple compound interest loop to find years
        let balance = currentNetWorth;
        let years = 0;
        const monthlyRate = annualReturn / 100 / 12;

        while (balance < target && years < 100) {
            balance = (balance + monthlyContribution) * (1 + monthlyRate);
            // Add monthly contribution for 12 months? Simpler: compounding monthly
            // Actually, balance grows monthly.
            // Let's do monthly loop
            let months = 0;
            while (balance < target && months < 1200) { // Max 100 years
                balance = balance * (1 + monthlyRate) + monthlyContribution;
                months++;
            }
            years = months / 12;
            break;
        }
        setYearsToFire(Math.ceil(years));
    };

    return (
        <section className="py-24 bg-[#0A0A0A] relative overflow-hidden" id="fire-calculator">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4"
                    >
                        <TrendingUp size={14} />
                        Planejamento Financeiro
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Quando você vai atingir a <span className="text-emerald-500">Liberdade Financeira?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Use nossa calculadora FIRE (Financial Independence, Retire Early) para descobrir quanto tempo falta para você viver de renda.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Controls */}
                    <div className="space-y-8 bg-[#0F1115] p-8 rounded-3xl border border-white/5">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Gastos Mensais</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                <input
                                    type="number"
                                    value={monthlyExpenses}
                                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="50000"
                                step="500"
                                value={monthlyExpenses}
                                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                className="w-full mt-4 accent-emerald-500 bg-white/10 h-2 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Patrimônio Atual</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                <input
                                    type="number"
                                    value={currentNetWorth}
                                    onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Aporte Mensal</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                <input
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="20000"
                                step="100"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="w-full mt-4 accent-emerald-500 bg-white/10 h-2 rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gradient-to-br from-emerald-900/20 to-black p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden h-full flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="relative z-10 text-center space-y-8">
                            <div>
                                <h3 className="text-gray-400 font-medium mb-2 uppercase tracking-wider">Seu Número da Liberdade</h3>
                                <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                    {formatCurrency(fireNumber)}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Valor necessário investido para cobrir seus gastos</p>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                                <h3 className="text-emerald-400 font-bold mb-1 uppercase tracking-wider text-sm">Tempo Estimado</h3>
                                <div className="text-4xl font-black text-white mb-1">
                                    {yearsToFire} Anos
                                </div>
                                <p className="text-xs text-gray-400">Mantendo os aportes e rendimento de {annualReturn}% a.a.</p>
                            </div>

                            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                Criar Plano para Acelerar <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
