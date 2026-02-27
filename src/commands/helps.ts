import { SlashCommandBuilder } from 'discord.js';

export const help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Boss command list'),
  async execute(interaction: any) {
    const embed = {
      title: '🐱 Boss Bot - Bigcat Advisor',
      description: 'Commands for the Boss:',
      fields: [
        { name: '/ping', value: 'Check bot latency', inline: true },
        { name: '/assist [question]', value: 'Get Bigcat advice', inline: true },
        { name: '/next', value: 'What to do next', inline: true },
      ],
      color: 0x00ff00,
    };
    await interaction.reply({ embeds: [embed] });
  },
};
