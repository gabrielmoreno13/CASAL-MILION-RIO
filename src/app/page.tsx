'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  LayoutDashboard,
  PieChart,
  Bot
} from 'lucide-react';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black">
          $
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Casal Milionário
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#features" className="hover:text-white transition-colors">Recursos</a>
        <a href="#advisor" className="hover:text-white transition-colors">IA Advisor</a>
        <a href="#testimonials" className="hover:text-white transition-colors">Depoimentos</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Entrar
        </Link>
        <Link href="/register">
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 flex items-center gap-2">
            Começar
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Novo: Consultor IA Disponível
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-tight">
          Enriqueçam <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Juntos e Rápido.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          O primeiro sistema operacional financeiro feito para casais.
          Organize contas, alinhe metas e construa patrimônio com a ajuda de Inteligência Artificial.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <button className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] flex items-center gap-2">
              Criar Conta Grátis
              <ArrowRight size={20} />
            </button>
          </Link>
          <button className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-lg transition-all flex items-center gap-2">
            Ver Demonstração
          </button>
        </div>
      </motion.div>

      {/* Dashboard Mockup Showcase */}
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0, rotateX: 20, y: 100 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-20 relative w-full max-w-6xl z-20 perspective-1000"
      >
        <div className="relative bg-[#0F1115] border border-white/10 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-900/20 aspect-[16/9] group transform transition-transform hover:scale-[1.01] duration-500">
          {/* Fake UI Header */}
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="ml-4 w-64 h-6 rounded-lg bg-white/5" />
          </div>

          {/* Fake UI Body */}
          <div className="p-6 md:p-8 flex gap-8 h-full">
            {/* Sidebar */}
            <div className="w-64 hidden md:flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-full rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/5 p-4 flex flex-col justify-between group-hover:border-emerald-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20" />
                    <div className="space-y-2">
                      <div className="w-20 h-4 rounded bg-white/10" />
                      <div className="w-32 h-6 rounded bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/5 p-6 flex flex-col gap-4">
                <div className="w-48 h-6 rounded bg-white/10" />
                <div className="flex items-end gap-2 h-40">
                  {[40, 60, 45, 80, 55, 75, 90, 65, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500 transition-colors duration-300" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards (Decorations) */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 w-64 p-4 rounded-xl bg-[#1A1D21] border border-white/10 shadow-xl hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <Bot size={20} className="text-black" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">Mestre Financeiro</div>
                <div className="text-emerald-400 text-xs">Online Agora</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white/5 text-gray-400 text-xs">
                Sugiro aumentar aporte para R$ 1.200 este mês.
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <LayoutDashboard size={24} />,
      title: "Visão 360º",
      description: "Conecte suas contas e cartões em um só lugar. Veja para onde vai cada centavo do casal."
    },
    {
      icon: <Users size={24} />,
      title: "Modo Casal",
      description: "Sincronize duas contas com privacidade. Escolha o que compartilhar e o que manter privado."
    },
    {
      icon: <Bot size={24} />,
      title: "Consultor IA",
      description: "Um Mestre Financeiro 24h que analisa seus gastos e dá dicas personalizadas para economizar."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Projeções FIRE",
      description: "Saiba exatamente quando vocês atingirão a liberdade financeira com base nos aportes atuais."
    },
    {
      icon: <PieChart size={24} />,
      title: "Metas Inteligentes",
      description: "Crie potes para viagens, casa própria e aposentadoria. Acompanhe o progresso visualmente."
    },
    {
      icon: <Shield size={24} />,
      title: "Segurança Total",
      description: "Seus dados criptografados e protegidos. Privacidade é nossa prioridade absoluta."
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Tudo que vocês precisam para <span className="text-emerald-400">prosperar.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ferramentas profissionais simplificadas para a vida a dois.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AdvisorSection = () => (
  <section id="advisor" className="py-32 relative overflow-hidden bg-[#0F1115]">
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* Text Content */}
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-6">
            <Bot size={14} />
            Inteligência Artificial Nativa
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Seu <span className="text-emerald-400">Diretor Financeiro</span> Pessoal, disponível 24/7.
          </h2>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Esqueça planilhas complicadas. Converse com o Mestre de Finanças para tomar decisões inteligentes em tempo real. Ele analisa seus dados e sugere onde cortar, onde investir e como atingir suas metas mais rápido.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              "Análise de gastos em tempo real",
              "Sugestões de investimento personalizadas",
              "Alertas de orçamento estourado",
              "Tira-dúvidas sobre dívidas e juros"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/register">
            <button className="h-14 px-8 rounded-full bg-white text-black font-bold text-base transition-all hover:bg-gray-200">
              Falar com o Mestre
            </button>
          </Link>
        </div>

        {/* Chat Simulation Visual */}
        <div className="flex-1 w-full max-w-lg">
          <div className="relative bg-[#1A1D21] border border-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                <Bot size={24} className="text-black" />
              </div>
              <div>
                <div className="text-white font-bold">Mestre Financeiro</div>
                <div className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </div>
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-gray-300 text-sm leading-relaxed border border-white/5">
                  Olá! Notei que vocês gastaram R$ 400 em delivery essa semana. Se reduzirem pela metade, isso vira R$ 10.000 em 5 anos investidos a 10% a.a. 🚀
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  <Users size={16} />
                </div>
                <div className="bg-emerald-600 p-4 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed shadow-lg shadow-emerald-900/20">
                  Uau! Não tinha percebido. Pode criar uma meta de redução pra gente?
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-gray-300 text-sm leading-relaxed border border-white/5 flex gap-2 items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-32 relative overflow-hidden bg-emerald-900/20">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />

    <div className="container mx-auto px-6 text-center relative z-10">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
        Prontos para o <br />
        <span className="text-emerald-400">Próximo Nível?</span>
      </h2>
      <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
        Junte-se a milhares de casais que estão construindo patrimônio de forma inteligente.
      </p>
      <Link href="/register">
        <button className="h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl transition-all hover:scale-105 shadow-[0_0_50px_rgba(52,211,153,0.3)]">
          Começar Gratuitamente
        </button>
      </Link>
      <p className="mt-6 text-sm text-gray-500">Sem cartão de crédito necessário • Cancelamento a qualquer momento</p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-black py-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-500 border border-emerald-500/20">
          $
        </div>
        <span className="text-lg font-bold text-gray-300">
          Casal Milionário
        </span>
      </div>

      <div className="text-gray-500 text-sm">
        © 2024 Casal Milionário. Todos os direitos reservados.
      </div>

      <div className="flex gap-6">
        <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Instagram</a>
        <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Twitter</a>
        <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">LinkedIn</a>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

