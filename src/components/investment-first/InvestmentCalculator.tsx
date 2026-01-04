'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';


interface Props {
    onClose: () => void;
}

export function InvestmentCalculator({ onClose }: Props) {
    const [income, setIncome] = useState(10000);
    const [fixedExpenses, setFixedExpenses] = useState(5000);
    const [investmentGoalPercent, setInvestmentGoalPercent] = useState(20);

    // Load saved settings
    useEffect(() => {
        const saved = localStorage.getItem('investment_calculator_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setIncome(parsed.income || 10000);
                setFixedExpenses(parsed.fixedExpenses || 5000);
                setInvestmentGoalPercent(parsed.investmentGoalPercent || 20);
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }, []);

    const investmentAmount = (income * investmentGoalPercent) / 100;
    const remainingForMonth = income - fixedExpenses - investmentAmount;
    const dailyBudget = remainingForMonth / 30;

    const handleSave = () => {
        const settings = {
            income,
            fixedExpenses,
            investmentGoalPercent,
            dailyBudget, // Save the result too for easier access
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('investment_calculator_settings', JSON.stringify(settings));
        window.dispatchEvent(new Event('daily_budget_updated')); // Notify widget
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#12141A] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">Motor Investimento-Primeiro 🚀</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Renda Mensal do Casal</label>
                        <div className="flex items-center bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
                            <span className="text-gray-500 mr-2">R$</span>
                            <input
                                type="number"
                                value={income}
                                onChange={e => setIncome(Number(e.target.value))}
                                className="bg-transparent text-white font-bold w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Despesas Fixas</label>
                        <div className="flex items-center bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
                            <span className="text-gray-500 mr-2">R$</span>
                            <input
                                type="number"
                                value={fixedExpenses}
                                onChange={e => setFixedExpenses(Number(e.target.value))}
                                className="bg-transparent text-white font-bold w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Meta de Investimento (% da Renda)</label>
                        <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4">
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={investmentGoalPercent}
                                onChange={e => setInvestmentGoalPercent(Number(e.target.value))}
                                className="w-full accent-emerald-500"
                            />
                            <span className="text-white font-bold min-w-[3ch]">{investmentGoalPercent}%</span>
                        </div>
                        <p className="mt-2 text-emerald-500 font-bold text-sm text-right">
                            = {formatCurrency(investmentAmount)} / mês
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                        <div className="text-emerald-400 text-sm font-bold uppercase mb-1">Você pode gastar por dia (Variável):</div>
                        <div className="text-4xl font-bold text-white tracking-tight mb-2">{formatCurrency(dailyBudget)}</div>
                        <p className="text-emerald-500/70 text-xs">
                            Isso garante que sua meta de {formatCurrency(investmentAmount)} seja cumprida!
                        </p>
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <button
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        onClick={handleSave}
                    >
                        Aplicar Orçamento Inteligente
                    </button>
                </div>
            </div>
        </div>
    );
}
