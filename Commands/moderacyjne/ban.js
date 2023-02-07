const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Zbanuj użytkownika na tym serwerze.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Wybierz użytkownika.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('powód')
        .setDescription('Podaj powód zbanowania.')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    const user = options.getUser('użytkownik');
    const reason = options.getString('powód');

    const member = await interaction.guild.members.fetch(user.id);

    const errEmbed = new EmbedBuilder()
      .setTitle('🛑  Brak uprawnień!')
      .setColor('#ff0000')
      .setDescription(
        `Nie możesz wykonać tej operacji dla ${user.username} ponieważ ma wyższą role od ciebie.`
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
      .setTitle('☠️ Zbanowano użytkownika!')
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
        .setTitle('Zostałeś zbanowany!')
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
      await member.ban({ reason });
    }, 2000);
  },
};
