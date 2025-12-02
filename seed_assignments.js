const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://aifyibyomfkotqolrugj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZnlpYnlvbWZrb3Rxb2xydWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDkxOTgsImV4cCI6MjA4MDE4NTE5OH0.x_nYfW3AGxrq_cmu4lEAzkRL6OS1HoZXZ_nHtSOV_B0'
);

const assignments = [
    { email: 'louis.pasquier@stoneo.fr', team_id: null, role: 'admin' },
    { email: 'guillaume.pigeon@avest.fr', team_id: 'A', role: 'player' },
    { email: 'maxence.fourrier@avest.fr', team_id: 'A', role: 'player' },
    { email: 'cyril.lacheretz@avest.fr', team_id: 'B', role: 'player' },
    { email: 'sandra.maglott@stoneo.fr', team_id: 'B', role: 'player' },
    { email: 'emile.bron@avest.fr', team_id: 'C', role: 'player' },
    { email: 'aminata.sylla@stoneo.fr', team_id: 'C', role: 'player' },
    { email: 'alim.tunc@avest.fr', team_id: 'D', role: 'player' },
    { email: 'manon.geslin@stoneo.fr', team_id: 'D', role: 'player' },
    { email: 'fawsy.limlahi@avest.fr', team_id: 'E', role: 'player' },
    { email: 'francois.nicol@stoneo.fr', team_id: 'E', role: 'player' },
    { email: 'nicolas.poupard@stoneo.fr', team_id: 'F', role: 'player' },
    { email: 'pierre.arthus@stoneo.fr', team_id: 'F', role: 'player' },
    { email: 'philippe.pluyette@avest.fr', team_id: 'G', role: 'player' },
    { email: 'marine.huvier@stoneo.fr', team_id: 'G', role: 'player' },
    { email: 'meyer.attal@avest.fr', team_id: 'H', role: 'player' },
    { email: 'clement.garo@avest.fr', team_id: 'H', role: 'player' },
    { email: 'laurent.fedida@stoneo.fr', team_id: 'I', role: 'player' },
    { email: 'francois.vandamme@stoneo.fr', team_id: 'I', role: 'player' },
    { email: 'corentin.gillet@stoneo.fr', team_id: 'J', role: 'player' },
    { email: 'johanne.perre@stoneo.fr', team_id: 'J', role: 'player' }
];

async function seedAssignments() {
    console.log('🌱 Seeding team assignments...');

    for (const assignment of assignments) {
        const { data, error } = await supabase
            .from('team_assignments')
            .upsert(assignment, { onConflict: 'email' });

        if (error) {
            console.error(`❌ Error for ${assignment.email}:`, error.message);
        } else {
            console.log(`✅ ${assignment.email} → Team ${assignment.team_id || 'N/A'}`);
        }
    }

    console.log('\n✨ Done!');
}

seedAssignments();
