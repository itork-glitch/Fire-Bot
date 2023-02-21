const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('przydatne-linki')
    .setDescription('Przydatne linki do bota'),

  execute(interaction) {
    const embed = new EmbedBuilder().setTitle('🔗・Linki').setColor('Random');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Moja strona')
        .setStyle(ButtonStyle.Link)
        .setURL('https://itork.net'),

      new ButtonBuilder()
        .setLabel('Serwer deweloperski')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/fk5hjMJ3PE'),

      new ButtonBuilder()
        .setLabel('Instagram')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.instagram.com/_itork_/')
    );

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
