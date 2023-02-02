const {
  Message,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const welcomeSchema = require('../../Models/Welcome');
const { model, Schema } = require('mongoose');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-konfiguracja')
    .setDescription('Ustaw funkcje powitań na serwerze')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('kanał')
        .setDescription('Ustaw kanał powitań.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('wiadomość')
        .setDescription('Ustaw wiadomość powitalną.')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('rola')
        .setDescription('Ustaw rolę nakładaną przy dołączeniu na serwer.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { channel, options } = interaction;

    const welcomeChannel = options.getChannel('kanał');
    const welcomeMessage = options.getString('wiadomosc');
    const roleID = options.getRole('rola');

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.SendMessages
      )
    ) {
      interaction.reply({
        content: 'Nie mam takich uprawnień!',
        ephemeral: true,
      });
    }

    welcomeSchema.findOne(
      { Guild: interaction.guild.id },
      async (err, data) => {
        if (!data) {
          const newWelcone = await welcomeSchema.create({
            Guild: interaction.guild.id,
            Channel: welcomeChannel.id,
            Msg: welcomeMessage,
            Role: roleID.id,
          });
        }

        interaction.reply({
          content: 'Stworzono pomyślnie sytem powitań',
          ephemeral: true,
        });
      }
    );
  },
};
