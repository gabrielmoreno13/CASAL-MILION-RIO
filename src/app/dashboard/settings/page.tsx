'use client';

import { Header } from '@/components/dashboard/Header';


export default function SettingsPage() {
    return (
        <div className="fade-in pb-20">
            <Header title="Configurações" />

            <div className="max-w-4xl mx-auto space-y-8 p-6">
                {/* Profile Section */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Perfil
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Seu Nome"
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-not-allowed opacity-60"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-not-allowed opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* App Preferences */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Preferências do App
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="font-medium text-gray-200">Modo Escuro</span>
                            <div className="w-12 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 relative">
                                <div className="absolute right-1 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="font-medium text-gray-200">Gamificação (Nível/XP)</span>
                            <div className="w-12 h-6 rounded-full bg-emerald-500 relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="font-medium text-gray-200">Visão de Casal Ativa</span>
                            <div className="w-12 h-6 rounded-full bg-emerald-500 relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="font-medium text-gray-200">Notificações Inteligentes (IA)</span>
                            <div className="w-12 h-6 rounded-full bg-emerald-500 relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-sm text-gray-600 font-mono">Versão 3.0.0 (V3 Update)</p>
                </div>
            </div>
        </div>
    );
}
