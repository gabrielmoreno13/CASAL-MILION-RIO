import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 h-20">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.png"
                            alt="Casal Milionário"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-semibold text-lg tracking-tight hidden sm:block text-primary-900 dark:text-white">
                        Casal Milionário
                    </span>
                </Link>

                {/* Desktop Navigation - Absolute Center or Flex Center? 
            Let's choose Flex Center to avoid overlap issues mentioned by user.
        */}
                <div className="hidden md:flex items-center gap-10">
                    <NavLink href="#features">Funcionalidades</NavLink>
                    <NavLink href="#method">Método</NavLink>
                    <NavLink href="#pricing">Planos</NavLink>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block text-sm font-medium text-secondary hover:text-primary-900 transition-colors">
                        Entrar
                    </Link>
                    <Link href="/onboarding">
                        <Button variant="primary" className="h-10 px-6 text-sm shadow-lg shadow-emerald-500/20">
                            Começar
                        </Button>
                    </Link>
                </div>

            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
            {children}
        </Link>
    );
}
