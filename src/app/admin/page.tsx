"use client";
import { useState, useEffect } from 'react';
import { useTournament } from '@/hooks/useTournament';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button, Card, Badge, cn } from '@/components/ui';
import { Users, Calendar, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'players' | 'matches';

interface PlayerData {
    id: string;
    email: string;
    team_id: string | null;
    role: string;
}

export default function AdminPage() {
    const { matches, teams, loading } = useTournament();
    const [activeTab, setActiveTab] = useState<TabType>('players');
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [editingPlayer, setEditingPlayer] = useState<PlayerData | null>(null);
    const [editEmail, setEditEmail] = useState('');
    const [editTeam, setEditTeam] = useState('');
    const [editRole, setEditRole] = useState('');

    // Fetch players
    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        setLoadingPlayers(true);
        try {
            const { data, error } = await supabase
                .from('team_assignments')
                .select('*')
                .order('email');

            if (error) throw error;
            setPlayers(data || []);
        } catch (error: any) {
            console.error('Error fetching players:', error);
            toast.error('Erreur lors du chargement des joueurs');
        } finally {
            setLoadingPlayers(false);
        }
    };

    const handleEditPlayer = (player: PlayerData) => {
        setEditingPlayer(player);
        setEditEmail(player.email);
        setEditTeam(player.team_id || '');
        setEditRole(player.role);
    };

    const handleSavePlayer = async () => {
        if (!editingPlayer) return;

        try {
            const { error } = await supabase
                .from('team_assignments')
                .update({
                    email: editEmail,
                    team_id: editTeam || null,
                    role: editRole
                })
                .eq('id', editingPlayer.id);

            if (error) throw error;

            toast.success('Joueur modifié avec succès !');
            setEditingPlayer(null);
            fetchPlayers();
        } catch (error: any) {
            console.error('Error updating player:', error);
            toast.error('Erreur lors de la modification');
        }
    };

    const handleDeletePlayer = async (playerId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return;

        try {
            const { error } = await supabase
                .from('team_assignments')
                .delete()
                .eq('id', playerId);

            if (error) throw error;

            toast.success('Joueur supprimé');
            fetchPlayers();
        } catch (error: any) {
            console.error('Error deleting player:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleResetAllScores = async () => {
        if (!confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser TOUS les scores du tournoi ? Cette action est irréversible !')) return;

        try {
            const { error } = await supabase
                .from('matches')
                .update({
                    score_team1: null,
                    score_team2: null,
                    is_finished: false,
                    submitted_by: null
                })
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

            if (error) throw error;

            toast.success('🔄 Tous les scores ont été réinitialisés !');
            // Force re-fetch to update UI
            window.location.reload();
        } catch (error: any) {
            console.error('Error resetting scores:', error);
            toast.error('Erreur lors de la réinitialisation');
        }
    };

    const finishedMatches = matches.filter(m => m.isFinished);
    const pendingMatches = matches.filter(m => !m.isFinished);

    return (
        <div className="min-h-screen bg-stoneo-900 pb-24">
            <Header title="Admin Panel" subtitle="Gestion du tournoi" />

            <div className="p-4 sticky top-[60px] z-30 bg-stoneo-900/95 backdrop-blur-sm">
                <div className="flex p-1 bg-stoneo-800 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('players')}
                        className={cn(
                            "flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                            activeTab === 'players' ? "bg-padel-yellow text-stoneo-900 shadow-lg" : "text-white/50 hover:text-white"
                        )}
                    >
                        <Users size={18} />
                        Joueurs
                    </button>
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={cn(
                            "flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                            activeTab === 'matches' ? "bg-padel-yellow text-stoneo-900 shadow-lg" : "text-white/50 hover:text-white"
                        )}
                    >
                        <Calendar size={18} />
                        Matchs
                    </button>
                </div>
            </div>

            <main className="px-4 space-y-4">
                {/* Players Tab */}
                {activeTab === 'players' && (
                    <div className="space-y-3">
                        {loadingPlayers ? (
                            <div className="text-center text-white/50 py-10">Chargement...</div>
                        ) : (
                            <>
                                <div className="text-sm text-white/50 mb-2">
                                    {players.length} joueur{players.length > 1 ? 's' : ''} inscrit{players.length > 1 ? 's' : ''}
                                </div>
                                {players.map(player => {
                                    const team = teams.find(t => t.id === player.team_id);
                                    return (
                                        <Card key={player.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-white truncate">{player.email}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className="bg-stoneo-700 text-white/90 text-[10px]">
                                                            {team ? `Team ${team.id} - ${team.name}` : 'Pas d\'équipe'}
                                                        </Badge>
                                                        <Badge className={cn(
                                                            "text-[10px]",
                                                            player.role === 'admin' ? 'bg-padel-yellow text-stoneo-900' : 'bg-stoneo-700 text-white/90'
                                                        )}>
                                                            {player.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="h-8 w-8 p-0 rounded-full"
                                                        onClick={() => handleEditPlayer(player)}
                                                    >
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        className="h-8 w-8 p-0 rounded-full text-red-400"
                                                        onClick={() => handleDeletePlayer(player.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}

                {/* Matches Tab */}
                {activeTab === 'matches' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <Card className="p-3 text-center">
                                <div className="text-2xl font-black text-padel-yellow">{matches.length}</div>
                                <div className="text-xs text-white/50 uppercase mt-1">Total</div>
                            </Card>
                            <Card className="p-3 text-center">
                                <div className="text-2xl font-black text-padel-green">{finishedMatches.length}</div>
                                <div className="text-xs text-white/50 uppercase mt-1">Terminés</div>
                            </Card>
                            <Card className="p-3 text-center">
                                <div className="text-2xl font-black text-white">{pendingMatches.length}</div>
                                <div className="text-xs text-white/50 uppercase mt-1">À jouer</div>
                            </Card>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleResetAllScores}
                            className="w-full bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                        >
                            🔄 Réinitialiser tous les scores
                        </Button>

                        {loading ? (
                            <div className="text-center text-white/50 py-10">Chargement...</div>
                        ) : (
                            <div className="space-y-3">
                                {matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(match => {
                                    const team1 = teams.find(t => t.id === match.team1Id);
                                    const team2 = teams.find(t => t.id === match.team2Id);
                                    if (!team1 || !team2) return null;

                                    return (
                                        <Card key={match.id} className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex gap-2">
                                                    <Badge className="bg-stoneo-700 text-white/90 text-[10px]">
                                                        {match.category === 'explorateur' ? 'Explorateur' : 'Confirmé'}
                                                    </Badge>
                                                    <Badge className="bg-stoneo-700 text-white/90 text-[10px]">
                                                        Terrain {match.terrain}
                                                    </Badge>
                                                    {match.isFinished && (
                                                        <Badge className="bg-padel-green text-stoneo-900 text-[10px]">
                                                            ✓ Terminé
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {new Date(match.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-white">
                                                        Team {team1.id} - {team1.name}
                                                    </div>
                                                </div>
                                                <div className="px-4">
                                                    {match.isFinished ? (
                                                        <div className="text-lg font-black text-padel-yellow">
                                                            {match.scoreTeam1} - {match.scoreTeam2}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-white/30">VS</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <div className="text-sm font-bold text-white">
                                                        Team {team2.id} - {team2.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Edit Player Modal */}
            <AnimatePresence>
                {editingPlayer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setEditingPlayer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-stoneo-800 rounded-2xl p-6 max-w-md w-full border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Modifier le joueur</h2>
                                <button
                                    onClick={() => setEditingPlayer(null)}
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full bg-stoneo-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-padel-yellow focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Équipe</label>
                                    <select
                                        value={editTeam}
                                        onChange={(e) => setEditTeam(e.target.value)}
                                        className="w-full bg-stoneo-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-padel-yellow focus:outline-none"
                                    >
                                        <option value="">Pas d'équipe</option>
                                        {teams.map(team => (
                                            <option key={team.id} value={team.id}>
                                                Team {team.id} - {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Rôle</label>
                                    <select
                                        value={editRole}
                                        onChange={(e) => setEditRole(e.target.value)}
                                        className="w-full bg-stoneo-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-padel-yellow focus:outline-none"
                                    >
                                        <option value="player">Player</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => setEditingPlayer(null)}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSavePlayer}
                                    className="flex-1"
                                >
                                    <Save size={16} />
                                    Enregistrer
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
}
