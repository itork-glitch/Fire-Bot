const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const cpuStat = require('cpu-stat');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('Informacje o bocie.'),

  execute(interaction, client) {
    const ping = client.ws.ping;
    const { version } = require('../../package.json');
    cpuStat.usagePercent(function (error, percent) {
      if (error)
        return interaction.reply({
          content: 'Nie udało się odczytać informacji z procesora',
          ephermaly: true,
        });

      const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
      const node = process.version;
      const cpu = percent.toFixed(2);
      const tag = client.user.username;
      const icon = client.user.displayAvatarURL();

      const embed = new EmbedBuilder()
        .setTitle('🤖・Informacje o mnie')
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(icon)
        .setColor('Random')
        .addFields(
          {
            name: '🧑‍💻・Deweloper',
            value: '<@789137891192340550>',
          },

          {
            name: '🧿・Nazwa:',
            value: `\`${client.user.username}\``,
            inline: true,
          },
          {
            name: 'Komend:',
            value: `\`${client.commands.size}\``,
            inline: true,
          },
          {
            name: 'Serwerów:',
            value: `\`${client.guilds.cache.size}\``,
            inline: true,
          },
          { name: '🆔・ID:', value: `\`${client.user.id}\``, inline: true },
          {
            name: '👶・Stworzony:',
            value: `\`9 listopada 2021\``,
          },
          {
            name: '⛑️・Główna komenda:',
            value: `\`/pomoc\``,
          },
          { name: '🏓・Ping:', value: `\`${ping}ms\`` },
          { name: '🔧・Wersja bota:', value: `\`${version}\``, inline: true },
          {
            name: '<:nodejs:914793134192484402>・Wersja node.js',
            value: `\`${node}\``,
            inline: true,
          },
          {
            name: '<:djs:914898152891506759>・Wersja discord.js',
            value: `\`v14.7.1\``,
            inline: true,
          },
          {
            name: '<:CPU:856577207320182795>・Użycie procesora',
            value: `\`${cpu}%\``,
          },
          { name: '🦾・Użycie RAM', value: `\`${memoryUsage}\`` }
        );

      interaction.reply({ embeds: [embed] });

      function formatBytes(a, b) {
        let c = 1024;
        d = b || 2;
        e = ['B', 'KB', 'MB', 'GB', 'TB'];
        f = Math.floor(Math.log(a) / Math.log(c));

        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
      }
    });
  },
};
