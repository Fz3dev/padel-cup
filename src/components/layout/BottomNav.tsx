"use client";
import { Home, Trophy, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui';

export const BottomNav = () => {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', icon: Home, label: 'Accueil' },
        { href: '/matches', icon: Calendar, label: 'Matchs' },
        { href: '/leaderboard', icon: Trophy, label: 'Classement' },
        { href: '/profile', icon: User, label: 'Profil' },
    ];

    if (pathname === '/') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-stoneo-900/90 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center p-2">
                {links.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link key={href} href={href} className="flex flex-col items-center p-2 w-full">
                            <div className={cn("p-1.5 rounded-xl transition-all", isActive ? "bg-padel-yellow text-stoneo-900" : "text-white/50")}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-padel-yellow" : "text-white/50")}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
