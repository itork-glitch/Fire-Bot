const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Integration,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dodaj-role')
    .setDescription('Dodaj role użytkownikowi lub sobie.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)
    .addRoleOption((option) =>
      option.setName('rola').setDescription('Wybierz rolę').setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Wybierz użytkownika.')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option.setName('powód').setDescription('Podaj powód.').setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;

    const role = options.getRole('rola');
    const user = options.getUser('użytkownik') || interaction.member;
    const reson = options.getString('powód') || 'Nie podano powodu.';

    const roleID = role.id;
    const member = await interaction.guild.members.fetch(user.id);

    try {
      member.roles.add(roleID);

      if (user.id == interaction.member.id) {
        const embed = new EmbedBuilder()
          .setTitle('✅・Otrzymałeś role!')
          .setColor('Green')
          .addFields(
            { name: 'Rola:', value: `${role}` },
            { name: 'Powód:', value: `${reson}` }
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle('✅・Dodano rolę!')
          .setColor('Green')
          .addFields(
            { name: 'Rola:', value: `${role}` },
            { name: 'Użytkownik:', value: `${user}` },
            { name: 'Powód:', value: `${reson}` },
            { name: 'Nadał:', value: `${interaction.member}` }
          )

          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
