"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Match, Team } from '@/types';
import { MATCHES as MOCK_MATCHES, TEAMS as MOCK_TEAMS } from '@/data/mock';

export function useTournament() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Teams
            const { data: teamsData, error: teamsError } = await supabase
                .from('teams')
                .select('*');

            if (teamsError) throw teamsError;

            // Fetch Matches
            const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select('*');

            if (matchesError) throw matchesError;

            if (teamsData && teamsData.length > 0) {
                setTeams(teamsData as Team[]);
            } else {
                // Fallback to mock if empty (so user sees something before seeding)
                setTeams(MOCK_TEAMS);
            }

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
                // Fallback to mock
                setMatches(MOCK_MATCHES);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            // Fallback on error
            setTeams(MOCK_TEAMS);
            setMatches(MOCK_MATCHES);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                () => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { matches, teams, loading, refresh: fetchData };
}
