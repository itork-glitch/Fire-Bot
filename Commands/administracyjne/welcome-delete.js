const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
  Client,
  Integration,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usun-wecome')
    .setDescription(
      'Ta komenda zleci developerowi wyszczyszczenie konfiguracji z bazy danych.'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName('id').setDescription('Podaj ID serwera').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('powód')
        .setDescription(
          'Podaj powód dlaczego mam usunąć ten zapis z bazy danych.'
        )
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    const serverID = options.getString('id');
    const reson = options.getString('powód');

    const embed = new EmbedBuilder()
      .setTitle('📣  Nowe zgłoszenie!')
      .setDescription('Nowa prośba o usunięcie zapisu z bazy danych!')
      .setColor('#ff0000')
      .addFields(
        { name: 'ID serwera:', value: serverID, inline: true },
        { name: 'Rodzaj:', value: 'System Powitań', inline: true },
        { name: 'Serwer:', value: `${interaction.guild.name}`, inline: true },
        {
          name: 'Wysłana przez:',
          value: `${interaction.member}`,
          inline: true,
        },
        { name: 'Powód:', value: `${reson}`, inline: true }
      )
      .setTimestamp();

    async function sendEmbed(recipientID, embed) {
      const recipient = await client.users.fetch(recipientID);
      const dmChannel = await recipient.createDM();
      await dmChannel.send({ embeds: [embed] });
    }

    sendEmbed('789137891192340550', embed);

    interaction.reply({
      content: 'Pomyślnie wysłano do dewelopera',
      ephemeral: true,
    });
  },
};
