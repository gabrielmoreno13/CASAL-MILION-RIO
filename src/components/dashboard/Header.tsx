'use client';

import { Bell, Search } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    action?: React.ReactNode;
}

export function Header({ title, action }: HeaderProps) {
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.pageTitle}>{title}</h1>
                <span className={styles.date}>{currentDate}</span>
            </div>

            <div className={styles.actions}>
                {action}
                <button className={styles.actionBtn}>
                    <Search size={20} />
                </button>
                <button className={styles.actionBtn}>
                    <Bell size={20} />
                </button>
            </div>
        </header>
    );
}
