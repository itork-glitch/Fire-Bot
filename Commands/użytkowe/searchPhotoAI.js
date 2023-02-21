const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const cloudinary = require('cloudinary').v2;
const { cloudName } = require('../../security/key.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zdjecie-ai')
    .setDescription('Znajdz obraz wygenerowany za pomocą DALL-E w tym bocie')
    .addNumberOption((option) =>
      option
        .setName('id')
        .setDescription('Wprowadź numer publiczny (ID)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const rawPublicId = options.getNumber('id');

    const publicId = rawPublicId.toString();

    try {
      interaction.deferReply();
      const response = await cloudinary.search
        .expression(`public_id:${publicId}`)
        .sort_by('public_id', 'desc')
        .max_results(1)
        .execute();

      if (response.resources.length === 0) {
        return interaction.editReply(
          `Nie znaleziono obrazu o numerze publicznym "${publicId}"`
        );
      }

      const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${response.resources[0].public_id}.png`;

      const embed = new EmbedBuilder()
        .setTitle('🚀・Obraz')
        .setColor('Random')
        .setDescription('Znalazłem w bazie danych te zdjęcie.')
        .addFields(
          { name: 'ID:', value: `\`${publicId}\``, inline: true },
          { name: 'Wyszukał:', value: `${interaction.member}`, inline: true }
        )
        .setImage(imageUrl);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Otwórz w przeglądarce')
          .setStyle(ButtonStyle.Link)
          .setURL(imageUrl)
      );

      await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply('Coś poszło nie tak.');
    }
  },
};
