const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aktywność')
    .setDescription('Sprawdź ile bot jest online.'),

  async execute(interaction, client) {
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;

    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} jest aktywny od:`)
      .setColor('Blue')
      .setTimestamp()
      .addFields({
        name: 'Aktywność',
        value: ` \`${days}\` dni, \`${hours}\` godzin, \`${minutes}\` minut i \`${seconds}\` sekund.`,
      });

    interaction.reply({ embeds: [embed] });
  },
};
