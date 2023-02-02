const {
  ComponentBuilder,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Integration,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pomoc')
    .setDescription('Lista wszyskich komend tego bota.'),
  async execute(interaction) {
    const emojis = {
      informacyjne: { name: '📝' },
      moderacyjne: { name: '👮' },
      administracyjne: { name: '🫀' },
      testowe: { name: '⚙️' },
      użytkowe: { name: '🔧' },
    };

    const directories = [
      ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categores = directories.map((dir) => {
      const getCommands = interaction.client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
              cmd.data.description || 'Ta komenda nie posiada opisu.',
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder()
      .setDescription('Wybierz kategorie z menu.')
      .setColor('Random');

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help-menu')
          .setPlaceholder('Wybierz kategorie')
          .setDisabled(state)
          .addOptions(
            categores.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLocaleLowerCase(),
                description: `Komendy z kategori ${cmd.directory}`,
                emoji: emojis[cmd.directory.toLocaleLowerCase()],
              };
            })
          )
      ),
    ];

    const intMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
    });

    collector.on('collect', (interaction) => {
      const [directory] = interaction.values;
      const category = categores.find(
        (x) => x.directory.toLocaleLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${formatString(directory)} komendy`)
        .setColor('Green')
        .setDescription(`Lista wszyskich komend z kategori ${directory}`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: `${cmd.description}`,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', () => {
      intMessage.edit({
        components: components(true),
      });
    });
  },
};
