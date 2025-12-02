"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Card } from '@/components/ui';
import { LogOut, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user?.email) {
                // Look up team assignment by email and join with teams
                const { data } = await supabase
                    .from('team_assignments')
                    .select('role, team_id, teams(*)')
                    .eq('email', user.email)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Déconnecté');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-stoneo-900 pb-24">
            <Header title="Mon Profil" />

            <main className="p-4 space-y-6">
                <Card className="flex flex-col items-center text-center py-8">
                    <div className="w-24 h-24 bg-stoneo-700 rounded-full flex items-center justify-center mb-4 border-4 border-stoneo-800 shadow-xl">
                        <User size={40} className="text-white/50" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-1">
                        {user?.email}
                    </h2>

                    {profile?.teams && (
                        <div className="mt-2 px-3 py-1 rounded-full bg-padel-yellow/10 text-padel-yellow text-sm font-bold border border-padel-yellow/20">
                            Team {profile.teams.id} - {profile.teams.name}
                        </div>
                    )}

                    {profile?.role === 'admin' && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-bold text-padel-green uppercase tracking-wider">
                            <Shield size={12} /> Administrateur
                        </div>
                    )}
                </Card>

                <section className="space-y-3">
                    {profile?.role === 'admin' && (
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => router.push('/admin')}
                        >
                            <Shield size={20} /> Accéder au Panel Admin
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        className="w-full justify-start"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} /> Se déconnecter
                    </Button>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}
