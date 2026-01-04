'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Wallet, TrendingUp, Target, Settings, LogOut, Sparkles, Bot } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Visão Geral', href: '/dashboard' },
    { icon: Wallet, label: 'Carteira', href: '/dashboard/wallet' },
    { icon: TrendingUp, label: 'Investimentos', href: '/dashboard/investments' },
    { icon: Target, label: 'Metas', href: '/dashboard/goals' },
    { icon: Bot, label: 'Consultor IA', href: '/dashboard/advisor' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/settings' },
];

export function Sidebar({ user: initialUser }: { user: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="Casal Milionário"
                    width={180}
                    height={50}
                    className="object-contain" // Tailwind class if needed or keep styles
                    style={{ maxHeight: '50px', width: 'auto' }}
                />
            </div>

            <nav className={styles.nav}>
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon className={styles.navIcon} />
                            {item.label}
                        </Link>
                    );
                })}
                <Link href="/simulator" className={`${styles.navItem} ${pathname === '/simulator' ? styles.active : ''}`}>
                    <TrendingUp size={20} />
                    <span>Simulador FIRE</span>
                </Link>

            </nav>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>
                    {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>{user?.user_metadata?.full_name || 'Usuário'}</div>
                    <div className={styles.userRole}>Plano Premium</div>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn} title="Sair">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
}
