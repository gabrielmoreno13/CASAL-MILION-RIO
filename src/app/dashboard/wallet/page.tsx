'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Search, Filter, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { CategoryChart } from '@/components/dashboard/CategoryChart'; // Import chart
import styles from './Wallet.module.css';

export default function WalletPage() {
    const supabase = createClient();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<{ name: string, value: number }[]>([]);
    const [stats, setStats] = useState({ totalExpense: 0, income: 0 });

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

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="fade-in">
            <Header title="Carteira" action={null} />

            <div className={styles.container}>
                {/* Top Section: Stats & Chart */}
                <div className={styles.topSection}>
                    <div className={styles.statsColumn}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Gastos Totais</div>
                            <div className={styles.statValue}>{formatCurrency(stats.totalExpense)}</div>
                            <div className={styles.statTrend}><ArrowDownCircle size={14} color="#EF4444" /> Histórico completo</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Renda Cadastrada</div>
                            <div className={styles.statValue}>{formatCurrency(stats.income)}</div>
                            <div className={styles.statTrend}><ArrowUpCircle size={14} color="#10B981" /> Mensal</div>
                        </div>
                    </div>

                    <div className={styles.chartColumn}>
                        <CategoryChart data={chartData} />
                    </div>
                </div>

                {/* Filters (Mock) */}
                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#9CA3AF" />
                        <input type="text" placeholder="Buscar transação..." className={styles.searchInput} />
                    </div>
                    <button className={styles.filterBtn}>
                        <Filter size={18} /> Filtrar
                    </button>
                </div>

                {/* Transaction List */}
                <div className={styles.listCard}>
                    <h3 className={styles.sectionTitle}>Histórico de Transações</h3>

                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Carregando...</div>
                    ) : expenses.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Nenhuma despesa encontrada.</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th style={{ textAlign: 'right' }}>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => {
                                    const isUrl = expense.logo_url?.startsWith('http');
                                    return (
                                        <tr key={expense.id}>
                                            <td style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                {new Date(expense.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div className={styles.iconBox}>
                                                        {expense.logo_url ? (
                                                            isUrl ? <img src={expense.logo_url} className="w-full h-full rounded-full object-cover" /> : expense.logo_url
                                                        ) : '💸'}
                                                    </div>
                                                    <span style={{ fontWeight: 500 }}>{expense.description}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.badge}>{expense.category}</span>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                                - {formatCurrency(expense.amount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
