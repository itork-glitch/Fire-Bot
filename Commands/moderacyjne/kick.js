const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wyrzuc')
    .setDescription('Wyrzuć użytkownika z serwera.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName('uzytkownik')
        .setDescription('Użytkownik który zostanie wyrzucony')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('powod')
        .setDescription('Dodaj powód wyrzucenia')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { channel, options } = interaction;

    const user = options.getUser('uzytkownik');
    const reason = options.getString('powod');

    const member = await interaction.guild.members.fetch(user.id);

    const errEmbed = new EmbedBuilder()
      .setTitle('🛑  Brak uprawnień!')
      .setColor('#ff0000')
      .setDescription(
        `Nie możesz wykonać tej operacji dla ${user.username} ponieważ ma wyższą role.`
      );

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('Wyrzucono użytkownika')
      .setColor('#ff0000')
      .addFields(
        { name: 'Użytkownik:', value: `${user}` },
        { name: 'Powód:', value: `${reason}` },
        { name: 'Admin:', value: `${interaction.member}` }
      )
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });

    if (!user.bot) {
      const embedDM = new EmbedBuilder()
        .setTitle('Zostałeś wyrzucony')
        .setColor('#ff0000')
        .addFields(
          { name: 'Serwer:', value: `${interaction.guild.name}` },
          { name: 'Powód:', value: `${reason}` },
          { name: 'Admin:', value: `${interaction.member}` }
        );

      async function sendEmbed(recipientID, embedDM) {
        const recipient = await client.users.fetch(recipientID);
        const dmChannel = await recipient.createDM();
        await dmChannel.send({ embeds: [embedDM] });
      }

      sendEmbed(user.id, embedDM);
    }

    setTimeout(async () => {
      await member.kick(reason);
    }, 2000);
  },
};
