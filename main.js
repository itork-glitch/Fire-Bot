const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require('discord.js');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.config = require('./security/config.json');
client.key = require('./security/key.json');

client.once(`ready`, () => {
  const statusList = [
    `🛹  ▏ ${client.guilds.cache.size} SERWERÓW`,
    '⛑️  ▏Użyj /pomoc',
    '🛠️  ▏Developer: Itork',
  ];
  setInterval(() => {
    const index = Math.floor(Math.random() * (statusList.length - 1) + 1);
    client.user.setActivity(statusList[index]);
  }, 5000); // 1 s = 1000 ms

  client.user.setStatus(`online`); // dnd, idle, online, invisible
});
client
  .login(client.key.token)
  .then(() => {
    loadCommands(client);
    loadEvents(client);
  })
  .catch((err) => console.log(err));
