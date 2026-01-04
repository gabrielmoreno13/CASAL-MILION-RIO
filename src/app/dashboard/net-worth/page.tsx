'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { AddAssetModal } from '@/components/investments/AddAssetModal';
import { Plus, TrendingUp, ArrowDownRight, Building2, Car, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';

export default function NetWorthPage() {
    const supabase = createClient();
    const { user } = useUser();
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Summary State
    const [summary, setSummary] = useState({
        investment: 0,
        home: 0,
        vehicle: 0,
        other: 0,
        total: 0
    });

    useEffect(() => {
        async function fetchAssets() {
            if (!user) return;
            setLoading(true);
            try {
                // Get Couple ID
                const { data: member } = await supabase
                    .from('couple_members')
                    .select('couple_id')
                    .eq('profile_id', user.id)
                    .single();

                if (member) {
                    const { data } = await supabase
                        .from('assets')
                        .select('*')
                        .eq('couple_id', member.couple_id)
                        .order('created_at', { ascending: false });

                    const assetList = data || [];
                    setAssets(assetList);

                    // Calculate Summary
                    const newSummary = assetList.reduce((acc, curr) => {
                        const val = Number(curr.value);
                        if (curr.type === 'INVESTMENT') acc.investment += val;
                        else if (curr.type === 'HOME') acc.home += val;
                        else if (curr.type === 'VEHICLE') acc.vehicle += val;
                        else acc.other += val;
                        acc.total += val; // Needs careful check if we want total here or just simple sum
                        return acc;
                    }, { investment: 0, home: 0, vehicle: 0, other: 0, total: 0 });

                    setSummary(newSummary);
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAssets();
    }, [user, refreshTrigger, supabase]);

    const getIcon = (type: string, value: number) => {
        // Distinguish based on value change vs item type
        // This logic might need refinement based on how we store "Type" vs "Description"
        // For now, we use the Category stored in DB
        if (type === 'HOME') return Building2;
        if (type === 'VEHICLE') return Car;
        if (type === 'INVESTMENT') return TrendingUp;
        return DollarSign;
    };

    const getOperationIcon = (value: number) => {
        return value >= 0 ? ArrowUpCircle : ArrowDownCircle;
    }

    return (
        <div className="fade-in pb-20 space-y-8">
            <Header
                title="Patrimônio Total"
                subtitle="Acompanhe a evolução da riqueza do casal"
                action={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-gradient-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} /> Registrar
                    </button>
                }
            />

            <div className="container mx-auto px-0 max-w-7xl">
                {/* Net Worth Overview */}
                <div className="mb-8">
                    <NetWorthCard key={refreshTrigger} />
                </div>

                {/* Category Summary Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <SummaryCard label="Investimentos" value={summary.investment} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                    <SummaryCard label="Imóveis" value={summary.home} icon={Building2} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                    <SummaryCard label="Veículos" value={summary.vehicle} icon={Car} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" />
                    <SummaryCard label="Outros" value={summary.other} icon={DollarSign} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
                </div>

                {/* History Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pl-2">
                        <TrendingUp className="text-emerald-500" size={20} />
                        Histórico de Movimentações
                    </h3>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="glass-card p-12 text-center border-dashed border-2 border-white/10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Nenhum registro encontrado</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                Comece adicionando seus bens, investimentos iniciais ou aportes mensais para acompanhar seu patrimônio.
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Adicionar Primeiro Registro
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assets.map((asset, index) => {
                                const CategoryIcon = getIcon(asset.type, asset.value);
                                const isPositive = asset.value >= 0;
                                const formattedValue = formatCurrency(Math.abs(asset.value));

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={asset.id}
                                        className="glass-card p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Icon Logic to distinguish Gain/Loss vs Item */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isPositive ? 'bg-white/5 border-white/10 text-white' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                                }`}>
                                                <CategoryIcon size={20} />
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-white">{asset.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span className="capitalize px-2 py-0.5 rounded-md bg-white/5">
                                                        {asset.type === 'INVESTMENT' ? 'Investimento' :
                                                            asset.type === 'HOME' ? 'Imóvel' :
                                                                asset.type === 'VEHICLE' ? 'Veículo' : 'Outro'}
                                                    </span>
                                                    <span>• {formatDate(asset.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`text-right`}>
                                                <div className={`font-bold text-lg ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isPositive ? '+ ' : '- '} {formattedValue}
                                                </div>
                                                <div className="text-xs text-gray-500 text-right uppercase font-medium">
                                                    {isPositive ? 'Entrada / Val.' : 'Saída / Desval.'}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {user && (
                <AddAssetModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                    user={user}
                />
            )}
        </div>
    );
}

function SummaryCard({ label, value, icon: Icon, color, bg, border }: any) {
    return (
        <div className={`glass-card p-4 border ${border} relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={40} className={color} />
            </div>
            <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
                <Icon size={16} />
            </div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xl font-bold text-white">{formatCurrency(value)}</p>
        </div>
    );
}
