const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('losuj-numer')
    .setDescription('Wygeneruj losowy numer.')
    .addNumberOption((option) =>
      option.setName('min').setDescription('Podaj minimum').setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName('max').setDescription('Podaj maksimum').setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;

    const min = options.getNumber('min');
    const max = options.getNumber('max');

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const embed = new EmbedBuilder()
      .setTitle('🎲 Losowy numer')
      .setColor('Random')
      .addFields(
        { name: 'Wylosowany numer:', value: `\`${randomNumber}\`` },
        { name: 'Zakres:', value: `\`${min}\` - \`${max}\`` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
