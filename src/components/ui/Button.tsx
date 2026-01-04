import React from 'react';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx'; // Using clsx for conditional classes if available, otherwise manual join

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'accent';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {

    const rootClassName = [
        styles.button,
        styles[variant],
        fullWidth ? styles.full : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={rootClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {children}
        </button>
    );
}
