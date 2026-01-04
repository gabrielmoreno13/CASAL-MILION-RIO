import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'highlight';
    children: React.ReactNode;
}

export function Card({ variant = 'default', children, className, ...props }: CardProps) {
    const rootClassName = [
        styles.card,
        variant === 'highlight' ? styles.highlight : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={rootClassName} {...props}>
            {children}
        </div>
    );
}
