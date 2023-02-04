const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('przydatne-linki')
    .setDescription('Przydatne linki do bota'),

  execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Linki')
      .setColor('Random')
      .setDescription('Przydatne link związane z botem.')
      .addFields(
        {
          name: 'Strona:',
          value: '[STRONA](https://itork.net)',
          inline: true,
        },
        {
          name: 'Discord:',
          value: '[DISCORD](https://discord.gg/vBBuJvW4xA)',
          inline: true,
        },
        {
          name: 'Instagram:',
          value: '[INSTAGRAM](https://www.instagram.com/_itork_/)',
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
