import { REST, Routes } from 'discord.js';
import { config } from 'dotenv'; // For tokens

config();

const commands = [{ name: 'ping', description: 'Replies with Pong!' }]; // Add your full data.toJSON()
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    // Global: omit guildId
    await rest.put(Routes.applicationCommands('YOUR_CLIENT_ID'), { body: commands });
    // Guild-specific: Routes.applicationGuildCommands('CLIENT_ID', 'GUILD_ID')
    console.log('Registered!');
  } catch (error) {
    console.error(error);
  }
})();
