const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionCollector,
} = require('discord.js');
const warningSchema = require('../../Models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ostrzeżenie')
    .setDescription('System ostrzeżeń.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('dodaj')
        .setDescription('Dodaj ostrzeżenie dla użytkownika.')
        .addUserOption((option) =>
          option
            .setName('użytkownik')
            .setDescription('Wybierz użytkownika.')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('powód')
            .setDescription('Podaj powód ostrzeżenia.')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('argument')
            .setDescription('Podaj argument ostrzeżenia.')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('sprawdź')
        .setDescription('Sprawdź ile ostrzeżeń ma użytkownik')
        .addUserOption((option) =>
          option
            .setName('użytkownik')
            .setDescription('Wybierz użytkownika.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('usuń')
        .setDescription('Usuń ostrzeżenie użytkownikowi.')
        .addUserOption((option) =>
          option
            .setName('użytkownik')
            .setDescription('Wybierz użytkownika.')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('id')
            .setDescription('Podaj ID ostrzeżenia')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('wyczyść')
        .setDescription('Usuń wszyskie ostrzeżenia użytkownikowi.')
        .addUserOption((option) =>
          option
            .setName('użytkownik')
            .setDescription('Wybierz użytkownika.')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options, guildId, user, member } = interaction;

    const sub = options.getSubcommand(['dodaj', 'sprawdź', 'usuń', 'wyczyść']);
    const target = options.getUser('użytkownik');
    const reason = options.getString('powód') || 'Nie podano powodu.';
    const evidence = options.getString('argument') || 'Nie podano argumentu.';
    const warnId = options.getInteger('id') - 1;
    const warnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    const userTag = `${target.username}#${target.discriminator}`;

    const embed = new EmbedBuilder();

    switch (sub) {
      case 'dodaj':
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              data = new warningSchema({
                GuildID: guildId,
                UserID: target.id,
                UserTag: userTag,
                Content: [
                  {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason,
                    Evidence: evidence,
                    Date: warnDate,
                  },
                ],
              });
            } else {
              const warnContent = {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason,
                Evidence: evidence,
                Date: warnDate,
              };
              data.Content.push(warnContent);
            }
            data.save();
          }
        );

        embed
          .setColor('Green')
          .setTitle('🛑・Dodano ostrzeżenie!')
          .addFields(
            { name: 'Użytkownik:', value: `${target}` },
            { name: 'Powód:', value: `${reason}` },
            { name: 'Argument:', value: `${evidence}` },
            { name: 'Moderator:', value: `${member}` }
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed] });

        const embedDM = new EmbedBuilder()
          .setTitle('🛑・Otrzymałeś ostrzeżenie!')
          .setColor('Red')
          .addFields(
            { name: 'Serwer:', value: `\`${interaction.guild.name}\`` },
            { name: 'Powód:', value: `${reason}` },
            { name: 'Argument:', value: `${evidence}` },
            { name: 'Moderator:', value: `${member}` }
          )
          .setTimestamp();

        async function sendEmbed(recipientID, embed) {
          const recipient = await interaction.options.getUser('użytkownik');
          const dmChannel = await recipient.createDM();
          await dmChannel.send({ embeds: [embed] });
        }

        sendEmbed(target.id, embedDM);

        break;
      case 'sprawdź':
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              embed
                .setColor('Green')
                .setDescription(
                  `${data.Content.map(
                    (w, i) =>
                      `**ID**: ${i + 1}
                            **Moderator**: ${w.ExecuterTag}
                            **Data**: ${w.Date}
                            **Powód**: ${w.Reason}
                            **Argument**: ${w.Evidence}\n\n
                            `
                  ).join(' ')}`
                )
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor('Red')
                .setDescription(`Użytkownik ${target} nie posiada ostrzeżeń!`)
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );

        break;
      case 'usuń':
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              data.Content.splice(warnId, 1);
              data.save();

              embed
                .setColor('Green')
                .setTitle('🔧・Usunęto ostrzeżenie!')
                .addFields(
                  { name: 'Użytkownik:', value: `${target}` },
                  { name: 'ID ostrzeżenia:', value: `\`${warnId + 1}\`` },
                  { name: 'Moderator:', value: `${member}` }
                )
                .setTimestamp();

              interaction.reply({ embeds: [embed] });

              const embedDM = new EmbedBuilder()
                .setTitle('⛑️・Usunięto ci ostrzeżenie!')
                .setColor('Red')
                .addFields(
                  { name: 'Serwer:', value: `\`${interaction.guild.name}\`` },
                  { name: 'ID ostrzeżenia:', value: `\`${warnId + 1}\`` },
                  { name: 'Moderator:', value: `${member}` }
                )
                .setTimestamp();

              async function sendEmbed(recipientID, embed) {
                const recipient = await interaction.options.getUser(
                  'użytkownik'
                );
                const dmChannel = await recipient.createDM();
                await dmChannel.send({ embeds: [embed] });
              }

              sendEmbed(target.id, embedDM);
            } else {
              embed
                .setColor('Red')
                .setDescription(`Użytkownik ${target} nie posiada ostrzeżeń!`)
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );
        break;
      case 'wyczyść':
        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              await warningSchema.findOneAndDelete({
                GuildID: guildId,
                UserID: target.id,
                UserTag: userTag,
              });

              embed
                .setColor('Green')
                .setTitle('🔧・Usunęto wszyskie ostrzeżenia!')
                .addFields(
                  { name: 'Użytkownik:', value: `${target}` },
                  { name: 'Moderator:', value: `${member}` }
                )
                .setTimestamp();

              interaction.reply({ embeds: [embed] });

              const embedDM = new EmbedBuilder()
                .setTitle('⛑️・Usunięto ci wszyskie ostrzeżenia!')
                .setColor('Red')
                .addFields(
                  { name: 'Serwer:', value: `\`${interaction.guild.name}\`` },
                  { name: 'Moderator:', value: `${member}` }
                )
                .setTimestamp();

              async function sendEmbed(recipientID, embed) {
                const recipient = await interaction.options.getUser(
                  'użytkownik'
                );
                const dmChannel = await recipient.createDM();
                await dmChannel.send({ embeds: [embed] });
              }

              sendEmbed(target.id, embedDM);
            } else {
              embed
                .setColor('Red')
                .setDescription(`Użytkownik ${target} nie posiada ostrzeżeń!`)
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );
        break;
    }
  },
};
