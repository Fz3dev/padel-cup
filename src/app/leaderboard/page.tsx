"use client";
import { useState, useMemo } from 'react';
import { useTournament } from '@/hooks/useTournament';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn, Card } from '@/components/ui';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
    const [category, setCategory] = useState<'explorateur' | 'confirme'>('explorateur');
    const { matches, teams, loading } = useTournament();

    const rankings = useMemo(() => {
        // Filter teams by category
        const categoryTeams = teams.filter(t => t.category === category);

        // Calculate stats for each team
        const teamsWithStats = categoryTeams.map(team => {
            const teamMatches = matches.filter(m =>
                (m.team1Id === team.id || m.team2Id === team.id) && m.isFinished
            );

            let wins = 0;
            let gamesWon = 0;
            let gamesLost = 0;

            teamMatches.forEach(m => {
                const isTeam1 = m.team1Id === team.id;
                const myScore = isTeam1 ? m.scoreTeam1 : m.scoreTeam2;
                const oppScore = isTeam1 ? m.scoreTeam2 : m.scoreTeam1;

                if (myScore != null && oppScore != null) {
                    gamesWon += myScore;
                    gamesLost += oppScore;
                    if (myScore > oppScore) wins++;
                }
            });

            return {
                ...team,
                wins,
                gamesWon,
                gamesLost,
                diff: gamesWon - gamesLost,
                played: teamMatches.length
            };
        });

        // Sort: 1. Wins, 2. Diff, 3. Games Won
        return teamsWithStats.sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            if (b.diff !== a.diff) return b.diff - a.diff;
            return b.gamesWon - a.gamesWon;
        });
    }, [matches, teams, category]);

    if (loading) {
        return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-stoneo-900 pb-24">
            <Header title="Classement" subtitle="Mise à jour en temps réel" />

            <div className="p-4 sticky top-[60px] z-30 bg-stoneo-900/95 backdrop-blur-sm">
                <div className="flex p-1 bg-stoneo-800 rounded-xl border border-white/10">
                    <button
                        onClick={() => setCategory('explorateur')}
                        className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", category === 'explorateur' ? "bg-padel-yellow text-stoneo-900 shadow-lg" : "text-white/50 hover:text-white")}
                    >
                        Explorateurs
                    </button>
                    <button
                        onClick={() => setCategory('confirme')}
                        className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", category === 'confirme' ? "bg-padel-yellow text-stoneo-900 shadow-lg" : "text-white/50 hover:text-white")}
                    >
                        Confirmés
                    </button>
                </div>
            </div>

            <main className="px-4 space-y-3">
                <div className="flex text-xs text-white/30 px-4 mb-1 font-mono uppercase tracking-wider">
                    <div className="w-8">#</div>
                    <div className="flex-1">Équipe</div>
                    <div className="w-10 text-center">V</div>
                    <div className="w-10 text-center">Diff</div>
                </div>

                {rankings.map((team, index) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-transparent data-[rank='1']:border-l-padel-yellow data-[rank='2']:border-l-gray-400 data-[rank='3']:border-l-orange-700" data-rank={index + 1}>
                            <div className={cn("w-8 h-8 flex items-center justify-center rounded-full font-black text-sm",
                                index === 0 ? "bg-padel-yellow text-stoneo-900" :
                                    index === 1 ? "bg-gray-400 text-stoneo-900" :
                                        index === 2 ? "bg-orange-700 text-white" : "bg-stoneo-700 text-white/50"
                            )}>
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-white truncate">{team.name}</div>
                                <div className="text-xs text-white/50">Team {team.id} • {team.played} match{team.played > 1 ? 's' : ''}</div>
                            </div>

                            <div className="w-10 text-center font-bold text-padel-yellow text-lg">{team.wins}</div>
                            <div className="w-10 text-center font-mono text-white/70 text-sm">{team.diff > 0 ? '+' : ''}{team.diff}</div>
                        </Card>
                    </motion.div>
                ))}
            </main>
            <BottomNav />
        </div>
    );
}
