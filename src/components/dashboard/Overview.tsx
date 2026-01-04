'use client';

import { formatCurrency } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { DollarSign, TrendingUp, Target, CreditCard, ShoppingBag, ArrowUpRight, Plus, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { Reorder } from 'framer-motion';

import { NetWorthCard } from './NetWorthCard';
import { EvolutionChart } from './EvolutionChart';
import { LevelProgress } from '../gamification/LevelProgress';
import { StreakCard } from '../gamification/StreakCard';
import { AchievementsGrid } from '../gamification/Achievements';
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



    const [isReordering, setIsReordering] = useState(false);
    const [widgetOrder, setWidgetOrder] = useState<string[]>([
        'insight', 'level', 'quick-actions', 'net-worth', 'metrics', 'contribution', 'achievements', 'activity'
    ]);

    // Load order from localStorage
    useEffect(() => {
        const savedOrder = localStorage.getItem('dashboard_widget_order');
        if (savedOrder) {
            try {
                const parsed = JSON.parse(savedOrder);
                // Simple validation to ensure all keys exist, merge with default if needed
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setWidgetOrder(parsed);
                }
            } catch (e) {
                console.error("Failed to parse widget order", e);
            }
        }
    }, []);

    // Save order
    const handleReorder = (newOrder: string[]) => {
        setWidgetOrder(newOrder);
        localStorage.setItem('dashboard_widget_order', JSON.stringify(newOrder));
    };

    const renderWidget = (id: string) => {
        switch (id) {
            case 'insight': return <InsightCard />;
            case 'level': return <LevelProgress />;
            case 'quick-actions': return (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Cadastre seu Patrimônio</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Registre seus bens, investimentos e acompanhe a evolução da sua riqueza em tempo real.
                            </p>
                            <Link href="/dashboard/net-worth" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
                                <Plus size={18} />
                                Registrar Agora
                            </Link>
                        </div>
                    </div>
                    <div className="w-full">
                        <DailySpendWidget onClick={() => setIsCalculatorOpen(true)} />
                    </div>
                </div>
            );
            case 'net-worth': return <NetWorthCard />;
            case 'metrics': return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard label="Total Investido" value={formatCurrency(metrics.invested)} icon={<TrendingUp size={16} />} footer="0% da carteira" href="/dashboard/investments" />
                    <MetricCard label="Renda Mensal" value={formatCurrency(metrics.monthlyIncome)} icon={<CreditCard size={16} />} footer="Base familiar" href="/dashboard/wallet" />
                    <MetricCard label="Meta do Milhão" value={formatCurrency(metrics.goal)} icon={<Target size={16} />} footer="Objetivo Final" href="/dashboard/goals" />
                    <StreakCard />
                </div>
            );
            case 'contribution': return <ContributionCard />;
            case 'achievements': return <AchievementsGrid />;
            case 'activity': return (
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
                            <div className="flex-1 flex items-center justify-center text-gray-500">Nenhuma despesa ainda.</div>
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
            );
            default: return null;
        }
    };

    const percentToGoal = ((metrics.netWorth / metrics.goal) * 100).toFixed(1);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header V3: Reorder & Notifications */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Visão Geral</h1>
                    <p className="text-gray-400 text-sm capitalize">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsReordering(!isReordering)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isReordering
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {isReordering ? 'Concluir' : 'Reorganizar'}
                    </button>

                    {/* Mock Notification for Pending Approvals */}
                    <div className="relative">
                        <button
                            className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative"
                            onClick={() => {
                                if (pendingApprovals.length > 0) {
                                    setSelectedApproval(pendingApprovals[0]);
                                } else {
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
                            {(pendingApprovals.length > 0 || true) && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F1115]"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <Reorder.Group axis="y" values={widgetOrder} onReorder={handleReorder} className="space-y-8">
                {widgetOrder.map((id) => (
                    <Reorder.Item key={id} value={id} dragListener={isReordering}>
                        <div className={`relative transition-all ${isReordering ? 'cursor-grab active:cursor-grabbing p-2 rounded-3xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 bg-white/5' : ''}`}>
                            {isReordering && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-3xl z-50 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-white font-bold flex items-center gap-2">
                                        Segure para arrastar
                                    </span>
                                </div>
                            )}
                            {/* Drag Handle Indicator */}
                            {isReordering && (
                                <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-gray-600">
                                    <GripVertical />
                                </div>
                            )}
                            {renderWidget(id)}
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

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


