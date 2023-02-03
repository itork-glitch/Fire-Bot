const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('odblokuj')
    .setDescription('Usuń karę czasową z użytkownika')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Użytkownik którego chcesz odblokować')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { guild, options } = interaction;

    const user = options.getMember('użytkownik');
    const member = guild.members.cache.get(user.id);

    const errEmbed = new EmbedBuilder()
      .setTitle('🛑  Błąd')
      .setColor('#ff0000')
      .setDescription(`Nie możesz wyciszyć osoby z wyższą rolą.`);

    const succesEmbed = new EmbedBuilder()
      .setTitle('🔈 Odblokowano')
      .addFields(
        { name: 'Użytkownik:', value: `${member}` },
        { name: 'Moderator:', value: `${interaction.user}` }
      )
      .setColor('#00ff00')
      .setTimestamp();

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    ) {
      return interaction.reply({
        content: 'Coś poszło nie tak, Spróbuj ponownie później',
        ephemeral: true,
      });
    }

    try {
      await member.timeout(null);

      await interaction.reply({ embeds: [succesEmbed] });

      if (!user.bot) {
        const embedDM = new EmbedBuilder()
          .setTitle('🔈 Zostałeś odblokowany!')
          .setColor('#00ff00')
          .addFields(
            { name: 'Serwer:', value: `${interaction.guild.name}` },
            { name: 'Modarator:', value: `${interaction.member}` }
          );

        async function sendEmbed(recipientID, embedDM) {
          const recipient = await client.users.fetch(recipientID);
          const dmChannel = await recipient.createDM();
          await dmChannel.send({ embeds: [embedDM] });
        }

        sendEmbed(user.id, embedDM);
      }
    } catch (error) {
      return interaction.reply({
        content: 'Coś poszło nie tak, Spróbuj ponownie później',
        ephemeral: true,
      });
    }
  },
};
