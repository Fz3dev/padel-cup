"use client";
import { Match, Team } from '@/types';
import { Card, Badge, cn } from '@/components/ui';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

interface MatchCardProps {
    match: Match;
    team1: Team & { color?: string };
    team2: Team & { color?: string };
    showScore?: boolean;
}

export const MatchCard = ({ match, team1, team2, showScore = true }: MatchCardProps) => {
    const isFinished = match.isFinished;

    // Calculate remaining time
    const getTimerStatus = () => {
        if (!match.timerStartedAt) return null;

        const now = new Date().getTime();
        const start = new Date(match.timerStartedAt).getTime();
        const totalPaused = match.timerTotalPausedMs || 0;

        let elapsed = 0;
        const isPaused = !!match.timerPausedAt;

        if (isPaused) {
            const pausedAt = new Date(match.timerPausedAt!).getTime();
            elapsed = pausedAt - start - totalPaused;
        } else {
            elapsed = now - start - totalPaused;
        }

        const totalDuration = match.durationMinutes * 60 * 1000;
        const remaining = Math.max(0, totalDuration - elapsed);
        const remainingMinutes = Math.floor(remaining / 60000);
        const remainingSeconds = Math.floor((remaining % 60000) / 1000);

        return {
            isPaused,
            timeString: `${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
        };
    };

    const timerStatus = getTimerStatus();

    return (
        <Link href={`/match/${match.id}`}>
            <Card className="relative overflow-hidden group border-l-4 border-l-white/10 hover:border-l-padel-yellow transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2 items-center flex-wrap">
                        <Badge className="bg-stoneo-700 text-white/90">
                            {match.category === 'explorateur' ? 'Explorateur' : 'Confirmé'}
                        </Badge>
                        {isFinished && (
                            <Badge className="bg-padel-green text-stoneo-900 text-[10px] px-2 py-0.5">
                                ✓ Terminé
                            </Badge>
                        )}
                        {!isFinished && timerStatus && (
                            <>
                                <Badge className={cn(
                                    "text-[10px] px-2 py-0.5",
                                    timerStatus.isPaused ? "bg-yellow-600 text-white" : "bg-orange-500 text-white animate-pulse"
                                )}>
                                    {timerStatus.isPaused ? '⏸️ En pause' : '🔴 En cours'}
                                </Badge>
                                <Badge className="bg-stoneo-700 text-white/90 text-[10px] px-2 py-0.5">
                                    ⏳ {timerStatus.timeString}
                                </Badge>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-padel-yellow text-sm font-bold">
                            <Clock size={14} />
                            {format(new Date(match.startTime), 'HH:mm')}
                        </div>
                        <div className="text-xs text-white/50 flex items-center justify-end gap-1 mt-0.5">
                            <MapPin size={12} />
                            Terrain {match.terrain}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                    {/* Team 1 */}
                    <div className="flex-1 flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.3)] flex-shrink-0"
                            style={{ backgroundColor: team1.color || '#fff', aspectRatio: '1' }}
                        />
                        <div>
                            <div className="text-sm md:text-lg font-bold leading-tight mb-0.5">{team1.name}</div>
                            <div className="text-[10px] text-white/50">Team {team1.id}</div>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center min-w-[50px]">
                        {isFinished && showScore ? (
                            <div className="text-xl font-black font-outfit tracking-wider bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                {match.scoreTeam1} - {match.scoreTeam2}
                            </div>
                        ) : (
                            <div className="text-xs font-bold text-white/30 uppercase tracking-widest">VS</div>
                        )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex-1 text-right flex items-center justify-end gap-3">
                        <div>
                            <div className="text-sm md:text-lg font-bold leading-tight mb-0.5">{team2.name}</div>
                            <div className="text-[10px] text-white/50">Team {team2.id}</div>
                        </div>
                        <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.3)] flex-shrink-0"
                            style={{ backgroundColor: team2.color || '#fff', aspectRatio: '1' }}
                        />
                    </div>
                </div>
            </Card>
        </Link>
    );
};
