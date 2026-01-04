'use client';
export const dynamic = 'force-dynamic';

import { formatCurrency } from '@/lib/utils';
import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Search, Filter, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { CategoryChart } from '@/components/dashboard/CategoryChart'; // Import chart
import { useRouter, useSearchParams } from 'next/navigation';
import { AddTransactionModal } from '@/components/wallet/AddTransactionModal';


function WalletContent() {
    const supabase = createClient();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<{ name: string, value: number }[]>([]);
    const [stats, setStats] = useState({ totalExpense: 0, income: 0 });

    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalType, setAddModalType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'new_expense') {
            setAddModalType('EXPENSE');
            setIsAddModalOpen(true);
        } else if (action === 'new_income') {
            setAddModalType('INCOME');
            setIsAddModalOpen(true);
        }
    }, [searchParams]);

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        router.push('/dashboard/wallet');
    };


    useEffect(() => {
        async function fetchExpenses() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;


                // Get Couple & Income
                const { data: profile } = await supabase.from('profiles').select('income').eq('id', user.id).single();

                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                if (member) {
                    const { data } = await supabase
                        .from('expenses')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('date', { ascending: false });

                    const expenseList = data || [];
                    setExpenses(expenseList);

                    // Calculate Stats
                    const total = expenseList.reduce((acc, curr) => acc + curr.amount, 0);

                    // Aggregate Categories for Chart
                    const categoryMap = expenseList.reduce((acc: any, curr: any) => {
                        const cat = curr.category || 'Geral';
                        acc[cat] = (acc[cat] || 0) + curr.amount;
                        return acc;
                    }, {});

                    const chart = Object.keys(categoryMap).map(key => ({
                        name: key,
                        value: categoryMap[key]
                    }));

                    setStats({ totalExpense: total, income: profile?.income || 0 });
                    setChartData(chart);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchExpenses();
    }, []);



    return (

        <div className="fade-in pb-20 md:pb-0">
            <Header title="Carteira" action={null} />

            <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
                {/* Top Section: Stats & Chart */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-[#0F1115] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-red-500/10 transition-all" />
                            <div className="text-gray-400 text-sm font-medium mb-1 relative z-10">Gastos Totais</div>
                            <div className="text-3xl font-bold text-white mb-2 relative z-10">{formatCurrency(stats.totalExpense)}</div>
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-1.5 rounded-full w-fit relative z-10">
                                <ArrowDownCircle size={14} />
                                <span>Histórico completo</span>
                            </div>
                        </div>

                        <div className="bg-[#0F1115] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
                            <div className="text-gray-400 text-sm font-medium mb-1 relative z-10">Renda Cadastrada</div>
                            <div className="text-3xl font-bold text-white mb-2 relative z-10">{formatCurrency(stats.income)}</div>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit relative z-10">
                                <ArrowUpCircle size={14} />
                                <span>Mensal</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0F1115] border border-white/10 p-6 rounded-3xl relative">
                        <CategoryChart data={chartData} />
                    </div>
                </div>

                {/* Filters (Mock) */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar transação..."
                            className="w-full h-12 bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <button className="w-full md:w-auto px-6 h-12 bg-[#0F1115] border border-white/10 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium">
                        <Filter size={18} /> Filtrar
                    </button>
                </div>

                {/* Transaction List */}
                <div className="bg-[#0F1115] border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white">Histórico de Transações</h3>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Loading...
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Nenhuma despesa encontrada.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Descrição</th>
                                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoria</th>
                                        <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {expenses.map((expense) => {
                                        const isUrl = expense.logo_url?.startsWith('http');
                                        return (
                                            <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                                                    {new Date(expense.date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 text-xl group-hover:border-emerald-500/30 transition-colors">
                                                            {expense.logo_url ? (
                                                                isUrl ? <img src={expense.logo_url} className="w-full h-full object-cover" /> : expense.logo_url
                                                            ) : '💸'}
                                                        </div>
                                                        <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">{expense.description}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-medium text-white group-hover:text-red-400 transition-colors">
                                                    - {formatCurrency(expense.amount)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {user && (
                <AddTransactionModal
                    isOpen={isAddModalOpen}
                    initialType={addModalType}
                    onClose={handleModalClose}
                    onSuccess={() => window.location.reload()}
                    user={user}
                />
            )}
        </div>
    );
}

export default function WalletPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando carteira...</div>}>
            <WalletContent />
        </Suspense>
    );
}
