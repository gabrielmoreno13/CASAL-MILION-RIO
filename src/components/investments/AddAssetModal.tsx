'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Home, Car, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './AddAssetModal.module.css';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

const ASSET_TYPES = [
    { id: 'HOME', label: 'Imóvel', icon: Home },
    { id: 'VEHICLE', label: 'Veículo', icon: Car },
    { id: 'INVESTMENT', label: 'Investimento', icon: TrendingUp },
    { id: 'OTHER', label: 'Outro', icon: DollarSign },
];

export function AddAssetModal({ isOpen, onClose, onSuccess, user }: AddAssetModalProps) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('INVESTMENT');
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    if (!isOpen) return null;

    const parseBRL = (value: string) => {
        // Remove R$, spaces, and dots (thousand separators)
        const clean = value.replace(/[R$\s.]/g, '');
        // Replace comma with dot for decimal
        return parseFloat(clean.replace(',', '.'));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get Couple ID
            const { data: member, error: memberError } = await supabase
                .from('couple_members')
                .select('couple_id')
                .eq('profile_id', user.id)
                .single();

            if (memberError || !member) {
                console.error('Error finding couple:', memberError);
                throw new Error('Você precisa fazer parte de um casal para adicionar ativos.');
            }

            const numericValue = parseBRL(amount);

            if (isNaN(numericValue)) {
                throw new Error('Valor inválido.');
            }

            const { error } = await supabase.from('assets').insert({
                couple_id: member.couple_id,
                name,
                type,
                value: numericValue,
                liquidity: type === 'INVESTMENT' ? 'HIGH' : 'LOW'
            });

            if (error) throw error;

            onSuccess();
            onClose();
            setName('');
            setAmount('');
        } catch (error: any) {
            console.error('Full Error:', error);
            alert(error.message || 'Erro ao salvar ativo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Novo Ativo</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.typeGrid}>
                        {ASSET_TYPES.map((t) => (
                            <div
                                key={t.id}
                                className={`${styles.typeCard} ${type === t.id ? styles.activeType : ''}`}
                                onClick={() => setType(t.id)}
                            >
                                <t.icon size={24} />
                                <span>{t.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Nome do Ativo (Ex: Apartamento Centro)</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Descrição curta"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Valor Atual (R$)</label>
                        <input
                            type="text"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Adicionar Ativo'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
