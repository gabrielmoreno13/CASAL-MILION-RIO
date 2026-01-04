'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { TrendingUp, Wallet, Car, Home } from 'lucide-react'; // Icons
import styles from './NetWorthCard.module.css';

export function NetWorthCard() {
    const supabase = createClient();
    const [data, setData] = useState({
        total: 0,
        liquid: 0,
        fixed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWealthData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Couple ID (Assuming single couple for now)
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .limit(1)
                .single();

            if (!member) return;

            // 2. Fetch Goal (Liquid Assets - Mocked as Net Worth Goal for now)
            // In a real scenario, this should be Sum(Bank Accounts). 
            // For now we use the 'financial_goals.current_amount' as "Liquid Cash".
            const { data: goal } = await supabase
                .from('financial_goals')
                .select('current_amount')
                .eq('couple_id', member.couple_id)
                .single();

            // 3. Fetch Fixed Assets (Real Estate, Vehicles)
            const { data: assets } = await supabase
                .from('assets')
                .select('value, type')
                .eq('couple_id', member.couple_id);

            const liquid = Number(goal?.current_amount || 0);

            const fixed = assets?.reduce((acc, curr) => acc + Number(curr.value), 0) || 0;

            setData({
                total: liquid + fixed,
                liquid,
                fixed
            });
            setLoading(false);
        }

        fetchWealthData();
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    if (loading) return <div className={styles.card} style={{ opacity: 0.5 }}>Carregando Patrimônio...</div>;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>Patrimônio Total</span>
                <div className={styles.trend}>
                    <TrendingUp size={14} /> +0% este mês
                </div>
            </div>

            <div className={styles.value}>
                {formatCurrency(data.total)}
            </div>

            <div className={styles.breakdown}>
                <div>
                    <div className={styles.breakdownLabel}>Liquidez (Caixa)</div>
                    <div className={styles.breakdownValue}>
                        <Wallet size={14} style={{ display: 'inline', marginRight: 4 }} />
                        {formatCurrency(data.liquid)}
                    </div>
                </div>
                <div>
                    <div className={styles.breakdownLabel}>Imobilizado (Bens)</div>
                    <div className={styles.breakdownValue}>
                        <Home size={14} style={{ display: 'inline', marginRight: 4 }} />
                        {formatCurrency(data.fixed)}
                    </div>
                </div>
            </div>
        </div>
    );
}
