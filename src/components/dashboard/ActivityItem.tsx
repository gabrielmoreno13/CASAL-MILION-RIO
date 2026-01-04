'use client';

import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


interface ActivityItemProps {
    title: string;
    date: string;
    amount: number;
    logoUrl?: string;
    userName?: string;
    onClick?: () => void;
}

export function ActivityItem({ title, date, amount, logoUrl, userName, onClick }: ActivityItemProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(logoUrl?.startsWith('http') ? logoUrl : null);
    const [imgError, setImgError] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!logoUrl?.startsWith('http') && title && !imgError) {
            const lowerTitle = title.toLowerCase();
            const services = ['netflix', 'spotify', 'amazon', 'uber', 'ifood', 'apple', 'google', 'nubank', 'inter', 'itaú', 'itau', 'bradesco', 'santander'];

            const match = services.find(s => lowerTitle.includes(s));
            if (match) {
                let domain = `${match}.com`;
                if (match === 'nubank') domain = 'nubank.com.br';
                if (match === 'inter') domain = 'bancointer.com.br';
                if (match === 'itaú' || match === 'itau') domain = 'itau.com.br';
                if (match === 'ifood') domain = 'ifood.com.br';

                setImgSrc(`https://logo.clearbit.com/${domain}`);
            }
        }
    }, [title, logoUrl, imgError]);

    const displayAmount = typeof amount === 'number' ? `- ${formatCurrency(amount)}` : amount;

    return (
        <div
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            onClick={onClick}
        >
            <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-white/5 ${imgSrc && !imgError ? 'bg-white' : 'bg-gray-800 text-gray-400'}`}>
                    {imgSrc && !imgError ? (
                        <img
                            src={imgSrc}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span>{logoUrl && !logoUrl.startsWith('http') ? logoUrl : <ShoppingBag size={20} />}</span>
                    )}
                </div>
                {/* Status dot could go here */}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-semibold text-white truncate max-w-[70%]">{title}</h4>
                    <span className="font-bold text-white whitespace-nowrap">{displayAmount}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                        <span>{date}</span>
                        {userName && (
                            <>
                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px]">
                                        {userName.charAt(0)}
                                    </div>
                                    <span>{userName}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className={`p-2 rounded-lg transition-colors ${liked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
                    }}
                >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    );
}
