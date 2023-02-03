const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('odbanuj')
    .setDescription('Odbanuj użytkownika na serwerze')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Podaj ID które ma zostać odbanowane')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { cannel, options } = interaction;

    const userId = options.getString('id');

    try {
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setTitle('🔓 Użytkownik odbanowany!')
        .setColor('#00ff00')
        .addFields(
          { name: 'Użytkownik', value: `<@${userId}>` },
          { name: 'Admin:', value: `${interaction.member}` }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle('❌ Nie można odbanować użytkownika')
        .setDescription('Podaj ID użytkownika które ma zostać odbanowane')
        .setColor('#ff0000')
        .setTimestamp();

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
