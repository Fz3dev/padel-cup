"use client";
import { useState, useEffect } from 'react';
import { Button, cn, Badge } from '@/components/ui';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export const MatchTimer = ({ durationMinutes }: { durationMinutes: number }) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Timer finished!
                        setIsActive(false);
                        setHasFinished(true);

                        // Play alarm sound
                        playAlarmSound();

                        // Vibrate (mobile)
                        if ('vibrate' in navigator) {
                            navigator.vibrate([200, 100, 200, 100, 200]);
                        }

                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = (timeLeft / (durationMinutes * 60)) * 100;

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(durationMinutes * 60);
        setHasFinished(false);
    };

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
                        stroke={timeLeft === 0 ? "#39FF14" : "#DFFF00"}
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
                        timeLeft === 0 && "text-padel-green animate-pulse"
                    )}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/50 mt-1 font-medium uppercase tracking-widest">
                        {timeLeft === 0 ? "Terminé" : "Temps Restant"}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <Button
                    onClick={() => setIsActive(!isActive)}
                    disabled={timeLeft === 0}
                    className={cn(
                        "w-16 h-16 rounded-full p-0 flex items-center justify-center",
                        isActive ? "bg-stoneo-700 text-white" : "bg-padel-yellow text-stoneo-900",
                        timeLeft === 0 && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="w-16 h-16 rounded-full border border-white/10"
                >
                    <RotateCcw size={24} />
                </Button>
            </div>
        </div>
    );
};
