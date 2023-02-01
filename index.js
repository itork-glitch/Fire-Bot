const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');

const { token } = require('./security/config.json');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token).then(() => {
  loadEvents(client);
});
