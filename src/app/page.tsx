"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card } from '@/components/ui';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Email validation
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@(stoneo\.fr|avest\.fr)$/.test(email);
        if (!isValidEmail) {
            toast.error('Seules les adresses @stoneo.fr ou @avest.fr sont autorisées.');
            return;
        }

        if (resendCooldown > 0) return;

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (error) throw error;

            setSent(true);
            setResendCooldown(60); // Start 60s cooldown
            toast.success('Lien de connexion envoyé !');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-stoneo-900 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-stoneo-800 p-8 rounded-2xl border border-white/10"
                >
                    <div className="w-16 h-16 bg-padel-green/20 text-padel-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vérifiez vos emails</h2>
                    <p className="text-white/50 mb-6">
                        Un lien magique a été envoyé à <strong>{email}</strong>.<br />
                        Cliquez dessus pour vous connecter automatiquement.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button variant="ghost" onClick={() => setSent(false)}>
                            Retour
                        </Button>

                        <button
                            onClick={() => handleLogin()}
                            disabled={loading || resendCooldown > 0}
                            className="text-xs text-white/30 hover:text-white/50 underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : (
                                resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : "Je n'ai rien reçu, renvoyer l'email"
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stoneo-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-padel-yellow/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-padel-green/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center items-center gap-8 mb-8 h-16">
                        <div className="relative w-40 h-full">
                            <Image src="/logos/stoneo.png" alt="Stoneo" fill className="object-contain" />
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="relative w-40 h-full flex items-center justify-center">
                            <Image
                                src="/logos/avest.png"
                                alt="Avest"
                                fill
                                className="object-contain scale-[1.1]"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black font-outfit text-white mb-2 tracking-tight">
                        STONEO <span className="text-padel-green">PADEL</span> CUP
                    </h1>
                    <p className="text-white/50 text-sm uppercase tracking-widest">by AVEST</p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-stoneo-800/50 border-white/10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-white/70 uppercase mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                <input
                                    type="email"
                                    placeholder="prenom.nom@avest.fr"
                                    required
                                    className="w-full bg-stoneo-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-padel-green focus:outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-padel-yellow mt-2 font-medium">
                                ⚠️ Utilisez impérativement votre adresse @stoneo.fr ou @avest.fr
                            </p>
                        </div>

                        <Button disabled={loading} className="w-full py-4 text-lg group bg-padel-green text-stoneo-900 hover:bg-green-400">
                            {loading ? <Loader2 className="animate-spin" /> : <>Se connecter <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/30">
                            Pas de mot de passe requis. Un lien sécurisé vous sera envoyé.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
