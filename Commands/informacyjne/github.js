const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Zobacz mój kod na Github'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('<:github:1071166004442439781>・ Github')
      .setColor('Purple')
      .setDescription(
        `Hej <@${interaction.user.id}> sprawdz mój kod źródłowy klikając w link.`
      )
      .addFields({
        name: 'Link:',
        value: '[GITHUB](https://github.com/itork-glitch/Fire-Bot)',
      });

    interaction.reply({ embeds: [embed] });
  },
};
