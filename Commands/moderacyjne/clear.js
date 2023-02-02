const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wyczysc')
    .setDescription('Usuń wybraną ilość wiedomości z kanału.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName('ilość')
        .setDescription('Wpisz ilość wiadomości do usunięcia.')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription(
          'Wybierz użytkownika od którego chesz usunąć wiadomości.'
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const { channel, options } = interaction;
    const amount = options.getInteger('ilość');
    const target = options.getUser('użytkownik');

    const messages = await channel.messages.fetch({
      limit: amount + 1,
    });

    const res = new EmbedBuilder()
      .setColor('Green')
      .setTitle('🧹  Czyszczenie Wiadomości')
      .setTimestamp();

    if (target) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg) => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `Pomyślnie usunięto ${messages.size} wiadomości od ${target}.`
        );
        interaction.reply({ embeds: [res] });
      });
    } else {
      await channel.bulkDelete(messages).then((messages) => {
        res.setDescription(
          `Pomyślnie usunięto ${messages.size - 1} wiadomości.`
        );
        interaction.reply({ embeds: [res] });
      });
    }
  },
};
