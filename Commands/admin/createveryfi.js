const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weryfikacja')
    .setDescription('Stwórz embeda z weryfikacją')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Ustaw kanał z weryfikacją')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    
    const veryfiEmbed = new EmbedBuilder()
      .setTitle('✅ Weryfikacja')
      .setDescription('Kliknj w button aby się zweryfikować.')
      .setColor('#00ff0d');

    let message;
    try {
      const channel = interaction.options.getChannel('channel');
      message = await channel.send({
        embeds: ([veryfiEmbed]),
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId('weryfikacja')
              .setLabel('Weryfikacja')
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });
    } catch (error) {
      return interaction.reply({
        content: 'Napotkano na błąd! Spróbuj ponownie poźniej.',
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: 'Weryfikacja została wysłana na kanał.',
      ephemeral: true,
    });
  },
};
