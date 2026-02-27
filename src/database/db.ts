import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export interface BossUser {
  discordId: string;
  username: string;
  style: 'SASSY' | 'SERIOUS' | 'FUNNY';
  registeredAt: Date;
}

export async function getOrCreateUser(discordId: string, username: string) {
  const result = await pool.query(
    `INSERT INTO boss_users (discord_id, username, style) 
     VALUES ($1, $2, 'SASSY') 
     ON CONFLICT (discord_id) 
     DO UPDATE SET username = $2 
     RETURNING *`,
    [discordId, username]
  );
  return result.rows[0];
}
