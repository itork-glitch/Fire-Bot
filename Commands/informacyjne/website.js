const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('strona')
    .setDescription('Moja strona www'),

  execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Strona')
      .setColor('Random')
      .setThumbnail('https://i.imgur.com/DMTu9gw.png')
      .setDescription('Zobacz moje portfolio napisane w **react.js**.')
      .addFields(
        {
          name: 'Link:',
          value: '[STRONA](https://itork.net)',
          inline: true,
        },
        {
          name: 'Github',
          value: '[GITHUB](https://github.com/itork-glitch/React-Portfolio)',
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
