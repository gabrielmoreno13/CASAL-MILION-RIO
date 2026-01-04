'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface GoalCardProps {
    title: string;
    currentAmount: number;
    targetAmount: number;
    targetDate: string;
    icon?: string;
    category?: string;
    onEdit?: () => void;
}

export function GoalCard({ title, currentAmount, targetAmount, targetDate, icon, category, onEdit }: GoalCardProps) {
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);
    const date = new Date(targetDate);
    const isLate = date < new Date() && progress < 100;

    // Determine progress bar color based on percentage
    const getProgressColor = (p: number) => {
        if (p < 30) return 'from-red-500 to-orange-500';
        if (p < 70) return 'from-yellow-500 to-blue-500';
        return 'from-green-500 to-emerald-500';
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="group relative overflow-hidden bg-[#0F1115] border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-emerald-500/10"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
                            {icon || '🎯'}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={14} />
                                <span>{date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                                {isLate && <span className="text-red-400 flex items-center gap-1 text-xs bg-red-500/10 px-2 py-0.5 rounded-full"><AlertCircle size={10} /> Atrasado</span>}
                            </div>
                        </div>
                    </div>
                    {onEdit && (
                        <button onClick={onEdit} className="text-gray-500 hover:text-white transition-colors">
                            •••
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Acumulado</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(currentAmount)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Meta</p>
                            <p className="text-lg font-medium text-gray-300">{formatCurrency(targetAmount)}</p>
                        </div>
                    </div>

                    <div className="relative h-3 bg-white/5 rounded-full overflow-hidden ring-1 ring-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-emerald-400">{progress.toFixed(0)}% Concluído</span>
                        <span className="text-gray-500">Faltam {formatCurrency(targetAmount - currentAmount)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
