const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zniszcz-rolę')
    .setDescription('Pernamentnie usuń rolę.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName('rola')
        .setDescription('Wybierz rolę która zostanie usunięta')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const role = interaction.options.getRole('rola');

      const embed = new EmbedBuilder()
        .setTitle('☠️・Usunięto rolę')
        .setColor('Red')
        .addFields(
          {
            name: 'Rola:',
            value: `${role}`,
          },
          { name: 'Administrator:', value: `${interaction.member}` }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await interaction.guild.roles.delete(role);
      }, 2000);
    } catch (error) {
      return interaction.reply({
        content: 'Nie można usunąć roli',
        ephemeral: true,
      });
    }
  },
};
