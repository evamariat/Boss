import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { getOrCreateUser } from '../database/db.js';

export const assist = {
  data: new SlashCommandBuilder()
    .setName('assist')
    .setDescription('Get advice from Bigcat 🐱💼')
    .addStringOption(new SlashCommandStringOption()
      .setName('question')
      .setDescription('Your question for Bigcat')
      .setRequired(true)),
  async execute(interaction: any) {
    await interaction.deferReply();
    
    const question = interaction.options.getString('question')!;
    const user = await getOrCreateUser(interaction.user.id, interaction.user.username);
    
    // Bigcat AI Logic (simple for now)
    const responses = {
      SASSY: `🐱 *claws sharpen* "${question}"? Boss, you already know the answer. Do it. Now. 💅`,
      SERIOUS: `📋 Analysis: "${question}" requires immediate action. Execute plan Alpha.`,
      FUNNY: `😂 "${question}"? Let me consult my hairball oracle... It's a **YES**! 🎉`,
    };
    
    await interaction.editReply(`${responses[user.style]} | Style: **${user.style}**`);
  },
};
