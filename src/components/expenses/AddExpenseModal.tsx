import { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, Calculator } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { EquitySplitter } from '@/lib/wealth/EquitySplitter'; // Verify path
import styles from './AddExpenseModal.module.css';

const POPULAR_BRANDS = [
    { name: 'Netflix', emoji: '🍿' },
    { name: 'Spotify', emoji: '🎧' },
    { name: 'Uber', emoji: '🚗' },
    { name: 'iFood', emoji: '🍔' },
    { name: 'Amazon', emoji: '📦' },
    { name: 'Apple', emoji: '🍎' },
    { name: 'Mercado Livre', emoji: '🤝' },
    { name: 'Nubank', emoji: '💜' },
    { name: 'Smart Fit', emoji: '💪' },
    { name: 'Outro', emoji: '💸' }
];

export function AddExpenseModal({ isOpen, onClose, onSuccess, user }: any) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Equity Split State
    const [splitData, setSplitData] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        if (isOpen && user) {
            fetchIncomes();
        }
    }, [isOpen, user]);

    // Recalculate split when amount changes
    useEffect(() => {
        if (splitData && amount) {
            const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
            const split = EquitySplitter.splitExpense(numericAmount, splitData.userIncome, splitData.partnerIncome);
            setSplitData((prev: any) => ({ ...prev, ...split }));
        }
    }, [amount]);

    const fetchIncomes = async () => {
        // 1. Get My Income
        const { data: myProfile } = await supabase.from('profiles').select('income').eq('id', user.id).single();

        // 2. Get Partner's Income
        const { data: member } = await supabase.from('couple_members').select('couple_id').eq('profile_id', user.id).limit(1).single();

        if (member) {
            // Find the OTHER member of the couple
            const { data: partnerMember } = await supabase
                .from('couple_members')
                .select('profile_id')
                .eq('couple_id', member.couple_id)
                .neq('profile_id', user.id)
                .limit(1)
                .single();

            if (partnerMember) {
                const { data: partnerProfile } = await supabase.from('profiles').select('income').eq('id', partnerMember.profile_id).single();

                setSplitData({
                    userIncome: myProfile?.income || 0,
                    partnerIncome: partnerProfile?.income || 0,
                    userShare: 0,
                    partnerShare: 0,
                    userPercentage: 50,
                    partnerPercentage: 50
                });
            }
        }
    };

    if (!isOpen) return null;

    const handleBrandSelect = (brand: any) => {
        setLogoUrl(brand.emoji);
        setDescription(brand.name);
        setSelectedBrand(brand.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get Couple ID
            const { data: members, error: memberError } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .limit(1);

            if (memberError) {
                console.error('Member fetch error:', memberError);
                throw new Error(`Erro ao buscar vínculo: ${memberError.message} (User: ${user.id})`);
            }

            const member = members?.[0];

            if (!member) throw new Error(`Você não está em um casal. (User: ${user.id})`);

            // Use the calculated split ratio for the expense metadata if needed (not in MVP schema yet, but prepared)
            const { error } = await supabase.from('expenses').insert({
                couple_id: member.couple_id,
                profile_id: user.id,
                description,
                amount: parseFloat(amount.replace(/[^0-9.]/g, '')),
                category: selectedBrand ? 'Assinaturas/Serviços' : 'Geral',
                logo_url: logoUrl,
                date
                // Future: split_ratio_user: splitData.userPercentage
            });

            if (error) throw error;

            onSuccess();
            onClose();
            // Reset form
            setDescription('');
            setAmount('');
            setLogoUrl(null);
            setSplitData(null);
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao salvar despesa: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Nova Despesa</h2>
                    <p className={styles.subtitle}>Selecione uma marca ou digite manualmente.</p>
                </div>

                {/* Brand Grid */}
                <div className={styles.brandsGrid}>
                    {POPULAR_BRANDS.map((brand) => (
                        <button
                            key={brand.name}
                            className={styles.brandBtn}
                            onClick={() => handleBrandSelect(brand)}
                            type="button"
                        >
                            <div className={styles.brandIcon} style={{
                                borderColor: selectedBrand === brand.name ? 'var(--primary)' : '',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {brand.emoji}
                            </div>
                            <span className={styles.brandName}>{brand.name}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Descrição</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Ex: Almoço, Uber, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Valor (R$)</label>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            step="0.01"
                        />
                    </div>

                    {/* Equity Split Visualization */}
                    {splitData && amount && parseFloat(amount) > 0 && (
                        <div className={styles.splitBox} style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '12px', border: '1px solid #BBF7D0', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#166534' }}>
                                <Calculator size={16} /> Divisão Justa (Baseada na Renda)
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <div>
                                    <span style={{ color: '#15803D' }}>Você ({splitData.userPercentage}%)</span>
                                    <div style={{ fontWeight: 700 }}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(splitData.userShare)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ color: '#15803D' }}>Amor ({splitData.partnerPercentage}%)</span>
                                    <div style={{ fontWeight: 700 }}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(splitData.partnerShare)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Data</label>
                        <input
                            type="date"
                            className={styles.input}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Adicionar Despesa'}
                    </button>
                </form>
            </div>
        </div>
    );
}
