'use client';
import { motion } from 'framer-motion';

export const AnimatedCheckmark = ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={className}>
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            initial="hidden"
            animate="visible"
        >
            <motion.circle
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5 } }
                }}
            />
            <motion.path
                fill="none"
                stroke="#4ADE80"
                strokeWidth="4"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 1, transition: { delay: 0.5, duration: 0.5 } }
                }}
            />
        </motion.svg>
    </div>
);
