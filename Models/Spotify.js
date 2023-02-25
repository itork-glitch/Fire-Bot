const { Schema, model } = require('mongoose');

// Zdefiniuj schemat dla kolekcji w bazie danych
const spotifySearchSchema = new Schema({
  messID: String,
});

module.exports = model('SpotifySearch', spotifySearchSchema);
