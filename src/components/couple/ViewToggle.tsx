'use client';

import { useCouple } from '@/contexts/CoupleContext';
import { RefreshCw } from 'lucide-react';


export function ViewToggle() {
    const { viewMode, toggleViewMode, refreshCoupleData } = useCouple();

    return (
        <div className="flex items-center gap-3">
            <div
                className="relative bg-black/40 border border-white/10 rounded-full p-1 cursor-pointer w-48 h-10 flex items-center"
                onClick={toggleViewMode}
            >
                <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 ease-out select-none ${viewMode === 'couple' ? 'left-[50%]' : 'left-1'
                        }`}
                />

                <div className={`flex-1 text-center text-xs font-bold z-10 transition-colors duration-300 select-none ${viewMode === 'individual' ? 'text-black' : 'text-gray-400'}`}>
                    Individual
                </div>
                <div className={`flex-1 text-center text-xs font-bold z-10 transition-colors duration-300 select-none ${viewMode === 'couple' ? 'text-black' : 'text-gray-400'}`}>
                    Casal
                </div>
            </div>

            <button
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-all active:rotate-180 duration-500"
                onClick={(e) => {
                    e.stopPropagation();
                    refreshCoupleData();
                }}
            >
                <RefreshCw size={16} />
            </button>
        </div>
    );
}
