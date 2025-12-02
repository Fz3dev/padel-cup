const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://aifyibyomfkotqolrugj.supabase.co';
const serviceKey = process.argv[2]; // We'll need the service role key
const sqlFile = process.argv[3];

if (!serviceKey || !sqlFile) {
    console.error('Usage: node run_sql.js <SERVICE_ROLE_KEY> <SQL_FILE>');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const sql = fs.readFileSync(sqlFile, 'utf8');

// Split SQL into individual statements
const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

async function executeSql() {
    for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        try {
            const { data, error } = await supabase.rpc('exec_sql', { query: statement });
            if (error) throw error;
            console.log('✓ Success');
        } catch (err) {
            console.error('✗ Error:', err.message);
        }
    }
}

executeSql();
