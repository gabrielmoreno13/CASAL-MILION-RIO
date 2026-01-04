'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { AddAssetModal } from '@/components/investments/AddAssetModal';
import { Plus, TrendingUp, ArrowDownRight, Building2, Car, DollarSign } from 'lucide-react';
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
                    setAssets(data || []);
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
        if (value < 0) return ArrowDownRight;
        if (type === 'HOME') return Building2;
        if (type === 'VEHICLE') return Car;
        if (type === 'INVESTMENT') return TrendingUp;
        return DollarSign;
    };

    const getColor = (type: string, value: number) => {
        if (value < 0) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (type === 'INVESTMENT') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    };

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
                    {/* Key forces re-render of NetWorthCard when refreshTrigger changes */}
                </div>

                {/* History Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
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
                                const Icon = getIcon(asset.type, asset.value);
                                const colorClass = getColor(asset.type, asset.value);
                                const isNegative = asset.value < 0;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={asset.id}
                                        className="glass-card p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{asset.name}</h4>
                                                <p className="text-xs text-gray-400 capitalize">
                                                    {asset.type === 'INVESTMENT' ? 'Investimento' :
                                                        asset.type === 'HOME' ? 'Imóvel' :
                                                            asset.type === 'VEHICLE' ? 'Veículo' : 'Outro'}
                                                    {' • '} {formatDate(asset.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-right font-bold ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {isNegative ? '-' : '+'} {formatCurrency(Math.abs(asset.value))}
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
