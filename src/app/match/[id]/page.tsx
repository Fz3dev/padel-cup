"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTournament } from '@/hooks/useTournament';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { MatchTimer } from '@/components/match/MatchTimer';
import { Button, Card, Badge, cn } from '@/components/ui';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function MatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { matches, teams, loading } = useTournament();

    const [score1, setScore1] = useState<string>('');
    const [score2, setScore2] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [canEdit, setCanEdit] = useState(true); // Allow everyone to edit
    const [checkingPermissions, setCheckingPermissions] = useState(false);

    const match = matches.find(m => m.id === params.id);
    const team1 = match ? teams.find(t => t.id === match.team1Id) : null;
    const team2 = match ? teams.find(t => t.id === match.team2Id) : null;

    // Permission check removed as requested to allow offline/proxy score submission

    // Pre-fill scores if match is already finished
    useEffect(() => {
        if (match && match.isFinished && match.scoreTeam1 != null && match.scoreTeam2 != null) {
            setScore1(match.scoreTeam1.toString());
            setScore2(match.scoreTeam2.toString());
        }
    }, [match]);

    if (loading || checkingPermissions) {
        return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Chargement...</div>;
    }

    if (!match || !team1 || !team2) {
        return <div className="min-h-screen bg-stoneo-900 flex items-center justify-center text-white">Match introuvable</div>;
    }

    const handleSubmit = async () => {
        if (!canEdit) {
            toast.error("Vous n'avez pas la permission de modifier ce match");
            return;
        }

        if (!score1 || !score2) {
            toast.error("Veuillez entrer les deux scores");
            return;
        }

        const s1 = parseInt(score1);
        const s2 = parseInt(score2);

        if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
            toast.error("Les scores doivent être des nombres positifs");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            // Update match in Supabase
            const { error } = await supabase
                .from('matches')
                .update({
                    score_team1: s1,
                    score_team2: s2,
                    is_finished: true,
                    submitted_by: user?.id
                })
                .eq('id', match.id);

            if (error) throw error;

            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#DFFF00', '#39FF14', '#ffffff']
            });

            const isEdit = match.isFinished;
            toast.success(isEdit ? "✅ Score modifié avec succès !" : "🎾 Score enregistré avec succès !");

            // Wait a bit for confetti, then redirect
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);

        } catch (error: any) {
            console.error('Error submitting score:', error);
            toast.error("Erreur lors de l'enregistrement du score");
            setIsSubmitting(false);
        }
    };

    const isEditing = match.isFinished;

    return (
        <div className="min-h-screen bg-stoneo-900 pb-safe">
            <div className="p-4">
                <Button variant="ghost" onClick={() => router.back()} className="pl-0 mb-2">
                    <ArrowLeft size={20} /> Retour
                </Button>
            </div>

            <main className="px-4 pb-8 space-y-6">
                {/* Finished Badge */}
                {isEditing && (
                    <div className="flex justify-center">
                        <Badge className="bg-padel-green text-stoneo-900 text-sm px-4 py-1.5 font-bold">
                            ✓ Match Terminé
                        </Badge>
                    </div>
                )}
                {!isEditing && match.timerStartedAt && (
                    <div className="flex justify-center">
                        <Badge className="bg-orange-500 text-white text-sm px-4 py-1.5 font-bold animate-pulse">
                            🔴 Match En Cours
                        </Badge>
                    </div>
                )}

                {/* Header VS */}
                <div className="flex justify-between items-center text-center">
                    <div className="flex-1">
                        <div className="text-3xl font-black text-white">{team1.id}</div>
                        <div className="text-xs text-white/50 truncate max-w-[100px] mx-auto">{team1.name}</div>
                    </div>
                    <div className="text-padel-yellow font-bold text-xl italic">VS</div>
                    <div className="flex-1">
                        <div className="text-3xl font-black text-white">{team2.id}</div>
                        <div className="text-xs text-white/50 truncate max-w-[100px] mx-auto">{team2.name}</div>
                    </div>
                </div>

                {/* Timer - Only show if not finished */}
                {!isEditing && (
                    <Card className="bg-stoneo-800/50 border-white/5">
                        <MatchTimer durationMinutes={match.durationMinutes} />
                    </Card>
                )}

                {/* Score Input */}
                <section>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {isEditing && (
                            <Edit size={16} className="text-padel-yellow" />
                        )}
                        <h3 className="text-center text-white/50 uppercase tracking-widest text-sm">
                            {isEditing ? "Modifier le score (Jeux)" : "Saisir le score (Jeux)"}
                        </h3>
                    </div>

                    {!canEdit && (
                        <div className="text-center text-xs text-red-400 mb-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            🔒 Lecture seule : Vous ne participez pas à ce match
                        </div>
                    )}

                    <div className="flex gap-4 items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-xs font-bold text-white/70">{team1.id}</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                disabled={!canEdit}
                                value={score1}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val < 0) return;
                                    setScore1(e.target.value);
                                }}
                                className={cn(
                                    "w-20 h-20 bg-stoneo-800 border-2 rounded-2xl text-center text-3xl font-bold focus:border-padel-yellow focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    isEditing ? "border-padel-yellow/30" : "border-white/10"
                                )}
                                placeholder="0"
                            />
                        </div>
                        <span className="text-2xl text-white/20">-</span>
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-xs font-bold text-white/70">{team2.id}</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                disabled={!canEdit}
                                value={score2}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val < 0) return;
                                    setScore2(e.target.value);
                                }}
                                className={cn(
                                    "w-20 h-20 bg-stoneo-800 border-2 rounded-2xl text-center text-3xl font-bold focus:border-padel-yellow focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    isEditing ? "border-padel-yellow/30" : "border-white/10"
                                )}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </section>

                {canEdit && (
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !score1 || !score2}
                        className="w-full py-4 text-lg shadow-lg shadow-padel-yellow/20"
                    >
                        {isSubmitting ? 'Enregistrement...' : isEditing ? 'Modifier le Score' : 'Valider le Match'}
                        {isEditing ? <Edit size={20} /> : <Save size={20} />}
                    </Button>
                )}

                {isEditing && canEdit && (
                    <p className="text-center text-xs text-white/40">
                        ⚠️ La modification mettra à jour le classement
                    </p>
                )}
            </main>
        </div>
    );
}
