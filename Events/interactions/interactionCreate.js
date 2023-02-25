const { verifiedRoleID } = require('../../security/config.json');
const spotifySearchSchema = require('../../Models/Spotify');
const { spotifyApi } = require('../../main');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: 'outdated command' });
      }
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      if (customId == 'weryfikacja') {
        const role = interaction.guild.roles.cache.get(`${verifiedRoleID}`);
        return interaction.member.roles.add(role).then((member) =>
          interaction.reply({
            content: `Otrzymałeś role: ${role}`,
            ephemeral: true,
          })
        );
      }

      if (customId == 'Link') {
        try {
          const spotifyDoc = new spotifySearchSchema({
            messID: interaction.message.id,
          });
          const messageId = spotifyDoc.messID;

          const message = await interaction.channel.messages.fetch(messageId);

          const embed = message.embeds[0];
          const fields = embed.fields;

          const firstField = fields[0].value;
          let secondField = fields[1].value;
          const thirdField = fields[2].value;

          if ((secondField = 'Singiel')) {
            secondField = ' ';
          }

          const req = firstField + ' ' + secondField + ' ' + thirdField;

          const searchResult = await spotifyApi.searchTracks(`track:${req}`);

          const firstResult = searchResult.body.tracks.items[0];

          const songLink = firstResult.external_urls.spotify;

          if (spotifyDoc) {
            await interaction.reply({
              content: `${songLink}`,
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: 'Nie znaleziono dokumentu o podanych wartościach.',
              ephemeral: true,
            });
          }
        } catch (err) {
          console.error(`Błąd przy pobieraniu linku do piosenki: ${err}`);
          await interaction.reply({
            content: 'Wystąpił błąd podczas pobierania linku do piosenki.',
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      if (customId == 'reaction-roles') {
        for (let i = 0; i < values.length; i++) {
          const roleId = values[i];

          const role = guild.roles.cache.get(roleId);
          const hasRole = member.roles.cache.has(roleId);

          switch (hasRole) {
            case true:
              member.roles.remove(roleId);
              break;
            case false:
              member.roles.add(roleId);
              break;
            default:
              console.log(
                'An error occured in the reaction-roles switch statement'
              );
              break;
          }
        }
        await interaction.reply({
          content: 'Twoje role zostały zaktualizowane.',
          ephemeral: true,
        });
      }
    }
  },
};
