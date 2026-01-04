'use client';

import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Target, X } from 'lucide-react';
import styles from './FabMenu.module.css';

export function FabMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleAction = (action: string) => {
        console.log('Action:', action);
        setIsOpen(false);
        // Implement navigation or modal opening logic here
    };

    return (
        <div className={styles.fabContainer}>
            {isOpen && (
                <div className={styles.menuItems}>
                    <div className={styles.menuItem}>
                        <span className={styles.label}>Nova Meta</span>
                        <button
                            className={styles.itemBtn}
                            style={{ background: '#F59E0B' }}
                            onClick={() => handleAction('GOAL')}
                        >
                            <Target size={20} />
                        </button>
                    </div>

                    <div className={styles.menuItem}>
                        <span className={styles.label}>Receita</span>
                        <button
                            className={styles.itemBtn}
                            style={{ background: '#10B981' }}
                            onClick={() => handleAction('INCOME')}
                        >
                            <TrendingUp size={20} />
                        </button>
                    </div>

                    <div className={styles.menuItem}>
                        <span className={styles.label}>Despesa</span>
                        <button
                            className={styles.itemBtn}
                            style={{ background: '#EF4444' }}
                            onClick={() => handleAction('EXPENSE')}
                        >
                            <TrendingDown size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`${styles.mainBtn} ${isOpen ? styles.active : ''}`}
                onClick={toggleOpen}
            >
                <Plus size={32} />
            </button>
        </div>
    );
}
