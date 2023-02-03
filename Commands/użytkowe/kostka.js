const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kostka')
    .setDescription('Zobacz co ci wypadnie na kostce'),

  async execute(interaction) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setTitle('🎲 Rzut kostką')
      .setColor('Random')
      .addFields({ name: 'Wypadło:', value: `\`${randomNumber}\`` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
