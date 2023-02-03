const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user-info')
    .setDescription('Zobacz informacje o użytkowniku')
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Wybierz użytkownika.')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser('użytkownik') || interaction.user;
    const member = await interaction.guild.members.cache.get(user.id);
    const icon = user.displayAvatarURL();
    const tag = user.tag;

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setAuthor({ name: tag, iconURL: icon })
      .addFields(
        { name: 'Nazwa:', value: `${user}` },
        {
          name: 'Role:',
          value: `${member.roles.cache.map((r) => r).join(``)}`,
        },
        {
          name: 'Dołączył do serwera:',
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Dołączył do discord'a:",
          value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`,
          inline: true,
        }
      )
      .setFooter({ text: `ID użytkownika: ${user.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
