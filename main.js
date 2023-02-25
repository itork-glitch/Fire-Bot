const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.config = require('./security/config.json');
const key = require('./security/key.json');

const SpotifyWebApi = require('spotify-web-api-node');

// Tworzymy instancję klienta Spotify
const spotifyApi = new SpotifyWebApi({
  clientId: key.spotifyID,
  clientSecret: key.spotifySecret,
});

// Pobieramy token dostępu za pomocą clientId i clientSecret
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    // Ustawiamy token jako autoryzację do Spotify API
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Błąd podczas pobierania tokenu dostępu Spotify.', err.message);
  }
);

client.commands = new Collection();

const configuration = new Configuration({
  organization: key.gptID,
  apiKey: key.gpt,
});
const openai = new OpenAIApi(configuration);

client.once(`ready`, () => {
  const statusList = [
    `🛹  ▏ ${client.guilds.cache.size} SERWERÓW`,
    '⛑️  ▏Użyj /pomoc',
    '🛠️  ▏Developer: Itork',
    '🪧  ▏Oznacz mnie po więcej info',
  ];
  setInterval(() => {
    const index = Math.floor(Math.random() * (statusList.length - 1) + 1);
    client.user.setActivity(statusList[index]);
  }, 5000); // 1 s = 1000 ms

  client.user.setStatus(`online`); // dnd, idle, online, invisible
});
client
  .login(key.token)
  .then(() => {
    loadCommands(client);
    loadEvents(client);
  })
  .catch((err) => console.log(err));

module.exports = { openai, spotifyApi };
