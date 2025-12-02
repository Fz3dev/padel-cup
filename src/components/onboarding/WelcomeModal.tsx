"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { PartyPopper, User, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<{
        partner: string;
        category: string;
        teamName: string;
        teamId: string;
    } | null>(null);

    useEffect(() => {
        const checkWelcome = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user || user.user_metadata?.has_seen_welcome) return;

            // Get team assignment
            const { data: assignment } = await supabase
                .from('team_assignments')
                .select('team_id, teams(name, category)')
                .eq('email', user.email)
                .single();

            if (assignment?.teams) {
                // Get partner email from assignments
                const { data: members } = await supabase
                    .from('team_assignments')
                    .select('email')
                    .eq('team_id', assignment.team_id)
                    .neq('email', user.email);

                const partnerEmail = members?.[0]?.email;
                const team = assignment.teams as any;

                setData({
                    partner: partnerEmail || 'Inconnu',
                    category: team.category === 'explorateur' ? 'Explorateurs' : 'Confirmés',
                    teamName: team.name,
                    teamId: assignment.team_id
                });
                setIsOpen(true);

                // Fire confetti
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }, 500);
            }
        };

        checkWelcome();
    }, []);

    const handleClose = async () => {
        setIsOpen(false);
        await supabase.auth.updateUser({
            data: { has_seen_welcome: true }
        });
    };

    if (!isOpen || !data) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-stoneo-800 rounded-3xl p-8 max-w-sm w-full border border-padel-yellow/20 shadow-[0_0_50px_rgba(223,255,0,0.1)] text-center relative overflow-hidden"
                >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-padel-yellow/10 to-transparent" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-stoneo-700 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-stoneo-800 shadow-xl">
                            <span className="text-4xl">👋</span>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">
                            Bienvenue !
                        </h2>
                        <p className="text-white/60 mb-8">
                            Prêt pour la Stoneo Padel Cup ?
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="bg-stoneo-900/50 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Votre Équipe</div>
                                <div className="text-xl font-bold text-padel-yellow">Team {data.teamId}</div>
                                <div className="text-sm text-white/80">{data.teamName}</div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 bg-stoneo-900/50 p-3 rounded-xl border border-white/5">
                                    <User size={20} className="text-padel-green mx-auto mb-2" />
                                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Partenaire</div>
                                    <div className="text-xs font-bold text-white truncate" title={data.partner}>
                                        {data.partner.split('@')[0].replace('.', ' ')}
                                    </div>
                                </div>
                                <div className="flex-1 bg-stoneo-900/50 p-3 rounded-xl border border-white/5">
                                    <Trophy size={20} className="text-padel-green mx-auto mb-2" />
                                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Catégorie</div>
                                    <div className="text-xs font-bold text-white">
                                        {data.category}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleClose}
                            className="w-full py-6 text-lg font-bold shadow-lg shadow-padel-yellow/20"
                        >
                            C'est parti ! 🚀
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
