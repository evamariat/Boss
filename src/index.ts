import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { pool } from './database/db.js';
import { ping } from './commands/ping.js';
import { help } from './commands/help.js';
import { assist } from './commands/assist.js';
import { next } from './commands/next.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.commands.set(ping.data.name, ping);
client.commands.set(help.data.name, help);
client.commands.set(assist.data.name, assist);
client.commands.set(next.data.name, next);

client.once('ready', async () => {
  console.log(`🐱 Boss logged in as ${client.user?.tag}`);
  
  // Init DB
  await pool.query(`
    CREATE TABLE IF NOT EXISTS boss_users (
      discord_id VARCHAR(20) PRIMARY KEY,
      username VARCHAR(32) NOT NULL,
      style VARCHAR(10) DEFAULT 'SASSY',
      registered_at TIMESTAMP DEFAULT NOW()
    )
  `);
  
  // Register slash commands
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  await client.application?.commands.set(commands);
  console.log('✅ Slash commands registered');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = (interaction.client as any).commands.get(interaction.commandName);
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
