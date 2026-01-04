import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
    const generatedId = id || Math.random().toString(36).substr(2, 9);

    return (
        <div className={styles.wrapper}>
            {label && <label htmlFor={generatedId} className={styles.label}>{label}</label>}
            <input
                id={generatedId}
                className={`${styles.input} ${className || ''}`}
                {...props}
            />
            {error && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</span>}
        </div>
    );
}
