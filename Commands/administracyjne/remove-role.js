const rrSchema = require('../../Models/ReactionRoles');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usuń-rr')
    .setDescription('Usuń reaction role')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption((option) =>
      option
        .setName('rola')
        .setDescription('Którą role chesz usunąć?')
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, guildId, member } = interaction;

    const role = options.getRole('rola');

    try {
      const data = await rrSchema.findOne({ GuildID: guildId });

      if (!data)
        return interaction.reply({
          content: 'Ta rola nie ma rr.',
          ephemeral: true,
        });

      const roles = data.roles;
      const findRole = roles.find((r) => r.roleId === role.id);

      if (!findRole)
        return interaction.reply({
          content: 'Ta rola nie istnieje.',
          ephemeral: true,
        });

      const filteredRoles = roles.filter((r) => r.roleId !== role.id);
      data.roles = filteredRoles;

      await data.save();

      return interaction.reply({
        content: `Usunięto rr dla roli **${role.name}**`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
