const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('awatar')
    .setDescription('Wyświetl awatar stwój albo użytkownika.')
    .addUserOption((option) =>
      option
        .setName('użytkownik')
        .setDescription('Użytkownik')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser('użytkownik') || interaction.user;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`🖼️・Awatar użytkownika ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(
        `Rozmiary awatara: \n [2048px](${user.displayAvatarURL({
          dynamic: true,
          size: 2048,
        })}) | [1024px](${user.displayAvatarURL({
          dynamic: true,
          size: 1024,
        })}) | [512px](${user.displayAvatarURL({
          dynamic: true,
          size: 512,
        })}) | [256px](${user.displayAvatarURL({ dynamic: true, size: 256 })})`
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
