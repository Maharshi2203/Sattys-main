
const { Client } = require('pg');

const databaseUrl = 'postgresql://postgres.lzzidovrlwtoicwxlgsb:1g4c8SAthTImYxezXZhQMGIpy4xrz3JD2g4uQxnIvn88zeSw0LkA0r3MpFttaKEs@aws-1-us-east-1.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString: databaseUrl,
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to database');

        const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'images';
    `;
        const res = await client.query(checkColumnQuery);

        if (res.rows.length === 0) {
            console.log('Adding images column...');
            await client.query(`ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];`);
            console.log('images column added successfully.');
        } else {
            console.log('images column already exists.');
        }

        // Ensure it's not JSONB if it exists but as wrong type (less likely but possible)
        // We'll trust the error message implies it didn't exist.

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
