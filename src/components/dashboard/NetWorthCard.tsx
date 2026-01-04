import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { TrendingUp, Wallet, Car, Home, RefreshCw, ArrowRight } from 'lucide-react'; // Icons
import Link from 'next/link';
import styles from './NetWorthCard.module.css';
import { UpdateBalanceModal } from './UpdateBalanceModal';

export function NetWorthCard() {
    const supabase = createClient();
    const [data, setData] = useState({
        total: 0,
        liquid: 0,
        fixed: 0
    });
    const [loading, setLoading] = useState(true);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    const fetchWealthData = async () => {
        if (!user) return;

        // 1. Get Couple ID
        const { data: member } = await supabase
            .from('couple_members')
            .select('couple_id')
            .eq('profile_id', user.id)
            .limit(1)
            .single();

        if (!member) return;

        // 2. Fetch All Assets
        const { data: assets } = await supabase
            .from('assets')
            .select('*')
            .eq('couple_id', member.couple_id);

        if (!assets) {
            setLoading(false);
            return;
        }

        // 3. Calculate Totals
        // Liquid: Type = INVESTMENT (assuming Cash/Investments) or liquidity = HIGH
        // Fixed: Type = HOME, VEHICLE, OTHER

        let liquid = 0;
        let fixed = 0;

        assets.forEach(asset => {
            const val = Number(asset.value);
            // Liquid: INVESTMENT or explicitly named 'Saldo...' logic if type is generic
            // For now, simpler: INVESTMENT is Liquid, others are Fixed.
            if (asset.type === 'INVESTMENT') {
                liquid += val;
            } else {
                fixed += val;
            }
        });

        setData({
            total: liquid + fixed,
            liquid,
            fixed
        });
        setLoading(false);

        // Update Goal Current Amount to match total Net Worth
        // This keeps the Goal Progress bar in sync
        const mainGoalId = (await supabase.from('financial_goals').select('id').eq('couple_id', member.couple_id).limit(1).single()).data?.id;
        if (mainGoalId) {
            await supabase.from('financial_goals').update({ current_amount: liquid + fixed }).eq('id', mainGoalId);
        }
    };

    useEffect(() => {
        if (user) fetchWealthData();
    }, [user]);

    if (loading) return <div className={styles.card} style={{ opacity: 0.5 }}>Carregando Patrimônio...</div>;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Link href="/dashboard/wallet" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <span className={styles.title}>Patrimônio Total</span>
                    <ArrowRight size={16} className="text-gray-400" />
                </Link>
                <button
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsUpdateModalOpen(true)}
                    title="Atualizar Saldo"
                >
                    <RefreshCw size={12} /> Atualizar
                </button>
            </div>

            <Link href="/dashboard/wallet" className={styles.value} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                {formatCurrency(data.total)}
            </Link>

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

            {user && (
                <UpdateBalanceModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSuccess={fetchWealthData}
                    user={user}
                />
            )}
        </div>
    );
}
