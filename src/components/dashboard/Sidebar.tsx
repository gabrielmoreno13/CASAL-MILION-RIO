'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Wallet, TrendingUp, Target, Settings, LogOut, Sparkles, Bot, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WhatsAppModal } from '@/components/dashboard/WhatsAppModal';

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
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

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
        <>
            <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0F1115] border-r border-white/5 flex flex-col z-40">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-lg">
                        $
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Casal Milionário
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                        <Link href="/simulator" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${pathname === '/simulator' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}>
                            <TrendingUp size={20} />
                            <span>Simulador FIRE</span>
                        </Link>

                        <button
                            onClick={() => setShowWhatsAppModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-green-400 hover:bg-green-500/10 hover:text-green-300 border border-green-500/20"
                        >
                            <MessageCircle size={20} />
                            <span>Conectar WhatsApp</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg">
                            {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-white truncate text-sm">
                                {user?.user_metadata?.full_name || 'Usuário'}
                            </div>
                            <div className="text-xs text-emerald-400">Plano Premium</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                            title="Sair"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <WhatsAppModal isOpen={showWhatsAppModal} onClose={() => setShowWhatsAppModal(false)} />
        </>
    );
}
