'use client';

import { useCouple } from '@/contexts/CoupleContext';
import { Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';


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
        <div className="bg-[#0F1115] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Users size={20} className="text-emerald-500" /> Contribuição de Cada Um
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-stretch md:items-center">
                <PartnerStat
                    name={partner1.name}
                    percent={p1Percent}
                    amount={partner1.monthlyContribution}
                    invested={partner1.investments}
                    expenses={partner1.expenses}
                    color="bg-emerald-500"
                    textColor="text-emerald-400"
                />

                <div className="hidden md:block w-px h-32 bg-white/5" />

                <PartnerStat
                    name={partner2.name}
                    percent={p2Percent}
                    amount={partner2.monthlyContribution}
                    invested={partner2.investments}
                    expenses={partner2.expenses}
                    color="bg-blue-500"
                    textColor="text-blue-400"
                />
            </div>
        </div>
    );
}

function PartnerStat({ name, percent, amount, invested, expenses, color, textColor }: any) {
    return (
        <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
                <span className="text-white font-bold text-lg">{name}</span>
                <span className={`text-2xl font-bold ${textColor}`}>{percent}%</span>
            </div>

            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            <p className="mb-4 font-semibold text-white">
                {formatCurrency(amount)} <span className="text-gray-500 text-xs font-normal">este mês</span>
            </p>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Investimentos</span>
                    <span className={`font-bold ${textColor}`}>{formatCurrency(invested)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Despesas</span>
                    <span className="text-white font-medium">{formatCurrency(expenses)}</span>
                </div>
            </div>
        </div>
    );
}
