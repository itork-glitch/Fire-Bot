const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tlumacz')
    .setDescription('Tłumaczy podany tekst na wskazany język')
    .addStringOption((option) =>
      option
        .setName('tekst')
        .setDescription('Tekst do przetłumaczenia')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('jezyk')
        .setDescription('Język na który chcesz przetłumaczyć tekst')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const text = interaction.options.getString('tekst');
      const rawTargetLanguage = interaction.options.getString('jezyk');
      const targetLanguage = rawTargetLanguage.toLowerCase();
      const deeplApiKey = '3b9a6709-dce8-aa84-3408-a9782b2a603b:fx';
      const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${deeplApiKey}&text=${encodeURIComponent(
        text
      )}&target_lang=${targetLanguage}`;

      const response = await axios.get(deeplUrl);
      const translatedText = response.data.translations[0].text;

      let lang = targetLanguage;

      if (targetLanguage === 'en') {
        lang = 'Angielski';
      }

      if (targetLanguage === 'es') {
        lang = 'Hiszpański';
      }

      if (targetLanguage === 'de') {
        lang = 'Niemiecki';
      }

      if (targetLanguage === 'nl') {
        lang = 'Holenderski';
      }

      if (targetLanguage === 'zh') {
        lang = 'Chiński';
      }

      if (targetLanguage === 'ar') {
        lang = 'Arabski';
      }

      if (targetLanguage === 'hi') {
        lang = 'Hindi';
      }

      if (targetLanguage === 'pt') {
        lang = 'Portugalski';
      }

      if (targetLanguage === 'ru') {
        lang = 'Rosyjski';
      }

      if (targetLanguage === 'ja') {
        lang = 'Japoński';
      }

      if (targetLanguage === 'fr') {
        lang = 'Francuski';
      }

      if (targetLanguage === 'it') {
        lang = 'Włoski';
      }

      if (targetLanguage === 'tr') {
        lang = 'Turecki';
      }

      if (targetLanguage === 'pl') {
        lang = 'Polski';
      }

      if (targetLanguage === 'uk') {
        lang = 'Ukraiński';
      }

      if (targetLanguage === 'ro') {
        lang = 'Rumuński';
      }

      const embed = new EmbedBuilder()
        .setTitle('🧠・Tłumacz')
        .setColor(0x03d3fc)
        .setTimestamp()
        .addFields(
          { name: 'Tekst:', value: `\`\`\`${text}\`\`\`` },
          { name: 'Przetłumaczono:', value: `\`\`\`${translatedText}\`\`\`` },
          { name: 'Język:', value: `\`${lang}\``, inline: true },
          {
            name: 'Przetłumaczono dla:',
            value: `${interaction.member}`,
            inline: true,
          }
        )
        .setFooter({ text: 'Powered by Deepl API' });

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      return interaction.reply({
        content: `Użyj innego skrótu tego języka.`,
        ephemeral: true,
      });
    }
  },
};
