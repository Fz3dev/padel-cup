import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <motion.div
        whileHover={onClick ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        className={cn("glass-panel rounded-2xl p-4 md:p-6", className)}
    >
        {children}
    </motion.div>
);

export const Button = ({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) => {
    const variants = {
        primary: "bg-padel-yellow text-stoneo-900 font-bold hover:bg-yellow-300 shadow-[0_0_15px_rgba(223,255,0,0.3)]",
        secondary: "bg-stoneo-700 text-white hover:bg-stoneo-600 border border-white/10",
        ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30",
    };

    return (
        <button
            className={cn("px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95", variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80", className)}>
        {children}
    </span>
);
