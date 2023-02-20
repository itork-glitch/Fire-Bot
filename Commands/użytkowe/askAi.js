const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { openai } = require('../../main');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zapytaj-ai')
    .setDescription('Zapytaj Chat GPT.')
    .addStringOption((option) =>
      option
        .setName('pytanie')
        .setDescription('Podaj treść pytania')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const prompt = options.getString('pytanie');

    try {
      interaction.deferReply();
      const gptresponce = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${prompt}`,
        temperature: 0.9,
        max_tokens: 200,
        stop: ['ChatGPT:', 'Itork:'],
      });

      const embed = new EmbedBuilder()
        .setTitle('☄️・ChatGPT')
        .setFooter({ text: 'Powered by Open AI' })
        .setDescription(
          `**Odpowiedz AI:** \`\`\` ${gptresponce.data.choices[0].text} \n \`\`\` `
        )
        .setColor('Random')
        .setTimestamp()
        .addFields(
          {
            name: 'Pytanie:',
            value: `\`${prompt}\``,
            inline: true,
          },
          { name: 'Zapytał:', value: `${interaction.member}`, inline: true }
        );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      return interaction.editReply({ content: 'Coś poszło nie tak.' });
    }
  },
};
