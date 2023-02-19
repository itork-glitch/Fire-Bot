const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cloudinary = require('cloudinary').v2;
const { openai } = require('../../main');

cloudinary.config({
  cloud_name: 'diclqltjd',
  api_key: '991568765474472',
  api_secret: 'dpBYJzRILOCN7wOUq8gCpl6Guo4',
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

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${dalleresponce.data.data[0].b64_json}`
      );

      const embed = new EmbedBuilder()
        .setTitle('📷・DALL-E')
        .setAuthor({
          name: 'Open AI',
          iconURL: 'https://imgur.com/RDOFqQd.png',
        })
        .setColor('Random')
        .setTimestamp()
        .setImage(result.url)
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

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Coś poszło nie tak.' });
    }
  },
};
