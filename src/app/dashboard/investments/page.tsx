'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Header } from '@/components/dashboard/Header';
import { Plus, Home, Car, TrendingUp, DollarSign } from 'lucide-react';
import { AddAssetModal } from '@/components/investments/AddAssetModal';
import styles from './Investments.module.css';
import { formatCurrency } from '@/lib/utils';

export default function InvestmentsPage() {
    const supabase = createClient();
    const [assets, setAssets] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    useEffect(() => {
        async function fetchAssets() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get Couple ID
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (member) {
                const { data } = await supabase.from('assets').select('*').eq('couple_id', member.couple_id);
                setAssets(data || []);
            }
        }
        fetchAssets();
    }, [refreshTrigger]);



    const getIcon = (type: string) => {
        switch (type) {
            case 'HOME': return <Home size={20} />;
            case 'VEHICLE': return <Car size={20} />;
            case 'INVESTMENT': return <TrendingUp size={20} />;
            default: return <DollarSign size={20} />;
        }
    };

    return (
        <div className="fade-in">
            <Header title="Investimentos & Bens" action={
                <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Novo Ativo
                </button>
            } />

            <div className={styles.container}>
                {/* Empty State */}
                {assets.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <TrendingUp size={48} color="var(--primary)" />
                        </div>
                        <h3>Construa seu Patrimônio</h3>
                        <p>Cadastre seus imóveis, veículos e investimentos para ver seu patrimônio crescer.</p>
                        <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(true)}>
                            Começar Agora
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {assets.map(asset => (
                            <div key={asset.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    {getIcon(asset.type)}
                                    <span>{asset.type === 'HOME' ? 'Imóvel' :
                                        asset.type === 'VEHICLE' ? 'Veículo' :
                                            asset.type === 'INVESTMENT' ? 'Investimento' : 'Outro'}</span>
                                </div>
                                <div className={styles.cardValue}>{formatCurrency(asset.value)}</div>
                                <div className={styles.cardName}>{asset.name}</div>
                            </div>
                        ))}
                    </div>
                )}
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
