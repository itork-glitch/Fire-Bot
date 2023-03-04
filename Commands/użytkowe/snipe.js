const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiadomosc')
    .setDescription('Wyświetl wiadomość jeszcze raz')
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Podaj id wiadomości')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;

    const id = options.getString('id');

    const prevEmbed = new EmbedBuilder()
      .setTitle('Wybierz typ wiadomości')
      .setColor('Random')
      .addFields({ name: 'ID wiadomości:', value: `\`\`\`${id}\`\`\`` });
    const prevRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('Wiadomość')
        .setCustomId('wiadomosc-mess'),

      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Embed')
        .setCustomId('wiadomosc-embed')
    );

    interaction.reply({ embeds: [prevEmbed], components: [prevRow] });
  },
};
