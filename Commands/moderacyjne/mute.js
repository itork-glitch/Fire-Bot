const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wycisz')
    .setDMPermission(false)
    .setDescription('Tymczasowo zablokuj korzystanie z serwera danej osobie.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Użytkownik który zostanie wyciszony.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('czas')
        .setDescription('Podaj długość wyciszenia')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('powód')
        .setDescription('Podaj powód wyciszenia')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const { guild, options } = interaction;

    const user = options.getUser('użytkownik');
    const member = guild.members.cache.get(user.id);
    const time = options.getString('czas');
    const convertedTime = ms(time);
    const reason = options.getString('powód') || 'Nie podano powodu.';

    const errEmbed = new EmbedBuilder()
      .setTitle('🛑  Błąd')
      .setColor('#ff0000')
      .setDescription(`Nie możesz wyciszyć osoby z wyższą rolą.`);

    const succesEmbed = new EmbedBuilder()
      .setTitle('🔇 Wysiszono')
      .addFields(
        { name: 'Użytkownik:', value: `${member}` },
        { name: 'Czas wyciszania:', value: `${time}` },
        { name: 'Powód wyciszenia:', value: `${reason}` },
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

    if (!convertedTime) {
      return interaction.reply({
        content: 'Nie podano czasu wykluczenia.',
        ephemeral: true,
      });
    }

    try {
      await member.timeout(convertedTime, reason);

      await interaction.reply({ embeds: [succesEmbed] });

      if (!user.bot) {
        const embedDM = new EmbedBuilder()
          .setTitle('🔇 Zostałeś wyciszony!')
          .setColor('#ff0000')
          .addFields(
            { name: 'Serwer:', value: `${interaction.guild.name}` },
            { name: 'Powód:', value: `${reason}` },
            { name: 'Czas:', value: `${time}` },
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
