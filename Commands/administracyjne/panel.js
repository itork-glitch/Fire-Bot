const rrSchema = require('../../Models/ReactionRoles');
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel-rr')
    .setDescription('Panel w którym wybierasz rr.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const { options, guildId, guild, channel } = interaction;

    try {
      const data = await rrSchema.findOne({ GuildID: guildId });

      if (!data.roles.length > 0)
        return interaction.reply({
          content: 'Ten serwer nie posiada rr.',
          ephemeral: true,
        });

      const panelEmbed = new EmbedBuilder()
        .setDescription('Wybierz rolę klikając na nią.')
        .setColor('Aqua');

      const options = data.roles.map((x) => {
        const role = guild.roles.cache.get(x.roleId);

        return {
          label: role.name,
          value: role.id,
          description: x.roleDescription,
          emoji: x.roleEmoji || undefined,
        };
      });

      const menuComponents = [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('reaction-roles')
            .setMaxValues(options.length)
            .addOptions(options)
        ),
      ];

      channel.send({ embeds: [panelEmbed], components: menuComponents });

      return interaction.reply({
        content: 'Pomyślnie stworzono panel',
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
