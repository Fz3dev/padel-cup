"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useTournament } from '@/hooks/useTournament';
import { MatchCard } from '@/components/match/MatchCard';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { motion } from 'framer-motion';
import { Team } from '@/types';

export default function Dashboard() {
    const { matches, teams, loading: tournamentLoading } = useTournament();
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [myTeam, setMyTeam] = useState<Team | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('team_id')
                    .eq('id', user.id)
                    .single();

                if (data?.team_id) {
                    setMyTeamId(data.team_id);
                }
            }
            setLoadingProfile(false);
        };
        getProfile();
    }, []);

    useEffect(() => {
        if (myTeamId && teams.length > 0) {
            setMyTeam(teams.find(t => t.id === myTeamId) || null);
        }
    }, [myTeamId, teams]);

    const loading = tournamentLoading || loadingProfile;

    const myMatches = matches.filter(m => m.team1Id === myTeamId || m.team2Id === myTeamId)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const nextMatch = myMatches.find(m => !m.isFinished);

    if (loading) return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Chargement...</div>;

    if (!myTeamId) return (
        <div className="min-h-screen bg-stoneo-900 flex flex-col items-center justify-center text-white p-6 text-center">
            <p className="mb-4">Vous n'êtes assigné à aucune équipe.</p>
            <p className="text-sm text-white/50 mb-8">Contactez l'organisateur.</p>

            {/* Debug Info */}
            <div className="bg-black/30 p-4 rounded-lg text-xs text-left font-mono text-white/30 max-w-xs overflow-hidden">
                <p>Debug Info:</p>
                <p>Loading: {loading ? 'true' : 'false'}</p>
                <p>TeamID: {myTeamId || 'null'}</p>
            </div>

            <BottomNav />
        </div>
    );

    return (
        <div className="min-h-screen bg-stoneo-900 pb-24">
            <Header title="Mon Planning" subtitle={`Team ${myTeam?.id || ''} - ${myTeam?.name || ''}`} />

            <main className="p-4 space-y-6">
                {/* Next Match Highlight */}
                {nextMatch && (
                    <section>
                        <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Prochain Match</h2>
                        <MatchCard
                            match={nextMatch}
                            team1={teams.find(t => t.id === nextMatch.team1Id)!}
                            team2={teams.find(t => t.id === nextMatch.team2Id)!}
                        />
                    </section>
                )}

                {/* All Matches */}
                <section>
                    <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Tous mes matchs</h2>
                    <div className="space-y-3">
                        {myMatches.map((match, i) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <MatchCard
                                    match={match}
                                    team1={teams.find(t => t.id === match.team1Id)!}
                                    team2={teams.find(t => t.id === match.team2Id)!}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}
