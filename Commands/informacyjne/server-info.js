const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  GuildVerificationLevel,
  GuildExplicitContentFilter,
  GuildNSFWLevel,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serwer-info')
    .setDescription('Informacje o serwerze!')
    .setDMPermission(false),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const a1 = '`';
    const { guild } = interaction;
    const { members, channels, emojis, roles, stickers } = guild;

    const sortedRoles = roles.cache
      .map((role) => role)
      .slice(1, roles.cache.size)
      .sort((a, b) => b.position - a.position);
    const userRoles = sortedRoles.filter((role) => !role.managed);
    const managedRoles = sortedRoles.filter((role) => role.managed);
    const botCount = members.cache.filter((member) => member.user.bot).size;

    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];

      for (const role of roles) {
        const roleString = `<@&${role.id}>`;

        if (roleString.length + totalLength > maxFieldLength) break;

        totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
        result.push(roleString);
      }

      return result.length;
    };

    const splitPascal = (string, separator) =>
      string.split(/(?=[A-Z])/).join(separator);
    const toPascalCase = (string, separator = false) => {
      const pascal =
        string.charAt(0).toUpperCase() +
        string
          .slice(1)
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      return separator ? splitPascal(pascal, separator) : pascal;
    };

    const getChannelTypeSize = (type) =>
      channels.cache.filter((channel) => type.includes(channel.type)).size;
    const { member } = interaction;

    const totalChannels = getChannelTypeSize([
      ChannelType.GuildText,
      ChannelType.GuildNews,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
      ChannelType.GuildForum,
      ChannelType.GuildPublicThread,
      ChannelType.GuildPrivateThread,
      ChannelType.GuildNewsThread,
      ChannelType.GuildCategory,
    ]);

    const a2 = '';

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🚀  Informacje o serwerze:  ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setTimestamp()
      .setImage(guild.bannerURL({ size: 1024 }))
      .addFields(
        {
          name: '➡️   Opis serwera:',
          value: `\`${guild.description || `Brak!\``}`,
          inline: true,
        },
        {
          name: '➡️   Główne Informacje:\n',
          value: [
            `🧑‍💻・Własciciel: <@${guild.ownerId}>`,
            `\n`,
            `🆔・ID: \`${guild.id}\``,
            `\n`,
            `🎆・Data utworzenia: <t:${parseInt(
              guild.createdTimestamp / 1000
            )}:R>`,
          ].join('\n'),
          inline: true,
        },
        {
          name: `➡️   Członkowie:`,
          value: [
            `🥳・Ilość użytkowników: \`${guild.memberCount - botCount}\``,
            `\n`,
            `🤖・Ilość botów: \`${botCount}\``,
          ].join('\n'),
          inline: true,
        },
        {
          name: `➡️   Role:`,
          value: `${
            userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') || 'Brak'
          }`,
        },
        {
          name: `➡️   Kanały:`,
          value: [
            `⌨️・Tekstowe: \`${getChannelTypeSize([
              ChannelType.GuildText,
              ChannelType.GuildForum,
              ChannelType.GuildNews,
            ])}\``,
            `\n`,
            `🔈・Głosowe: \`${getChannelTypeSize([
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice,
            ])}\``,
            `\n`,
            `💭・Wątki: \`${getChannelTypeSize([
              ChannelType.GuildPublicThread,
              ChannelType.GuildPrivateThread,
              ChannelType.GuildNewsThread,
            ])}\``,
            `\n`,
            `📂・Kategorie: \`${getChannelTypeSize([
              ChannelType.GuildCategory,
            ])}\``,
          ].join('\n'),
          inline: true,
        },
        {
          name: `➡️   Emotki i Naklejki:`,
          value: [
            `🙂・Zwykłe: \`${
              emojis.cache.filter((emoji) => !emoji.animated).size
            }\``,
            `\n`,
            `📡・Animowane: \`${
              emojis.cache.filter((emoji) => emoji.animated).size
            }\``,
            `\n`,
            `🩻・Naklejki \`${stickers.cache.size}\``,
          ].join('\n'),
          inline: true,
        },
        {
          name: '➡️   Nitro:',
          value: [
            `🎚️・Poziom boostów: \`${guild.premiumTier || 'Brak!'}\``,
            `\n`,
            `🔮・Ilość boostów: \`${guild.premiumSubscriptionCount}\``,
            `\n`,
            `🤑・Ilość boosterów: \`${
              guild.members.cache.filter(
                (member) => member.roles.premiumSubscriberRole
              ).size
            }\``,
          ].join('\n'),
          inline: true,
        },
        {
          name: '➡️   Baner:',
          value: guild.bannerURL() ? '** **' : `\`Brak!\``,
        }
      );
    ephemeral: true;
    return interaction.reply({ embeds: [embed] });
  },
};
