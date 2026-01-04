'use client';

import { motion } from 'framer-motion';

const LOGOS = [
    { name: 'FinanceWeekly', opacity: 'opacity-40' },
    { name: 'CoupleGoals', opacity: 'opacity-50' },
    { name: 'InvestSmart', opacity: 'opacity-40' },
    { name: 'TechCrunch', opacity: 'opacity-30' },
    { name: 'Exame', opacity: 'opacity-40' },
];

export function SocialProof() {
    return (
        <section className="py-10 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
                    Confiam no Casal Milionário
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {LOGOS.map((logo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600 grayscale hover:grayscale-0 transition-all duration-300 cursor-default`}
                        >
                            {/* Placeholder text logos since we don't have SVGs */}
                            {logo.name}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
