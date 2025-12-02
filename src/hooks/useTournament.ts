"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Match, Team } from '@/types';
import { MATCHES as MOCK_MATCHES, TEAMS as MOCK_TEAMS } from '@/data/mock';

export function useTournament() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const { data: matchesData, error: matchesError } = await supabase
                    .from('matches')
                    .select('*');

                if (matchesError) throw matchesError;

                if (matchesData && matchesData.length > 0) {
                    // Map DB snake_case to camelCase
                    const mappedMatches = matchesData.map((m: any) => ({
                        id: m.id,
                        category: m.category,
                        terrain: m.terrain,
                        startTime: m.start_time,
                        endTime: m.end_time,
                        team1Id: m.team1_id,
                        team2Id: m.team2_id,
                        durationMinutes: m.duration_minutes,
                        scoreTeam1: m.score_team1,
                        scoreTeam2: m.score_team2,
                        isFinished: m.is_finished,
                        timerStartedAt: m.timer_started_at,
                        timerPausedAt: m.timer_paused_at,
                        timerTotalPausedMs: m.timer_total_paused_ms
                    }));
                    setMatches(mappedMatches);
                } else {
                    setMatches(MOCK_MATCHES);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
                setMatches(MOCK_MATCHES);
            }
        };

        const fetchTeams = async () => {
            try {
                const { data, error } = await supabase
                    .from('teams')
                    .select('*')
                    .order('id');

                if (!error && data) {
                    const mappedTeams: Team[] = data.map(t => ({
                        id: t.id,
                        name: t.name,
                        category: t.category as any,
                        members: t.members,
                        color: t.color
                    }));
                    setTeams(mappedTeams);
                } else {
                    setTeams(MOCK_TEAMS);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                setTeams(MOCK_TEAMS);
            }
        };

        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchMatches(), fetchTeams()]);
            setLoading(false);
        };

        loadData();

        // Subscribe to real-time updates on matches
        const channel = supabase
            .channel('matches-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'matches'
            }, () => {
                fetchMatches();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return {
        matches,
        teams,
        loading,
    };
}
