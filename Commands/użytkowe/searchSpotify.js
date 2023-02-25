const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { constants } = require('fs/promises');

const spotifyApi = require('../../main').spotifyApi;
const spotifySearchSchema = require('../../Models/Spotify');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Wyszukaj utwór/playliste na Spotify')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('utwór')
        .setDescription('znajdz utwór na spotify.')
        .addStringOption((option) =>
          option
            .setName('nazwa')
            .setDescription('Podaj nazwę utworu')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playlista')
        .setDescription('Znajdz playliste na spotify')
        .addStringOption((option) =>
          option
            .setName('nazwa')
            .setDescription('Podaj nazwę playlisty')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options } = interaction;

    const sub = options.getSubcommand(['utwór', 'playlista']);

    switch (sub) {
      case 'utwór':
        // Pobieramy nazwę utworu z opcji
        const songName = interaction.options.getString('nazwa');

        try {
          // Wyszukujemy utwór w Spotify
          const searchResult = await spotifyApi.searchTracks(
            `track:${songName}`
          );

          // Sprawdzamy czy znaleziono jakieś utwory
          if (searchResult.body.tracks.items.length === 0) {
            await interaction.reply({
              content: `Nie znaleziono utworu o nazwie "${songName}" na Spotify.`,
              ephemeral: true,
            });
            return;
          }

          // Pobieramy pierwszy wynik wyszukiwania
          const firstResult = searchResult.body.tracks.items[0];

          // Tworzymy link do utworu
          const songLink = firstResult.external_urls.spotify;

          const imageUrl = firstResult.album.images[0].url;

          let album = firstResult.album.name;

          if (firstResult.name == firstResult.album.name) {
            album = 'Singiel';
          }

          let existingSearch = await spotifySearchSchema
            .findOne({
              string: songName,
            })
            .exec();

          if (!existingSearch) {
            // Jeśli nie istnieje, stwórz nowy wpis w bazie danych
            const newSearch = new spotifySearchSchema({
              messID: interaction.id,
            });

            await newSearch.save();
          }

          const embed = new EmbedBuilder()
            .setTitle(`:notes:・Spotify`)
            .setColor('Random')
            .addFields(
              {
                name: 'Utwór:',
                value: `\`\`\`${firstResult.name}\`\`\``,
                inline: true,
              },
              { name: 'Album:', value: `\`\`\`${album}\`\`\``, inline: true },
              {
                name: 'Artysta:',
                value: `
          \`\`\`${firstResult.artists[0].name}\`\`\``,
                inline: true,
              }
            )
            .setImage(imageUrl);

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('Link')
              .setLabel('🔈 Posłuchaj podglądu')
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setLabel('🔥 Posłuchaj w przeglądarce')
              .setStyle(ButtonStyle.Link)
              .setURL(`${songLink}`)
          );

          // Wysyłamy odpowiedź na interakcję użytkownika z embedem
          await interaction.reply({ embeds: [embed], components: [row] });
        } catch (err) {
          return await interaction.reply({
            content: 'Wystąpił błąd podczas wyszukiwania utworu na Spotify.',
            ephemeral: true,
          });
        }
        break;

      case 'playlista':
        // Pobieramy nazwę playlisty z opcji
        const playlistName = interaction.options.getString('nazwa');

        try {
          // Wyszukujemy playlistę na Spotify
          const searchResult = await spotifyApi.searchPlaylists(
            `${playlistName}`,
            { limit: 1 }
          );

          // Sprawdzamy czy znaleziono jakiekolwiek playlisty
          if (searchResult.body.playlists.items.length === 0) {
            await interaction.reply({
              content: `Nie znaleziono playlisty o nazwie "${playlistName}" na Spotify.`,
              ephemeral: true,
            });
            return;
          }

          // Pobieramy pierwszy wynik wyszukiwania
          const firstResult = searchResult.body.playlists.items[0];

          // Tworzymy link do playlisty
          const playlistLink = firstResult.external_urls.spotify;

          const playlistImage = firstResult.images[0].url;

          const data = new spotifySearchSchema({
            messID: interaction.id,
          });

          await data.save();

          // Wyświetlamy informacje o playlisty
          const embed = new EmbedBuilder()
            .setTitle(`:notes:・Spotify`)
            .setColor('Random')
            .addFields(
              {
                name: 'Nazwa:',
                value: `\`\`\`${firstResult.name}\`\`\``,
                inline: true,
              },
              {
                name: 'Utworów:',
                value: `\`\`\`${firstResult.tracks.total}\`\`\``,
                inline: true,
              },
              {
                name: 'Autor:',
                value: `\`\`\`${firstResult.owner.display_name}\`\`\``,
                inline: true,
              }
            )
            .setImage(playlistImage);

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('play')
              .setLabel('Podgląd')
              .setStyle(ButtonStyle.Success)
              .setEmoji('▶️'),

            new ButtonBuilder()
              .setLabel('🔥 Posłuchaj w przeglądarce')
              .setStyle(ButtonStyle.Link)
              .setURL(`${playlistLink}`)
          );

          interaction.reply({ embeds: [embed], components: [row] });

          break;
        } catch (err) {
          console.log(err);
        }
    }
  },
};
