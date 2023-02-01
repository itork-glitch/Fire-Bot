const { Client } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  description: 'Ping!',
  execute(client) {
    console.log(`${client.user.username} is online`);
  },
};
