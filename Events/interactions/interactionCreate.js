const { CommandInteraction } = require('discord.js');
const { verifiedRoleID } = require('../../security/config.json');

module.exports = {
  name: 'interactionCreate',

  execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        interaction.reply({ content: 'Outdated command' });
      }

      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const role = interaction.guild.roles.cache.get(`${verifiedRoleID}`);
      return interaction.member.roles
      .add(role)
      .then((member) =>
        interaction.reply({
          content: `Otrzymałeś role: ${role}`,
          ephemeral: true,
        })
      );
    } else {
      return;
    }
  },
};
