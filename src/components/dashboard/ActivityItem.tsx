'use client';

import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './ActivityItem.module.css';

interface ActivityItemProps {
    title: string;
    date: string;
    amount: string | number;
    logoUrl?: string;
    userName?: string; // Enhanced feature
}

export function ActivityItem({ title, date, amount, logoUrl, userName }: ActivityItemProps) {
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
        <div className={styles.activityItem}>
            <div className={styles.activityIcon} style={{
                backgroundColor: imgSrc && !imgError ? 'transparent' : '#F3F4F6',
                fontSize: imgSrc && !imgError ? 'inherit' : '1.2rem',
                overflow: 'hidden'
            }}>
                {imgSrc && !imgError ? (
                    <img
                        src={imgSrc}
                        alt={title}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span>{logoUrl && !logoUrl.startsWith('http') ? logoUrl : <ShoppingBag size={18} />}</span>
                )}
            </div>

            <div className={styles.activityContent}>
                <div className={styles.header}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.amount} style={{ color: '#111827' }}>
                        {displayAmount}
                    </div>
                </div>

                <div className={styles.meta}>
                    <span>{date}</span>
                    {userName && (
                        <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <span className={styles.userAvatar}>{userName.charAt(0)}</span>
                                <span>{userName}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className={`${styles.actionBtn} ${liked ? styles.active : ''}`}
                        onClick={() => setLiked(!liked)}
                    >
                        <Heart size={14} fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button className={styles.actionBtn}>
                        <MessageCircle size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
