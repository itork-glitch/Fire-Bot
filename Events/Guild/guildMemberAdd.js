const { EmbedBuilder } = require('@discordjs/builders');

const { guildID, userRoleID } = require('../../security/config.json');
const Welcome = require('../../Models/Welcome');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    Welcome.findOne({ Guild: member.guild.id }, async (err, data) => {
      if (!data) return;

      let channel = data.Channel;
      let Msg = data.Msg || ' ';
      let Role = data.Role;

      const { user, guild } = member;
      const welcomeChannel = member.guild.channels.cache.get(data.Channel);

      const welcomeEmbed = new EmbedBuilder()
        .setTitle('**Nowy członek serwera!**')
        .setDescription(data.Msg)
        .setColor(0x00ff00)
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      welcomeChannel.send({ embeds: [welcomeEmbed] });
      member.roles.add(data.Role);
    });
  },
};
