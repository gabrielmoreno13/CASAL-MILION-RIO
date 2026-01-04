'use client';

import React from 'react';
import { X, Calendar, DollarSign, Tag, User } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import styles from './TransactionModal.module.css';

interface Props {
    transaction: any;
    onClose: () => void;
}

export function TransactionModal({ transaction, onClose }: Props) {
    if (!transaction) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Detalhes da Transação</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.amountDisplay}>
                        <span className={styles.currency}>R$</span>
                        <span className={styles.value}>{Math.abs(transaction.amount).toFixed(2)}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <div className={styles.iconBox}><Tag size={16} /></div>
                        <div className={styles.infoText}>
                            <label>Descrição</label>
                            <p>{transaction.description}</p>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <div className={styles.iconBox}><Calendar size={16} /></div>
                        <div className={styles.infoText}>
                            <label>Data</label>
                            <p>{new Date(transaction.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <div className={styles.iconBox}><User size={16} /></div>
                        <div className={styles.infoText}>
                            <label>Usuário</label>
                            <p>Você</p>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.editBtn}>Editar</button>
                    <button className={styles.deleteBtn}>Excluir</button>
                </div>
            </div>
        </div>
    );
}
