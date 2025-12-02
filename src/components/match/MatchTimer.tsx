"use client";
import { useState, useEffect } from 'react';
import { Button, cn, Badge } from '@/components/ui';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/types';
import toast from 'react-hot-toast';

interface MatchTimerProps {
    match: Match;
    canEdit: boolean;
}

export const MatchTimer = ({ match, canEdit }: MatchTimerProps) => {
    const [timeLeftMs, setTimeLeftMs] = useState(match.durationMinutes * 60 * 1000);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    // Calculate time left based on server state
    useEffect(() => {
        const calculateTime = () => {
            if (!match.timerStartedAt) {
                setTimeLeftMs(match.durationMinutes * 60 * 1000);
                setIsActive(false);
                setHasFinished(false);
                return;
            }

            const now = new Date().getTime();
            const start = new Date(match.timerStartedAt).getTime();
            const totalPaused = match.timerTotalPausedMs || 0;

            let elapsed = 0;

            if (match.timerPausedAt) {
                // Paused
                const pausedAt = new Date(match.timerPausedAt).getTime();
                elapsed = pausedAt - start - totalPaused;
                setIsActive(false);
            } else {
                // Running
                elapsed = now - start - totalPaused;
                setIsActive(true);
            }

            const totalDuration = match.durationMinutes * 60 * 1000;
            const remaining = Math.max(0, totalDuration - elapsed);

            setTimeLeftMs(remaining);

            if (remaining === 0 && !hasFinished) {
                setHasFinished(true);
                playAlarmSound();
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [match, hasFinished]);

    // Play alarm sound using Web Audio API
    const playAlarmSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            // Play 3 beeps
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 800;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc2.start();
                osc2.stop(audioContext.currentTime + 0.5);
            }, 600);

            setTimeout(() => {
                const osc3 = audioContext.createOscillator();
                const gain3 = audioContext.createGain();
                osc3.connect(gain3);
                gain3.connect(audioContext.destination);
                osc3.frequency.value = 800;
                osc3.type = 'sine';
                gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc3.start();
                osc3.stop(audioContext.currentTime + 0.5);
            }, 1200);
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    };

    const handleToggle = async () => {
        if (!canEdit) return;

        try {
            if (!match.timerStartedAt) {
                // Start
                await supabase.from('matches').update({
                    timer_started_at: new Date().toISOString(),
                    timer_paused_at: null,
                    timer_total_paused_ms: 0
                }).eq('id', match.id);
            } else if (isActive) {
                // Pause
                await supabase.from('matches').update({
                    timer_paused_at: new Date().toISOString()
                }).eq('id', match.id);
            } else {
                // Resume
                const pausedAt = new Date(match.timerPausedAt!).getTime();
                const now = new Date().getTime();
                const additionalPause = now - pausedAt;

                await supabase.from('matches').update({
                    timer_paused_at: null,
                    timer_total_paused_ms: (match.timerTotalPausedMs || 0) + additionalPause
                }).eq('id', match.id);
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du chrono");
        }
    };

    const handleReset = async () => {
        if (!canEdit) return;
        if (!confirm("Voulez-vous vraiment réinitialiser le chronomètre ?")) return;

        try {
            await supabase.from('matches').update({
                timer_started_at: null,
                timer_paused_at: null,
                timer_total_paused_ms: 0
            }).eq('id', match.id);
        } catch (error) {
            toast.error("Erreur reset chrono");
        }
    };

    const timeLeftSeconds = Math.ceil(timeLeftMs / 1000);
    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const totalDurationMs = match.durationMinutes * 60 * 1000;
    const progress = (timeLeftMs / totalDurationMs) * 100;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            {hasFinished && (
                <Badge className="mb-4 bg-padel-green text-stoneo-900 text-sm px-4 py-2 flex items-center gap-2 animate-pulse">
                    <Bell size={16} />
                    Temps écoulé !
                </Badge>
            )}

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Circular Progress Background */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none" stroke="#1F2E52" strokeWidth="6"
                    />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={timeLeftSeconds === 0 ? "#39FF14" : "#DFFF00"}
                        strokeWidth="6"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress) / 100}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="text-center z-10">
                    <div className={cn(
                        "text-6xl font-black font-outfit tabular-nums tracking-tighter transition-colors",
                        timeLeftSeconds === 0 && "text-padel-green animate-pulse"
                    )}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/50 mt-1 font-medium uppercase tracking-widest">
                        {timeLeftSeconds === 0 ? "Terminé" : isActive ? "En cours" : "En pause"}
                    </div>
                </div>
            </div>

            {canEdit && (
                <div className="flex gap-4 mt-6">
                    <Button
                        onClick={handleToggle}
                        disabled={timeLeftSeconds === 0 && isActive}
                        className={cn(
                            "w-16 h-16 rounded-full p-0 flex items-center justify-center transition-all",
                            isActive ? "bg-stoneo-700 text-white" : "bg-padel-yellow text-stoneo-900",
                            timeLeftSeconds === 0 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="w-16 h-16 rounded-full border border-white/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-colors"
                    >
                        <RotateCcw size={24} />
                    </Button>
                </div>
            )}
        </div>
    );
};
