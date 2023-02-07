const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zaproszenie')
    .setDMPermission(false)
    .setDescription('Utwórz zaproszenie do tego serwera')
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
    .addNumberOption((option) =>
      option
        .setName('użyć')
        .setDescription('Podaj ilość użyć')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('wygasa')
        .setDescription('Podaj ile ten link ma być aktywny.')
        .setRequired(false)
        .addChoices(
          { name: '1h', value: '3600' },
          { name: '2h', value: '7200' },
          { name: '6h', value: '21600' },
          { name: '12h', value: '43200' },
          { name: '1 dzień', value: '86400,' },
          { name: '2 dni', value: '172800' }
        )
    ),

  async execute(interaction) {
    const { options } = interaction;

    let use = options.getNumber('użyć') || 0;
    let age = options.getString('wygasa') || 0;

    let ag = parseInt(age);

    if (use >= 100) {
      return interaction.reply({
        content:
          'Maksymalna ilość osób do zaproszenia jednym linkiem to 99. \n Jeśli chesz zaprosić więcej osób stwórz **zaproszenie nielimitowane** nie dodająć żadnej opcji.',
        ephemeral: true,
      });
    }

    try {
      const invite = await interaction.channel.createInvite({
        maxAge: ag, // 24h
        maxUses: use, // get number from option
      });

      if (use == 0) {
        use = '♾️';
      }

      if (ag == 0) {
        ag = '♾️';
      }

      if (ag == 3600) {
        ag = 'Godzina';
      }

      if (ag == 7200) {
        ag = '2 Godziny';
      }

      if (ag == 21600) {
        ag = '6 Godzin';
      }

      if (ag == 43200) {
        ag = '12 Godzin';
      }

      if (ag == 86400) {
        ag = '1 Dzień';
      }

      if (ag == 172800) {
        ag = '2 Dni';
      }

      const embed = new EmbedBuilder()
        .setTitle('🔗 Link zaproszenia')
        .setColor('#00ff00')
        .addFields(
          { name: 'Link:', value: `\`${invite}\`` },
          { name: 'Dla:', value: `${interaction.member}`, inline: true },
          { name: 'Użyć:', value: `\`${use}\``, inline: true },
          { name: 'Aktywne:', value: `\`${ag}\``, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], content: `${invite}` });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle('❌ Nie można stworzyć linku zaproszenia')
        .setDescription('Wystąpił błąd podczas tworzenia linku zaproszenia')
        .setColor('#ff0000')
        .setTimestamp();

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
