const rrSchema = require('../../Models/ReactionRoles');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stwórz-rr')
    .setDescription('Stwórz reaction roles na swoim serwerze.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption((option) =>
      option.setName('rola').setDescription('Wybierz rolę.').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('opis')
        .setDescription('Opis który ma być wyświelany przy roli.')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Wybierz emotkę która ci się podoba.')
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options, guildId, member } = interaction;

    const role = options.getRole('rola');
    const description = options.getString('opis');
    const emoji = options.getString('emoji');

    try {
      if (role.position >= member.roles.highest.position)
        return interaction.reply({
          content: 'Nie masz uprawnień!',
          ephemeral: true,
        });

      const data = await rrSchema.findOne({ GuildID: guildId });

      const newRole = {
        roleId: role.id,
        roleDescription: description || 'Brak opisu',
        roleEmoji: emoji || '',
      };

      if (data) {
        let roleData = data.roles.find((x) => x.roleId === role.id);

        if (roleData) {
          roleData = newRoleData;
        } else {
          data.roles = [...data.roles, newRole];
        }

        await data.save();
      } else {
        await rrSchema.create({
          GuildID: guildId,
          roles: newRole,
        });
      }

      return interaction.reply({
        content: `Stworzono rr dla roli: **${role.name}**`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
