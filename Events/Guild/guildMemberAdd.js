const { EmbedBuilder, GuildMember } = require('discord.js');

const { guildID, userRoleID } = require('../../security/config.json');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    const { user, guild } = member.guild.channels.cache.get(`${guildID}`);
    const startChanel = guild.channels.cache.get(`${guildID}`);

    const welcomeEmbed = new EmbedBuilder()
      .setTitle('**Nowy członek!**')
      .setDescription(`Hej <@${member.id}> witamy na serwerze!`)
      .setColor(0x037821)
      .addFields({ name: 'Członków', value: `${guild.memberCount}` })
      .setTimestamp();

    startChanel.send({ embeds: [welcomeEmbed] });

    console.log(`\n \n${member.user.tag} dołączył do serwera!`);
    member.roles.add(userRoleID);
  },
};
