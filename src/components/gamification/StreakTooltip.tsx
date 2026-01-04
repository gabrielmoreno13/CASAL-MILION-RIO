'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakTooltipProps {
    children: React.ReactNode;
    currentStreak: number;
    nextMilestone: number; // e.g., 7 days, 30 days
}

export function StreakTooltip({ children, currentStreak, nextMilestone }: StreakTooltipProps) {
    const daysLeft = nextMilestone - currentStreak;

    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="bg-[#1A1D24] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 text-sm max-w-xs z-[60] animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                        sideOffset={5}
                    >
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-500/10 p-2 rounded-lg shrink-0">
                                <Flame size={18} className="text-orange-500" fill="#F97316" />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-400 mb-1">Sequência de Investimentos</h4>
                                <p className="text-gray-300 leading-relaxed text-xs">
                                    Invista regularmente para manter sua chama acesa! 🔥
                                </p>
                                <div className="mt-2 text-xs font-semibold text-white bg-white/5 py-1 px-2 rounded inline-block">
                                    Faltam {daysLeft} dias para o próximo marco!
                                </div>
                            </div>
                        </div>
                        <Tooltip.Arrow className="fill-[#1A1D24]" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
