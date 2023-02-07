const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDMPermission(false)
    .setDescription('Wyślij wiadomość użytkownikowi na pv.')
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Użytkownik')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('wiadomość').setDescription('Wiadomość').setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('użytkownik');
    const message = interaction.options.getString('wiadomość');

    if (!user.bot) {
      const embed = new EmbedBuilder()
        .setTitle('Wiadomość')
        .setColor('Random')
        .setDescription(
          `Wiadomość od użytkownika ${interaction.member} \n\n ${message}`
        );
      async function sendEmbed(recipientID, embed) {
        const recipient = await interaction.options.getUser('użytkownik');
        const dmChannel = await recipient.createDM();
        await dmChannel.send({ embeds: [embed] });
      }

      sendEmbed(user.id, embed);

      interaction.reply({
        content: 'Wiadomość została wysłana.',
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: 'Użytkownik jest botem!',
        ephemeral: true,
      });
    }
  },
};
