const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const cloudinary = require('cloudinary').v2;
const { openai } = require('../../main');
const { cloudName, cloudKey, cloudSecret } = require('../../security/key.json');

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudKey,
  api_secret: cloudSecret,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dall-e')
    .setDescription('Stwórz zdjęcie za pomocą DALL-E 2.0')
    .addStringOption((option) =>
      option
        .setName('treść')
        .setDescription('Podaj co ma znajdować sie na obrazku.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const prompt = options.getString('treść');

    try {
      interaction.deferReply();
      const dalleresponce = await openai.createImage({
        prompt: `${prompt}`,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      });

      const username = interaction.user.username;
      const randomNumber = Math.floor(Math.random() * 90000) + 10000; // generowanie liczby pięciocyfrowej

      const publicId = `${username}-ID:${randomNumber}`;

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${dalleresponce.data.data[0].b64_json}`,
        {
          public_id: `${publicId}`,
          context: `alt=${prompt}|description=${prompt}`,
        }
      );

      const embed = new EmbedBuilder()
        .setTitle('📷・DALL-E')
        .setColor('Random')
        .setTimestamp()
        .setImage(result.url)
        .setFooter({ text: 'Powered by Open AI' })
        .addFields(
          {
            name: 'Opis:',
            value: `\`\`\`${prompt}\`\`\``,
          },
          {
            name: 'Stworzono dla:',
            value: `${interaction.member}`,
          }
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Zobacz zdjęcie w przeglądarce')
          .setStyle(ButtonStyle.Link)
          .setURL(result.url)
      );

      await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.error(error);
      console.log(prompt);
      return interaction.editReply({ content: 'Coś poszło nie tak.' });
    }
  },
};
