const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('sprawdz opóźnienie bota'),
  execute(interaction, client) {
    const latency = client.ws.ping;
    const embed = new EmbedBuilder()
      .setTitle('Pong!')
      .setDescription(`🏓 Opóźnienie wynosi: ${latency}ms`)
      .setColor('Random');

    interaction.reply({ embeds: [embed] });
  },
};
