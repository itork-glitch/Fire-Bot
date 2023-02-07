const {
  SlashCommandBuilder,
  EmbedBuilder,
  Integration,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('obraz')
    .setDescription('Daj link do obrazu a ja go wyśle na serwerze.')
    .addStringOption((option) =>
      option
        .setName('link')
        .setDescription('Link do obrazu (Direct link)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const link = interaction.options.getString('link');

    try {
      const embed = new EmbedBuilder()
        .setTitle(`🖼️・Obraz przesłany przez **${interaction.user.username}**`)
        .setImage(link);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      interaction.reply({
        content: 'Musisz dać poprawny **direct link** do zdjęcia.',
        ephemeral: true,
      });
    }
  },
};
