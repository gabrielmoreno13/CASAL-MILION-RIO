'use client';

import { formatCurrency } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, TrendingUp, Target, CreditCard, ShoppingBag, ArrowUpRight } from 'lucide-react';

import { NetWorthCard } from './NetWorthCard';
import { EvolutionChart } from './EvolutionChart';
import { LevelProgress } from '../gamification/LevelProgress';
import { StreakCard } from '../gamification/StreakCard';
import { AchievementsGrid } from '../gamification/Achievements';
import { ViewToggle } from '../couple/ViewToggle';
import { ContributionCard } from '../couple/ContributionCard';
import { ActivityItem } from './ActivityItem';
import { Bell } from 'lucide-react';
import { useCouple } from '@/contexts/CoupleContext';
import { ApprovalModal } from '../couple/ApprovalModal';
import { DailySpendWidget } from '../investment-first/DailySpendWidget';
import { InvestmentCalculator } from '../investment-first/InvestmentCalculator';
import { InsightCard } from '../insights/InsightCard';
import { TransactionModal } from '../wallet/TransactionModal';

export function DashboardOverview() {
    const supabase = createClient();
    const { pendingApprovals } = useCouple();
    const [selectedApproval, setSelectedApproval] = useState<any>(null);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

    const [metrics, setMetrics] = useState({
        netWorth: 0,
        invested: 0,
        goal: 1000000,
        monthlyIncome: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Get User/Couple Data
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('income')
                    .eq('id', user.id)
                    .single();

                // 2. Get Goal Data
                const { data: goal } = await supabase
                    .from('financial_goals')
                    .select('*')
                    .limit(1)
                    .single();

                // 3. Get Recent Expenses
                // Need couple_id from member table first
                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                let expenses = [];
                if (member) {
                    const { data: expenseData } = await supabase
                        .from('expenses')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('date', { ascending: false })
                        .limit(5);
                    expenses = expenseData || [];
                }

                setMetrics({
                    netWorth: goal?.current_amount || 0,
                    invested: 0,
                    goal: goal?.target_amount || 1000000,
                    monthlyIncome: profile?.income || 0
                });
                setRecentActivity(expenses);
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);



    const percentToGoal = ((metrics.netWorth / metrics.goal) * 100).toFixed(1);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header V3: Couple Toggle & Notifications */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Visão Geral</h1>
                    <p className="text-gray-400 text-sm capitalize">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Mock Notification for Pending Approvals */}
                    <div className="relative">
                        <button
                            className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative"
                            onClick={() => {
                                // For MVP demo: if pending exists, show first. 
                                // Or use useCouple to trigger mock.
                                if (pendingApprovals.length > 0) {
                                    setSelectedApproval(pendingApprovals[0]);
                                } else {
                                    // Mock one for demo purposes if empty
                                    setSelectedApproval({
                                        id: 'demo-1',
                                        amount: 3500,
                                        category: 'Eletrônicos',
                                        description: 'Novo PlayStation 6',
                                        requestedBy: 'Parceiro',
                                        status: 'pending'
                                    });
                                }
                            }}
                        >
                            <Bell size={20} />
                            {(pendingApprovals.length > 0 || true) && ( // Always show dot for demo
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F1115]"></span>
                            )}
                        </button>
                    </div>
                    <ViewToggle />
                </div>
            </div>

            <InsightCard />

            {/* Level Bar (Gamification) */}
            <LevelProgress />

            <div className="w-full">
                <DailySpendWidget onClick={() => setIsCalculatorOpen(true)} />
            </div>

            <NetWorthCard />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Investido"
                    value={formatCurrency(metrics.invested)}
                    icon={<TrendingUp size={16} />}
                    footer="0% da carteira"
                    href="/dashboard/investments"
                />
                <MetricCard
                    label="Renda Mensal"
                    value={formatCurrency(metrics.monthlyIncome)}
                    icon={<CreditCard size={16} />}
                    footer="Base familiar"
                    href="/dashboard/wallet"
                />
                <MetricCard
                    label="Meta do Milhão"
                    value={formatCurrency(metrics.goal)}
                    icon={<Target size={16} />}
                    footer="Objetivo Final"
                    href="/dashboard/goals"
                />
                <StreakCard />
            </div>

            {/* Couple Contribution (Conditional) */}
            <ContributionCard />

            <AchievementsGrid />

            {/* Main Section: Chart & Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0F1115] border border-white/5 rounded-3xl p-6">
                    <EvolutionChart />
                </div>

                <div className="bg-[#0F1115] border border-white/5 rounded-3xl p-6 flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Atividade Recente</h3>
                        <Link href="/dashboard/wallet" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
                            Ver tudo <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">Carregando...</div>
                    ) : recentActivity.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Nenhuma despesa ainda.
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentActivity.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    title={activity.description}
                                    date={new Date(activity.date).toLocaleDateString('pt-BR')}
                                    amount={(activity as any).amount}
                                    logoUrl={(activity as any).logo_url}
                                    userName="Você"
                                    onClick={() => setSelectedTransaction(activity)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedApproval && (
                <ApprovalModal
                    approval={selectedApproval}
                    onClose={() => setSelectedApproval(null)}
                />
            )}

            {isCalculatorOpen && (
                <InvestmentCalculator onClose={() => setIsCalculatorOpen(false)} />
            )}

            {selectedTransaction && (
                <TransactionModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </div>
    );
}


import Link from 'next/link';

function MetricCard({ label, value, icon, footer, href, onClick }: any) {
    const content = (
        <div className="bg-[#0F1115] border border-white/5 p-6 rounded-3xl hover:bg-white/5 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 text-gray-400 mb-2 group-hover:text-emerald-400 transition-colors">
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            </div>
            <div className="mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-emerald-500/70 transition-colors">
                {footer}
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{content}</Link>;
    }

    return <div onClick={onClick} className="h-full">{content}</div>;
}


