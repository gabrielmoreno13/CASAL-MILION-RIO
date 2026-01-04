'use client';

import { Header } from '@/components/dashboard/Header';
import styles from './Settings.module.css';

export default function SettingsPage() {
    return (
        <div className="fade-in">
            <Header title="Configurações" action={null} />

            <div className={styles.container}>
                <div className={styles.section}>
                    <h3>Perfil</h3>
                    <div className={styles.row}>
                        <label>Nome Completo</label>
                        <input type="text" placeholder="Seu Nome" disabled className={styles.input} />
                    </div>
                    <div className={styles.row}>
                        <label>Email</label>
                        <input type="email" placeholder="seu@email.com" disabled className={styles.input} />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Preferências</h3>
                    <div className={styles.toggleRow}>
                        <span>Modo Escuro (Em breve)</span>
                        <div className={styles.toggleStub}></div>
                    </div>
                </div>

                <p className={styles.version}>Versão 2.0.0 (Synetica Build)</p>
            </div>
        </div>
    );
}
