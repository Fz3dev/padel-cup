import { supabase } from '@/lib/supabase';
import { TEAMS, MATCHES } from '@/data/mock';
import toast from 'react-hot-toast';

export const seedDatabase = async () => {
    try {
        // 1. Seed Teams
        const { error: teamsError } = await supabase
            .from('teams')
            .upsert(TEAMS.map(t => ({
                id: t.id,
                name: t.name,
                members: t.members,
                category: t.category,
                color: t.color // Added color
            })));

        if (teamsError) throw teamsError;

        // 2. Seed Matches
        // Clear existing matches to avoid duplicates if re-seeding with different IDs?
        // For now, let's just insert. If we want to reset, we should delete first.
        // Let's delete all matches first to ensure clean slate with correct schedule.
        const { error: deleteError } = await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        if (deleteError) console.error("Error clearing matches:", deleteError);

        const { error: matchesError } = await supabase
            .from('matches')
            .insert(MATCHES.map(m => ({
                category: m.category,
                terrain: m.terrain,
                start_time: m.startTime,
                end_time: m.endTime,
                duration_minutes: m.durationMinutes,
                team1_id: m.team1Id,
                team2_id: m.team2Id,
                score_team1: m.scoreTeam1,
                score_team2: m.scoreTeam2,
                is_finished: m.isFinished
            })));

        if (matchesError) throw matchesError;

        toast.success("Base de données mise à jour avec les nouvelles couleurs et horaires !");
    } catch (error: any) {
        console.error('Seeding error:', error);
        toast.error(`Erreur: ${error.message}`);
    }
};
