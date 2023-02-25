const { Client, ActivityType } = require('discord.js');
const mongoose = require('mongoose');

const { mongodb } = require('../../security/key.json');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongodb || '', {
      keepAlive: true,
    });

    if (mongoose.connect) {
      console.log(' Połączono z bazą danych.');
    }

    console.log(` Połączono z Spotify`);
    console.log(` Uruchomiono ${client.user.username}'a.`);
  },
};
