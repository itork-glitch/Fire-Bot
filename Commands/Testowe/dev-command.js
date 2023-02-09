const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { devID } = require('../../security/config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('informacje-dev')
    .setDescription('Komenda deweloperska'),

  async execute(interaction) {
    if (interaction.user.id == devID) {
      const embed = new EmbedBuilder().setTitle('Informacje');

      interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply({
        content: 'Nie masz uprawnień do tego komendy!',
        ephemeral: true,
      });
    }
  },
};
