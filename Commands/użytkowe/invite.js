const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zaproszenie')
    .setDescription('Utwórz zaproszenie do tego serwera')
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite),

  async execute(interaction) {
    try {
      const invite = await interaction.channel.createInvite({
        maxAge: 0, // Unlimited time
        maxUses: 0, // Unlimited uses
      });

      const embed = new EmbedBuilder()
        .setTitle('🔗 Link zaproszenia')
        .setColor('#00ff00')
        .addFields({ name: 'Link:', value: `${invite}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
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
