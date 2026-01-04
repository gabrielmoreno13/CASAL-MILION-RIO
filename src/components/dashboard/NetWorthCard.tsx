import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { TrendingUp, Wallet, Car, Home, RefreshCw } from 'lucide-react'; // Icons
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
            if (asset.type === 'INVESTMENT' || asset.liquidity === 'HIGH') {
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
                <span className={styles.title}>Patrimônio Total</span>
                <button
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors"
                    onClick={() => setIsUpdateModalOpen(true)}
                    title="Atualizar Saldo"
                >
                    <RefreshCw size={12} /> Atualizar
                </button>
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
