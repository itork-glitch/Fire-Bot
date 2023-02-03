const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zaproszenie')
    .setDescription('Utwórz zaproszenie do tego serwera')
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
    .addNumberOption((option) =>
      option
        .setName('użyć')
        .setDescription('Podaj ilość użyć')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;

    let use = options.getNumber('użyć') || 0;

    try {
      const invite = await interaction.channel.createInvite({
        maxAge: 86400, // 24h
        maxUses: use, // get number from option
      });

      if (use == 0) {
        use = '♾️';
      }

      const embed = new EmbedBuilder()
        .setTitle('🔗 Link zaproszenia')
        .setColor('#00ff00')
        .addFields(
          { name: 'Link:', value: `\`${invite}\`` },
          { name: 'Dla:', value: `${interaction.member}`, inline: true },
          { name: 'Użyć:', value: `\`${use}\``, inline: true },
          { name: 'Aktywne:', value: '24 Godziny', inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errEmbed = new EmbedBuilder()
        .setTitle('❌ Nie można stworzyć linku zaproszenia')
        .setDescription('Wystąpił błąd podczas tworzenia linku zaproszenia')
        .setColor('#ff0000')
        .setTimestamp();

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
