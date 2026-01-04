// app/page.tsx
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { SocialProof } from '@/components/landing/SocialProof';
import { Problem } from '@/components/landing/Problem';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Features />

        {/* Simulator Teaser / Callout Section */}
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Quando vocês atingirão o <span className="text-emerald-400">Primeiro Milhão?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Use nosso simulador avançado com projeções de juros compostos e aportes mensais para descobrir a data exata da sua liberdade financeira.
            </p>
            <div className="flex justify-center">
              <Link href="/register">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2">
                  Simular Agora
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Testimonials />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

