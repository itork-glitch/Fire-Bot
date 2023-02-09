const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Stwórz własny embed.')
    .addStringOption((option) =>
      option.setName('tytuł').setDescription('Tytuł embedu').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('treść').setDescription('Treść embedu').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('kolor')
        .setDescription('Kolor embeda (kod hex np: #ffffff)')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const { options } = interaction;

      const title = options.getString('tytuł');
      const text = options.getString('treść');
      const color = options.getString('kolor') || 'Random';

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(`${color}`)
        .setDescription(text)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ content: 'Popraw kolor!', ephemeral: true });
    }
  },
};
