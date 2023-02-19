const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('data')
    .setDescription('Stwórz odliczanie do daty.')
    .addNumberOption((option) =>
      option.setName('dzień').setDescription('test').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('miesiąc')
        .setDescription('test')
        .setRequired(true)
        .addChoices(
          { name: 'Styczeń', value: '1' },
          { name: 'Luty', value: '2' },
          { name: 'Marzec', value: '3' },
          { name: 'Kwiecień', value: '4' },
          { name: 'Maj', value: '5' },
          { name: 'Czerwiec', value: '6' },
          { name: 'Lipiec', value: '7' },
          { name: 'Sierpień', value: '8' },
          { name: 'Wrzesień', value: '9' },
          { name: 'Październik', value: '10' },
          { name: 'Listopad', value: '11' },
          { name: 'Grudzień', value: '12' }
        )
    )
    .addNumberOption((option) =>
      option.setName('rok').setDescription('test').setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('godzina').setDescription('test').setRequired(false)
    )
    .addIntegerOption((option) =>
      option.setName('minuty').setDescription('test').setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const day = options.getNumber('dzień');
    const monthString = options.getString('miesiąc');
    const year = options.getNumber('rok');
    const hour = options.getInteger('godzina') || 12;
    const minute = options.getInteger('minuty') || 30;

    const month = parseInt(monthString) - 1;

    if (day > 31) {
      return interaction.reply({
        content: 'Miesiąc ma max 31 dni.',
        ephemeral: true,
      });
    }

    if (day < 1) {
      return interaction.reply({
        content: 'Nie ma ujemnych dni.',
        ephemeral: true,
      });
    }

    if (hour < 1) {
      return interaction.reply({
        content: 'Nie ma ujemnych godzin.',
        ephemeral: true,
      });
    }

    if (hour > 24) {
      return interaction.reply({
        content: 'Dzień ma 24 godziny.',
        ephemeral: true,
      });
    }

    if (hour == 0) {
      return interaction.reply({
        content:
          'Jeśli chesz dać godzine np: `0:30` musisz podać dzień poprzedni i godzine np: `24:30`',
        ephemeral: true,
      });
    }

    if (minute < 1) {
      return interaction.reply({
        content: 'Nie ma ujemnych minut.',
        ephemeral: true,
      });
    }

    if (minute > 60) {
      return interaction.reply({
        content: 'Godzina ma 60 minut.',
        ephemeral: true,
      });
    }

    if (year < 1900) {
      return interaction.reply({
        content: 'Zakres lat zaczyna się od 1900.',
        ephemeral: true,
      });
    }

    if (year > 2500) {
      return interaction.reply({
        content: 'Zakres lat kończy się na 2500.',
        ephemeral: true,
      });
    }

    if (month == 1) {
      if (day > 28) {
        return interaction.reply({
          content: 'Luty ma 28 dni.',
          ephemeral: true,
        });
      }
    }

    if (month == 3) {
      if (day > 30) {
        return interaction.reply({
          content: 'Kwiecień ma 30 dni.',
          ephemeral: true,
        });
      }
    }

    if (month == 5) {
      if (day > 30) {
        return interaction.reply({
          content: 'Czerwiec ma 30 dni.',
          ephemeral: true,
        });
      }
    }

    if (month == 8) {
      if (day > 30) {
        return interaction.reply({
          content: 'Wrzesień ma 30 dni.',
          ephemeral: true,
        });
      }
    }

    if (month == 10) {
      if (day > 30) {
        return interaction.reply({
          content: 'Listopad ma 30 dni.',
          ephemeral: true,
        });
      }
    }

    const date = new Date(year, month, day, hour, minute, 0, 0);
    const currDate = new Date();

    if (date > currDate) {
      const embed = new EmbedBuilder()
        .setTitle('📅・Odliczanie do daty')
        .setColor('Random')
        .setTimestamp()
        .setDescription(`Ten dzień będzie <t:${parseInt(date / 1000)}:R>`);

      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle('📆・Odliczanie od daty')
        .setColor('Random')
        .setTimestamp()
        .setDescription(`Ten dzień był <t:${parseInt(date / 1000)}:R>`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
