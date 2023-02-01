const { EmbedBuilder, GuildMember, WelcomeChannel } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    const { user, guild } =
      member.guild.channels.cache.get('926040106987569203');
    const welcomeMessage = `Hej <@${member.id}> witamy na serwerze!`;
    const startChanel = guild.channels.cache.get('926040106987569203');

    startChanel.send({ content: welcomeMessage });

    console.log(`\n \n${member.user.tag} dołączył do serwera!`);
  },
};
