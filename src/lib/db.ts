import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema'; // Ensure this path is correct based on your alias

const connectionString = process.env.DATABASE_URL!;

let client: postgres.Sql<{}>;

if (process.env.NODE_ENV === 'production') {
    client = postgres(connectionString, { prepare: false });
} else {
    if (!(global as any).postgresClient) {
        (global as any).postgresClient = postgres(connectionString, { prepare: false });
    }
    client = (global as any).postgresClient;
}

export const db = drizzle(client, { schema });
