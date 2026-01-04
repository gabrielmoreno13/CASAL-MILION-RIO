'use client';

import { TrendingUp, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                <TrendingUp size={18} />
                            </div>
                            <span className="font-bold text-xl text-white">Casal Milionário</span>
                        </div>
                        <p className="text-gray-400 max-w-xs leading-relaxed">
                            A plataforma definitiva para casais enriquecerem juntos. Planejamento, investimento e gamificação em um só lugar.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Plataforma</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="hover:text-emerald-400 transition-colors">Funcionalidades</a></li>
                            <li><a href="#method" className="hover:text-emerald-400 transition-colors">Método</a></li>
                            <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Preços</a></li>
                            <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacidade</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; 2024 Casal Milionário. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
