const { verifiedRoleID } = require('../../security/config.json');
const spotifySearchSchema = require('../../Models/Spotify');
const { spotifyApi } = require('../../main');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

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

      if (customId == 'play') {
        try {
          const spotifyPlay = new spotifySearchSchema({
            messID: interaction.message.id,
          });

          const messageID = spotifyPlay.messID;
          const message = await interaction.channel.messages.fetch(messageID);

          const embed = message.embeds[0];
          const fields = embed.fields;

          const req = fields[0].value;
          // Wyszukujemy playlistę na Spotify
          const res = await spotifyApi.searchPlaylists(`${req}`, { limit: 1 });

          // Pobieramy pierwszy wynik wyszukiwania
          const firstResult = res.body.playlists.items[0];

          // Tworzymy link do playlisty
          const playlistLink = firstResult.external_urls.spotify;

          interaction.reply({ content: `${playlistLink}`, ephemeral: true });
        } catch (err) {
          return interaction.reply({
            content: 'Coś poszło nie tak! Spróbuj ponownie później.',
            ephermaly: true,
          });
        }
      }

      if (customId == 'wiadomosc-mess') {
        try {
          const mess = interaction.message.id;

          const message = await interaction.channel.messages.fetch(mess);
          const embed = await message.embeds[0];
          const fields = await embed.fields.map((field) => {
            const value = field.value.slice(3, -3);
            return { ...field, value };
          });

          if (interaction.user.id !== message.interaction.user.id) {
            const err1 = new EmbedBuilder()
              .setTitle('Błąd')
              .setColor(0xff0000)
              .setDescription(
                'Nie możesz użyć buttona ponieważ nie jesteś **autorem komendy**'
              );
            return interaction.message.edit({ embeds: [err1] });
          }

          const req = await fields[0].value;
          const messageUser = await interaction.channel.messages.fetch(req);
          const messFin = messageUser.content;

          if (messFin) {
            const messageEmbed = new EmbedBuilder()
              .setTitle('💭・Wiadomość')
              .setColor('Random')
              .setDescription(`Treść wiadomości: \n \`\`\`${messFin}\`\`\``);

            setTimeout(() => {
              interaction.message.edit({
                embeds: [messageEmbed],
                components: [],
                content: '',
              });
            }, 350);
          } else {
            return interaction.message.edit({
              content:
                '**Wiadomośc musi być na czacie przynajmniej `3 sek` lub nie jest wiadomością!**',
              embeds: [],
              components: [],
            });
          }
        } catch (err) {
          interaction.message.edit({
            content: 'Wystąpił błąd',
            embeds: [],
            components: [],
          });
        }
      }

      if (customId == 'wiadomosc-embed') {
        try {
          const mess = interaction.message.id;

          const message = await interaction.channel.messages.fetch(mess);
          const embed = await message.embeds[0];
          const fields = await embed.fields.map((field) => {
            const value = field.value.slice(3, -3);
            return { ...field, value };
          });

          if (interaction.user.id !== message.interaction.user.id) {
            const err1 = new EmbedBuilder()
              .setTitle('Błąd')
              .setColor(0xff0000)
              .setDescription(
                'Nie możesz użyć buttona ponieważ nie jesteś **autorem komendy**'
              );
            return interaction.reply({ embeds: [err1], ephemeral: true });
          }

          const req = await fields[0].value;
          const embedUser = await interaction.channel.messages.fetch(req);
          const embedUs = embedUser.embeds[0];
          const title = embedUs?.title ?? '';
          const { name, iconURL } = embedUs?.author ?? '';
          const description = embedUs?.description ?? '';
          const field = embedUs?.fields ?? [];
          let color = embedUs?.color ?? 'Random';
          const { url } = embedUs?.image ?? '';
          let thumbnail = embedUs?.thumbnail ?? '';
          const { text } = embedUs?.footer ?? '';

          const embed2 = new EmbedBuilder().setTitle(title);

          thumbnail = thumbnail.url;

          if (name) {
            embed2.setAuthor({
              name,
              iconURL,
            });
          }
          if (description.length > 0) {
            embed2.setDescription(description);
          }
          if (field) {
            embed2.addFields(field);
          }

          if (color == 'Random') {
            embed2.setColor(`Random`);
          } else {
            embed2.setColor(color);
          }
          if (url) {
            embed2.setImage(url);
          }
          if (thumbnail) {
            embed2.setThumbnail(thumbnail);
          }
          if (text) {
            embed2.setFooter({ text: text });
          }

          if (embed2) {
            interaction.message.edit({
              content: '',
              embeds: [embed2],
              components: [],
            });
          } else {
            return interaction.reply({
              content: 'Wiadomośc musi być na czacie przynajmniej `3 sek`',
              embeds: [],
              components: [],
            });
          }
        } catch (error) {
          return interaction.message.edit({
            content: '**Wiadomość nie jest embedem!**',
            embeds: [],
            components: [],
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
