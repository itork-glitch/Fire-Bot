const {
  Client,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'messageCreate',

  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { author, guild, content } = message;
    const { user } = client;
    const a1 = '`';
    const { version } = require('../../package.json');

    if (!guild || author.bot) return;
    if (content.includes('@here') || content.includes('@everyone')) return;
    if (!content.includes(user.id)) return;

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setTitle('⛑️ ┃ **Fire Bot**')
          .setDescription(
            `Hej <@${author.id}> jestem wielozadaniowym botem który pomoże ci w prowadzeniu własego serwera lub przyjemnego korzystania z niego. Oferuje dużo komend każdej kategori. A nazywam się **Fire Bot**. Miłej zabawy :)`
          )
          .setFields(
            { name: 'Deweloper:', value: `<@${author.id}>`, inline: true },
            { name: 'Wersja bota:', value: `${version}`, inline: true },
            { name: 'Użyj aby poznać komendy:', value: `\`/pomoc\`` },
            { name: 'Dowiedz się więcej o mnie:', value: `\`/bot-info\`` }
          ),
      ],
    });
  },
};
