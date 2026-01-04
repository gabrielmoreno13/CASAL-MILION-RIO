'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Shield, Users, Sparkles, TrendingUp } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-6 border border-emerald-100"
                    >
                        <Sparkles size={14} className="fill-emerald-200" />
                        <span>O #1 App Financeiro para Casais Inteligentes</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]"
                    >
                        Sua riqueza, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            planejada a dois.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Chega de planilhas e brigas. Sincronize contas, invista primeiro e veja o patrimônio do casal crescer com nosso método gamificado.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                Começar Grátis Agora
                                <ArrowRight size={20} />
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <Play size={20} className="fill-current" />
                            Ver como funciona
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-500 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-emerald-500" />
                            Segurança Bancária
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-blue-500" />
                            +10.000 Casais
                        </div>
                    </motion.div>
                </div>

                {/* VISUAL MOCKUP - DASHBOARD */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative mx-auto max-w-5xl perspective-1000"
                >
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
                        {/* Windows Controls */}
                        <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>

                        {/* Mock Content */}
                        <div className="p-1 min-h-[500px] bg-gray-50/50 relative">
                            {/* Abstract Representation of the Dashboard to avoid complex recreation here, or reuse the HTML from previous page but styled better */}
                            <div className="absolute inset-0 flex items-center justify-center bg-[url('/bg-pattern.png')] opacity-5"></div>

                            {/* Floating Cards simulating UI */}
                            <div className="absolute top-10 left-10 right-10 bottom-10 grid grid-cols-12 gap-6 p-4">

                                {/* Sidebar */}
                                <div className="hidden lg:block col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 h-full p-4 space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-2 w-full bg-gray-100 rounded-md" />
                                    ))}
                                </div>

                                {/* Main */}
                                <div className="col-span-12 lg:col-span-10 space-y-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 w-32 bg-gray-200 rounded-lg" />
                                        <div className="h-10 w-10 bg-emerald-100 rounded-full" />
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 transform hover:-translate-y-1 transition-transform">
                                                <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
                                                <div className="h-8 w-32 bg-gray-800 rounded mb-2" />
                                                <div className="h-4 w-16 bg-emerald-100 rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Big Chart Area */}
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 h-64 flex items-end justify-between gap-2">
                                        {[40, 60, 45, 80, 55, 70, 90, 65, 85, 50, 75, 95].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: 0.8 + (i * 0.05) }}
                                                className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm opacity-80"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Floating "Insight" Notification */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.5, type: 'spring' }}
                                    className="absolute -right-4 top-20 bg-white p-4 rounded-xl shadow-2xl border border-emerald-100 w-64 z-20"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Insight IA</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                                Vocês economizaram <span className="text-emerald-600">R$ 450</span> a mais este mês! 🚀
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
