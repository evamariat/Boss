import { SlashCommandBuilder } from 'discord.js';

export const ping = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if Boss is alive 🐱'),
  async execute(interaction: any) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! **${latency}ms** | API: ${interaction.client.ws.ping}ms`);
  },
};
