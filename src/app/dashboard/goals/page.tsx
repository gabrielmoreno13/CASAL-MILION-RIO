'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Target, Trophy, Plus, Wallet, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import { GoalCard } from '@/components/goals/GoalCard';
import { formatCurrency } from '@/lib/utils';
import { GoalTimeline } from '@/components/projections/GoalTimeline';
import { useUser } from '@/contexts/UserContext';

function GoalsContent() {
    const supabase = createClient();
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { user } = useUser();

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/dashboard/goals');
    };

    useEffect(() => {
        async function fetchGoals() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get Couple ID
                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                if (member) {
                    const { data } = await supabase
                        .from('goals')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('target_date', { ascending: true });
                    setGoals(data || []);
                }
            } catch (error) {
                console.error('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGoals();
    }, [refreshTrigger, supabase]);

    const totalTarget = goals.reduce((acc, goal) => acc + goal.target_amount, 0);
    const totalCurrent = goals.reduce((acc, goal) => acc + goal.current_amount, 0);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <Header
                title="Metas do Casal"
                subtitle="Transforme sonhos em realidade planejado juntos"
                action={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-gradient-primary flex items-center gap-2 px-6 py-3"
                    >
                        <Plus size={20} /> Nova Meta
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={64} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                        <Target size={24} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Meta Total Acumulada</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatCurrency(totalTarget)}</p>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                        <Wallet size={24} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Já Conquistado</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatCurrency(totalCurrent)}</p>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={64} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-4 border border-yellow-500/20">
                        <Trophy size={24} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Metas Concluídas</p>
                    <p className="text-3xl font-bold text-white mt-1">
                        {goals.filter(g => g.current_amount >= g.target_amount).length} <span className="text-lg text-gray-500 font-normal">/ {goals.length}</span>
                    </p>
                </div>
            </div>

            {/* Goals Grid */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-emerald-400" size={20} />
                    <h3 className="text-xl font-bold text-white">Seus Potes e Sonhos</h3>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : goals.length === 0 ? (
                    <div className="glass-card p-12 text-center border-dashed border-2 border-white/10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-bounce-slow">
                            <Target size={40} className="text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Comece a planejar seus sonhos</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            Metas financeiras ajudam casais a crescerem juntos. Adicione sua primeira meta, como "Reserva de Emergência" ou "Viagem dos Sonhos".
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-gradient-primary px-8 py-4 text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40"
                        >
                            Criar Primeira Meta
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                title={goal.title} // Ensure your DB uses 'title' or map relevant field
                                currentAmount={goal.current_amount}
                                targetAmount={goal.target_amount}
                                targetDate={goal.target_date} // ensure DB field matches
                                icon={goal.icon}
                            />
                        ))}
                    </div>
                )}
            </div>

            {user && (
                <AddGoalModal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                    user={user}
                />
            )}

            {/* PROJECTION TIMELINE - Keep existing logic but style match if needed */}
            {goals.length > 0 && (
                <div className="mt-12 glass-card p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Linha do Tempo (Previsão)</h3>
                    <GoalTimeline goals={goals} monthlyContribution={2000} />
                </div>
            )}
        </div>
    );
}

export default function GoalsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando interface...</div>}>
            <GoalsContent />
        </Suspense>
    );
}
