const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stwórz-role')
    .setDescription('Utwórz rolę do serwera')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption((option) =>
      option
        .setName('nazwa')
        .setDescription('Ustaw nazwę dla roli.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('kolor')
        .setDescription('Podaj kolor HEX roli.')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('pozycja')
        .setDescription('Podaj pozycje roli. (liczoną od dołu)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('widzialna')
        .setDescription(
          'Czy użytkownicy z tą rolą mają być wyświetlani oddzielnie?'
        )
        .setRequired(true)
        .addChoices(
          { name: 'Tak', value: 'nie' },
          { name: 'Nie', value: 'tak' }
        )
    ),

  async execute(interaction) {
    try {
      const { options } = interaction;
      const role = options.getString('nazwa');
      const color = options.getString('kolor');
      const pos = options.getNumber('pozycja');
      let hoist = options.getString('widzialna');
      let roleID = '';

      if (hoist == 'tak') {
        hoist = false;
      }

      if (hoist == 'nie') {
        hoist = true;
      }

      hoist = Boolean(hoist);

      await interaction.guild.roles
        .create({
          name: role,
          color: color,
        })
        .then(async (role) => {
          roleID = role.id;
        });

      const guildRole = interaction.guild.roles.cache.get(`${roleID}`);
      await guildRole.setPosition(pos);
      await guildRole.setHoist(hoist);

      let hoistOpt = '';

      if (hoist == true) {
        hoistOpt = 'Tak';
      }

      if (hoist == false) {
        hoistOpt = 'Nie';
      }

      const embed = new EmbedBuilder()
        .setTitle('✅・Stworzono role')
        .setColor('Aqua')
        .addFields(
          { name: 'Nazwa:', value: `<@&${roleID}>` },
          { name: 'Kolor:', value: `\`${color}\``, inline: true },
          { name: 'Pozycja:', value: `\`${pos}\``, inline: true },
          { name: 'Widzialna:', value: `\`${hoistOpt}\`` },
          { name: 'Administrator:', value: `${interaction.member}` }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({
        content: 'Nie prawidłowy kod koloru HEX',
        ephemeral: true,
      });
    }
  },
};
