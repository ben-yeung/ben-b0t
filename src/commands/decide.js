const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("decide")
    .setDescription("Let ben b0t decide for you!")
    .addStringOption((option) =>
      option.setName("choices").setDescription("format: [choice] or [choice] or ... [choice]").setRequired(true)
    ),
  options: "[choices]",
  async execute(interaction, args, client) {
    let options = interaction.options.getString("choices");
    options = options.split(" ");

    if (options.indexOf("or") > -1) {
      let orCount = 0;
      var i;
      for (i = 0; i < options.length; i++) {
        if (options[i].localeCompare("or") == 0) {
          orCount++;
        }
      }
      let choices = new Array(orCount + 1);
      let ind = 0;
      var c;
      let game = "";
      for (c = 0; c < options.length; c++) {
        if (options[c].localeCompare("or") != 0) {
          game += options[c] + " ";
          if (c == options.length - 1) {
            choices[ind] = game;
            break;
          }
        } else {
          choices[ind] = game;
          ind++;
          game = "";
        }
      }
      let choice = choices[Math.floor(Math.random() * choices.length)];

      let phrases = [
        "I asked my mom and she said you should",
        "My gut feeling says",
        "Local expert recommended you should",
        "Siri said",
        "If I were you I would",
        "This is a good choice:",
        "I would definitely choose",
        "Survey says:",
        "My gut says you should",
        "The obvious choice is",
        "If I were you I would",
      ];
      let phraseChoice = phrases[Math.floor(Math.random() * phrases.length)];
      return interaction.reply(`${phraseChoice} **${choice}**`);
    } else {
      return interaction.reply({
        content: "You must enter at least two choices separated by 'or' EX: /decide do homework or play basketball",
        ephemeral: true,
      });
    }
  },
};
