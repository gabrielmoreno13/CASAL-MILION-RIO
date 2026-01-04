'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';
import styles from './UpdateBalanceModal.module.css';

interface UpdateBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

export function UpdateBalanceModal({ isOpen, onClose, onSuccess, user }: UpdateBalanceModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [existingAssetId, setExistingAssetId] = useState<number | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen && user) {
            fetchCurrentBalance();
        }
    }, [isOpen, user]);

    const fetchCurrentBalance = async () => {
        try {
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (!member) return;

            const { data: assets } = await supabase
                .from('assets')
                .select('*')
                .eq('couple_id', member.couple_id)
                .in('name', ['Saldo Inicial', 'Saldo Atual'])
                .order('created_at', { ascending: false })
                .limit(1);

            if (assets && assets.length > 0) {
                // Should format initial value? Maybe just show string
                setAmount(formatCurrencyInput(assets[0].value.toString().replace('.', ',')));
                setExistingAssetId(assets[0].id);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatCurrencyInput(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: member } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (!member) throw new Error('Couple not found');

            const numericValue = parseCurrencyInput(amount);
            if (isNaN(numericValue)) throw new Error('Valor inválido');

            if (existingAssetId) {
                // Update existing
                const { error } = await supabase
                    .from('assets')
                    .update({ value: numericValue, name: 'Saldo Atual' })
                    .eq('id', existingAssetId);
                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('assets')
                    .insert({
                        couple_id: member.couple_id,
                        name: 'Saldo Atual',
                        type: 'INVESTMENT',
                        value: numericValue
                    });
                if (error) throw error;
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Erro ao atualizar saldo');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Atualizar Saldo</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Quanto dinheiro vocês têm hoje?</label>
                        <p className={styles.helperText}>Some todas as contas e investimentos líquidos.</p>
                        <input
                            type="text"
                            required
                            value={amount}
                            onChange={handleChange}
                            placeholder="R$ 0,00"
                            className={styles.input}
                            autoFocus
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Atualizar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
