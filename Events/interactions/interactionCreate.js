const { CommandInteraction } = require('discord.js');
const { verifiedRoleID } = require('../../security/config.json');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: 'outdated command' });
      }
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      if (customId == 'weryfikacja') {
        const role = interaction.guild.roles.cache.get(`${verifiedRoleID}`);
        return interaction.member.roles.add(role).then((member) =>
          interaction.reply({
            content: `Otrzymałeś role: ${role}`,
            ephemeral: true,
          })
        );
      }
    } else if (interaction.isStringSelectMenu()) {
      if (customId == 'reaction-roles') {
        for (let i = 0; i < values.length; i++) {
          const roleId = values[i];

          const role = guild.roles.cache.get(roleId);
          const hasRole = member.roles.cache.has(roleId);

          switch (hasRole) {
            case true:
              member.roles.remove(roleId);
              break;
            case false:
              member.roles.add(roleId);
              break;
          }
        }

        interaction.reply({
          content: `Otrztrzymałeś zaznaczone role.`,
          ephemeral: true,
        });
      }
    } else {
      return;
    }
  },
};
