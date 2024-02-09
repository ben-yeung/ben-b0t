const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const superrequest = require("node-superfetch");
const { stripIndents } = require("common-tags");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Defines a given word from the Webster Dictionary")
    .addStringOption((option) => option.setName("word").setDescription("pick a word any word").setRequired(true)),
  options: "[word]",
  async execute(interaction, args, client) {
    const WEBSTER_KEY = botconfig.WEBSTER_KEY;
    try {
      const word = interaction.options.getString("word");
      if (!word.length) {
        return interaction.reply({ content: "Command format: /define [word]", ephemeral: true });
      }

      if (word.split(" ").length > 1) {
        return interaction.reply({ content: "Only one word at a time. Format: /define [word]", ephemeral: true });
      }

      const { body } = await superrequest.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`).query({
        key: WEBSTER_KEY,
      });

      if (!body.length) return interaction.reply("Could not find any results.");
      const data = body[0];

      if (typeof data === "string") return interaction.reply(`Could not find any results. Did you mean **${data}**?`);
      if (data.fl === undefined) return interaction.reply(`Could not find any results. Try using other forms of the word.`);

      const embed = new Discord.EmbedBuilder()
        .setTitle(`**${data.meta.stems[0]}** (${data.fl})`)
        .setDescription(stripIndents`${data.shortdef.map((definition, i) => `\n(${i + 1}) ${definition}`).join("\n")}`)
        .setColor(colors.gold);

      return interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.log(err);
      return interaction.reply({ content: "An error occurred while trying to define.", ephemeral: true });
    }
  },
};
