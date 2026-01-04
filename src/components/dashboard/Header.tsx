'use client';

import { useState } from 'react';
import { Bell, Search, UserPlus, Heart, Flame } from 'lucide-react';
import { useCouple } from '@/contexts/CoupleContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useUser } from '@/contexts/UserContext';
import { InviteSpouseModal } from '../couple/InviteSpouseModal';
import { JoinCoupleModal } from '../couple/JoinCoupleModal';
import { StreakTooltip } from '../gamification/StreakTooltip';
import { StreakDetailsModal } from '../gamification/StreakDetailsModal';

interface HeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
    const { coupleId, partner1, partner2 } = useCouple();
    const { user } = useUser();
    const { currentStreak, longestStreak } = useGamification();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showStreakModal, setShowStreakModal] = useState(false);

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let partnerName = '';
    if (coupleId && user) {
        if (partner1?.id === user.id) partnerName = partner2?.name || 'Parceiro';
        else if (partner2?.id === user.id) partnerName = partner1?.name || 'Parceiro';
    }

    return (
        <>
            <header className="flex items-center justify-between py-6 px-1 mb-6 pl-14 md:pl-1">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
                    {subtitle ? (
                        <span className="text-sm text-gray-400">{subtitle}</span>
                    ) : (
                        <span className="text-sm text-gray-400 capitalize">{currentDate}</span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {action}

                    {/* Streak Indicator */}
                    <StreakTooltip currentStreak={currentStreak} nextMilestone={currentStreak < 7 ? 7 : (currentStreak < 30 ? 30 : currentStreak + 30)}>
                        <button
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all group relative"
                            onClick={() => setShowStreakModal(true)}
                        >
                            <Flame
                                size={20}
                                className={currentStreak > 0 ? "text-amber-500" : ""}
                                fill={currentStreak > 0 ? "#F59E0B" : "none"}
                            />
                            {currentStreak > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black border border-black">
                                    {currentStreak}
                                </span>
                            )}
                        </button>
                    </StreakTooltip>

                    {coupleId ? (
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                            <Heart size={16} className="text-pink-500 fill-pink-500/20" />
                            <span className="text-sm font-medium text-pink-200">
                                {partnerName}
                            </span>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="px-3 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 text-sm font-bold flex items-center gap-2 border border-emerald-500/20 transition-all shadow-lg shadow-emerald-500/10"
                            >
                                <Heart size={16} />
                                <span className="hidden md:inline">Convidar</span>
                            </button>
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="px-3 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 text-sm font-medium flex items-center gap-2 border border-white/10 transition-all"
                            >
                                <UserPlus size={16} />
                                <span className="hidden md:inline">Entrar</span>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Search size={20} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Bell size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <InviteSpouseModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
            <JoinCoupleModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />

            {showStreakModal && (
                <StreakDetailsModal
                    currentStreak={currentStreak}
                    longestStreak={longestStreak}
                    onClose={() => setShowStreakModal(false)}
                />
            )}
        </>
    );
}
