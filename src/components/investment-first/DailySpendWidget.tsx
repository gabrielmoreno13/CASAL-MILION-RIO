'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet } from 'lucide-react';


export function DailySpendWidget({ onClick }: { onClick?: () => void }) {
    // Mock calculation logic for now. 
    // In real app: Income - Fixed Expenses - Investment Goal / Days in month
    const safeToSpend = 145.50;

    return (
        <div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-black border border-white/5 p-6 shadow-xl cursor-pointer hover:border-indigo-500/30 transition-all duration-300 group"
            onClick={onClick}
        >
            {/* Decoration Orbs */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full group-hover:bg-indigo-500/30 transition-colors" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/20 blur-[40px] rounded-full group-hover:bg-purple-500/30 transition-colors" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        Pode gastar hoje (Livre)
                    </div>
                </div>

                <div className="flex items-end gap-3 my-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                        <Wallet size={32} />
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tight">
                        {formatCurrency(safeToSpend)}
                    </div>
                </div>

                <div className="text-xs text-indigo-300/70 border-t border-white/5 pt-3 mt-2">
                    Já descontados seus investimentos e contas fixas!
                </div>
            </div>
        </div>
    );
}
