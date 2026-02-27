import { SlashCommandBuilder } from 'discord.js';

export const next = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('What should Boss do next?'),
  async execute(interaction: any) {
    const actions = ['✅ Execute', '⏳ Wait', '🔥 Ban someone', '🍕 Order pizza', '😴 Nap time'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    await interaction.reply(`**Next Action:** ${action} 🐱💼`);
  },
};
