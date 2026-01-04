import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { TrendingUp, Wallet, Car, Home, RefreshCw, ArrowRight } from 'lucide-react'; // Icons
import Link from 'next/link';

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

    if (loading) return (
        <div className="w-full bg-[#0F1115] border border-white/5 rounded-3xl p-6 opacity-50 text-white font-medium flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" size={16} />
            Carregando Patrimônio...
        </div>
    );

    return (
        <div className="w-full bg-gradient-to-br from-[#0F1115] to-[#12141A] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/dashboard/wallet" className="flex items-center gap-2 group-hover:text-emerald-400 text-gray-400 transition-colors">
                            <span className="text-sm font-medium uppercase tracking-wider">Patrimônio Total</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </Link>
                        <button
                            className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-400 transition-colors bg-white/5 px-2 py-1 rounded-lg border border-white/5 hover:bg-white/10"
                            onClick={() => setIsUpdateModalOpen(true)}
                            title="Atualizar Saldo"
                        >
                            <RefreshCw size={10} /> Atualizar
                        </button>
                    </div>
                    <Link href="/dashboard/wallet" className="block">
                        <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter hover:scale-[1.01] transition-transform origin-left">
                            {formatCurrency(data.total)}
                        </div>
                    </Link>
                </div>

                <div className="flex gap-4 md:gap-8 flex-wrap">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 md:px-5 md:py-3 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                            <Wallet size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-medium uppercase">Liquidez</div>
                            <div className="text-lg font-bold text-white leading-tight">
                                {formatCurrency(data.liquid)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 md:px-5 md:py-3 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
                            <Home size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-medium uppercase">Imobilizado</div>
                            <div className="text-lg font-bold text-white leading-tight">
                                {formatCurrency(data.fixed)}
                            </div>
                        </div>
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
